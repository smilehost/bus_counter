import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Sector
} from "recharts";
import { BarChart3, PieChart as PieChartIcon, Maximize2, Minimize2, Download } from "lucide-react";
import { useTranslation } from 'react-i18next';
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as XLSX from "xlsx";

import DashboardFilters from "../components/dashboard/DashboardFilters";
import DataTable from "../components/dashboard/DataTable";
import { SkeletonCard, SkeletonChart, SkeletonMap, SkeletonTable } from "../components/Skeleton";
import CustomButton from "../components/CustomButto";
import ReusableModal from "../components/modal";

import { useDashboardStore } from "../store/dashboardStore";


maptilersdk.config.apiKey = "gMPRNdZ7nFG7TFsWmEQr";


const ACCENT_COLOR = "#FFA726";


const COMPANY_LOCATIONS = {
  1: { lat: 18.7883, lng: 98.9853, name: "Chiang Mai" },
  2: { lat: 13.7563, lng: 100.5018, name: "Bangkok" },
  3: { lat: 16.4419, lng: 102.8360, name: "Khon Kaen" },
};

const generateAllBuses = () => {
  // Legacy mock data generator - keeping structure but likely unused
  const companyRoutes = {
    1: ["route_r1", "route_r3", "route_b1"],
    2: ["route_515", "route_140", "route_511", "route_29", "route_504"],
    3: ["route_kk_red", "route_kk_blue", "route_kk_songthaew8"],
  };
  const statuses = ["In Progress", "Completed", "Scheduled"];
  const buses = [];
  let id = 1;

  Object.entries(companyRoutes).forEach(([company, routes]) => {
    const location = COMPANY_LOCATIONS[company];
    routes.forEach((route) => {

      const busCount = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < busCount; i++) {

        const latOffset = (Math.random() - 0.5) * 0.08;
        const lngOffset = (Math.random() - 0.5) * 0.08;

        buses.push({
          id: id++,
          route: route,
          company, // now numeric string or int
          lat: location.lat + latOffset,
          lng: location.lng + lngOffset,
          passengers: Math.floor(Math.random() * 50) + 10,
          status: statuses[Math.floor(Math.random() * statuses.length)],
        });
      }
    });
  });

  return buses;
};

// Create custom marker element
const createMarkerElement = (bus) => {
  const el = document.createElement("div");
  el.className = "bus-marker-container";
  el.style.cssText = "cursor: pointer; transition: all 0.2s ease;";

  const companyColors = {
    1: { bg: "linear-gradient(180deg, #E91E63 0%, #C2185B 100%)", shadow: "rgba(233, 30, 99, 0.5)", hex: "#E91E63" },
    2: { bg: "linear-gradient(180deg, #2196F3 0%, #1565C0 100%)", shadow: "rgba(33, 150, 243, 0.5)", hex: "#2196F3" },
    3: { bg: "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)", shadow: "rgba(76, 175, 80, 0.5)", hex: "#4CAF50" },
  };

  // Safe lookup: try companyId first, then company (for legacy/mock)
  const lookupId = bus.companyId || bus.company;
  const colors = companyColors[lookupId] || companyColors[2];

  const statusColor = bus.status === "Completed"
    ? "#4CAF50"
    : bus.status === "In Progress"
      ? "#FF9800"
      : "#9E9E9E";

  const pulseAnimation = bus.status === "In Progress" ? "animation: pulse 1.5s infinite;" : "";

  // Detailed View (Pin)
  const detailedView = `
    <div class="marker-detailed" style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="
        width: 40px; 
        height: 40px; 
        background: ${colors.bg}; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg);
        display: flex; 
        align-items: center; 
        justify-content: center; 
        box-shadow: 0 4px 15px ${colors.shadow};
        border: 3px solid white;
      ">
        <div style="transform: rotate(45deg);">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"></path>
            <path d="M15 6v6"></path>
            <path d="M2 12h19.6"></path>
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
            <circle cx="7" cy="18" r="2"></circle>
            <path d="M9 18h5"></path>
            <circle cx="16" cy="18" r="2"></circle>
          </svg>
        </div>
      </div>
      <div style="
        position: absolute; 
        top: -4px; 
        right: -4px; 
        width: 14px; 
        height: 14px; 
        border-radius: 50%; 
        border: 2px solid white; 
        background-color: ${statusColor};
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ${pulseAnimation}
      "></div>
      <div style="
        width: 10px;
        height: 4px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        margin-top: 2px;
      "></div>
    </div>
  `;

  // Simple View (Dot)
  const simpleView = `
    <div class="marker-dot" style="display: none; position: relative;">
      <div style="
        width: 12px;
        height: 12px;
        background: ${colors.hex};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
       <div style="
        position: absolute; 
        top: -2px; 
        right: -2px; 
        width: 8px; 
        height: 8px; 
        border-radius: 50%; 
        border: 1px solid white; 
        background-color: ${statusColor};
        ${pulseAnimation}
      "></div>
    </div>
  `;

  el.innerHTML = detailedView + simpleView;
  return el;
};


const createPopupContent = (bus, t) => {
  const statusClass = bus.status === "Completed"
    ? "completed"
    : bus.status === "In Progress"
      ? "in-progress"
      : "scheduled";

  const statusText = bus.status === "Completed"
    ? t("table.completed")
    : bus.status === "In Progress"
      ? t("table.in_progress")
      : t("table.scheduled");

  const statusBg = bus.status === "Completed"
    ? "#E8F5E9"
    : bus.status === "In Progress"
      ? "#FFF3E0"
      : "#F5F5F5";

  const statusTextColor = bus.status === "Completed"
    ? "#2E7D32"
    : bus.status === "In Progress"
      ? "#E65100"
      : "#616161";

  // Get company translation key - use companyId if available
  const companyKey = bus.companyId
    ? `companies.company_${bus.companyId}`
    : `companies.${bus.company}`;

  return `
    <div style="padding: 16px; min-width: 220px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"></path>
            <path d="M15 6v6"></path>
            <path d="M2 12h19.6"></path>
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
            <circle cx="7" cy="18" r="2"></circle>
            <path d="M9 18h5"></path>
            <circle cx="16" cy="18" r="2"></circle>
          </svg>
        </div>
        <div>
          <div style="font-weight: 600; font-size: 16px; color: #333;">${t("dashboard.bus")} #${bus.id}</div>
          <div style="font-size: 12px; color: #888;">${t(companyKey)}</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
          <span style="color: #888;">${t("dashboard.route_label")}</span>
          <span style="font-weight: 500; color: #333;">${t(`routes.${bus.route}`)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
          <span style="color: #888; display: flex; align-items: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 19V5"></path>
              <path d="M5 12l7-7 7 7"></path>
            </svg>
            ${t("dashboard.counter_in")}
          </span>
          <span style="font-weight: 600; color: #4CAF50;">${bus.inCount || 0}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
          <span style="color: #888; display: flex; align-items: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 5v14"></path>
              <path d="M19 12l-7 7-7-7"></path>
            </svg>
            ${t("dashboard.counter_out")}
          </span>
          <span style="font-weight: 600; color: #F44336;">${bus.outCount || 0}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-top: 4px; padding-top: 8px; border-top: 1px solid #f0f0f0;">
          <span style="color: #888;">${t("table.status")}</span>
          <span style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: ${statusBg}; color: ${statusTextColor};">${statusText}</span>
        </div>
      </div>
    </div>
  `;
};


const StatsCard = ({ title, value, change, changeType, icon: Icon, bgColor }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3 h-full">
    <div
      className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bgColor }}
    >
      <Icon size={28} color="white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-xs text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {change && (
        <div
          className="text-xs"
          style={{ color: changeType === "positive" ? "#66BB6A" : "#666" }}
        >
          {change}
        </div>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const mapContainer = useRef(null);
  const mapWrapper = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [isReady, setIsReady] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [mapViewFilter, setMapViewFilter] = useState("all"); // "all" | "in" | "out"
  const [activeIndex, setActiveIndex] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStatus, setExportStatus] = useState('idle');
  const [visibleTableData, setVisibleTableData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onPieEnter = useCallback((_, index) => {
    setActiveIndex(index);
  }, []);


  const {
    filters,
    data,
    setFilter,
    buses,
    busesLoading,
    fetchBuses,
    getFilteredBuses,
    getAvailableCompanies,
    getAvailableBusIds
  } = useDashboardStore();


  const currentBarData = data.barChart[filters.company] || data.barChart.all;
  const currentPieData = data.pieChart[filters.company] || data.pieChart.all;


  const enrichedBarData = currentBarData.map(item => ({
    ...item,
    passengers: Math.floor(item.value / 30) + Math.floor(Math.random() * 20),
  }));


  const translatedBarData = enrichedBarData.map(item => {
    const fullName = t(`routes.${item.name}`);
    // Shorten route names for better display
    const shortName = fullName.length > 12 ? fullName.substring(0, 10) + '...' : fullName;
    return {
      ...item,
      name: shortName,
      fullName: fullName,
    };
  });

  const filteredBarData = filters.route === "all"
    ? translatedBarData
    : translatedBarData.filter(item => enrichedBarData.find(d => d.name === filters.route && t(`routes.${d.name}`).includes(item.name.replace('...', ''))));


  const filteredTableData = data.transactions.filter(row => {
    const companyMatch = filters.company === "all" || row.company === filters.company;
    const routeMatch = filters.route === "all" || row.route === filters.route;
    return companyMatch && routeMatch;
  });


  // Get filtered buses from store
  const filteredBuses = getFilteredBuses();

  // Handle Excel Export - exports only visible rows based on current pagination
  const handleExportExcel = useCallback(() => {
    setShowExportModal(true);
    setExportStatus('loading');

    setTimeout(() => {
      try {
        // Use visibleTableData (current page data) instead of all filteredBuses
        const dataToExport = visibleTableData.length > 0 ? visibleTableData : filteredBuses;
        const exportData = dataToExport.map((bus, index) => ({
          'No.': index + 1,
          'Counter ID': bus.counterId,
          'Bus ID': bus.id,
          'Company ID': bus.companyId,
          'Passengers In': bus.inCount,
          'Passengers Out': bus.outCount,
          'Current Passengers': bus.passengers,
          'Camera ID': bus.cameraId,
          'Status': bus.status,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        ws['!cols'] = [
          { wch: 5 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
          { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 12 },
        ];
        XLSX.utils.book_append_sheet(wb, ws, 'Bus Counter Data');

        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `bus_counter_export_${date}.xlsx`);
        setExportStatus('success');
      } catch (error) {
        console.error('Export error:', error);
        setExportStatus('error');
      }
    }, 500);
  }, [visibleTableData, filteredBuses]);

  // Fetch bus counters from API via store
  useEffect(() => {
    const loadBuses = async () => {
      await fetchBuses();
      setIsReady(true);
    };
    loadBuses();
  }, [fetchBuses, filters.dateRange, filters.customStartDate, filters.customEndDate]);


  const tableColumns = [
    { header: t('table.id'), accessor: "counterId" },
    {
      header: t('dashboard.bus'),
      accessor: "id",
      render: (row) => `#${row.id}`,
    },
    {
      header: t('table.company'),
      accessor: "companyId",
      render: (row) => t(`companies.company_${row.companyId}`),
    },
    {
      header: t('dashboard.counter_in'),
      accessor: "inCount",
      render: (row) => (
        <span className="text-green-600 font-medium">{row.inCount}</span>
      ),
    },
    {
      header: t('dashboard.counter_out'),
      accessor: "outCount",
      render: (row) => (
        <span className="text-red-600 font-medium">{row.outCount}</span>
      ),
    },
    {
      header: t('table.passengers'),
      accessor: "passengers",
      render: (row) => (
        <span className="font-semibold">{row.passengers}</span>
      ),
    },
    {
      header: t('table.camera'),
      accessor: "cameraId",
      render: (row) => <span className="whitespace-nowrap">Camera {row.cameraId}</span>,
    },
    {
      header: t('table.status'),
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${row.status === "Completed" ? "bg-green-100 text-green-700"
            : row.status === "In Progress" ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
            }`}
        >
          {row.status === "Completed" ? t('table.completed') :
            row.status === "In Progress" ? t('table.in_progress') :
              t('table.scheduled')}
        </span>
      ),
    },
  ];


  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="600">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  useEffect(() => {
    if (map.current || !isReady) return;

    // Default to Bangkok (ID 2) or use current company filter
    const defaultCenter = COMPANY_LOCATIONS[filters.company] || COMPANY_LOCATIONS[2];

    if (!defaultCenter) return; // Prevention against undefined

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 11,
      scrollZoom: false,
      doubleClickZoom: false,
      dragRotate: false,
      touchZoomRotate: false,
      boxZoom: false,
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isReady]);


  useEffect(() => {
    if (!map.current) return;

    const companyId = filters.company;

    if (companyId && companyId !== "all" && COMPANY_LOCATIONS[companyId]) {
      const location = COMPANY_LOCATIONS[companyId];
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 12,
        duration: 1500,
      });
    } else {
      // Fallback or "all" view (though "all" is effectively removed)
      // Center of Thailand
      map.current.flyTo({
        center: [100.5018, 15.8700],
        zoom: 5.5,
        duration: 1500,
      });
    }
  }, [filters.company]);


  useEffect(() => {
    if (!map.current) return;

    // Create custom marker element
    const createMarkerElement = (bus) => {
      const el = document.createElement("div");
      el.className = "bus-marker-container";
      el.style.cssText = "cursor: pointer; transition: all 0.2s ease;";

      const companyColors = {
        company_a: { bg: "linear-gradient(180deg, #E91E63 0%, #C2185B 100%)", shadow: "rgba(233, 30, 99, 0.5)", hex: "#E91E63" },
        company_b: { bg: "linear-gradient(180deg, #2196F3 0%, #1565C0 100%)", shadow: "rgba(33, 150, 243, 0.5)", hex: "#2196F3" },
        company_c: { bg: "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)", shadow: "rgba(76, 175, 80, 0.5)", hex: "#4CAF50" },
      };

      const colors = companyColors[bus.company] || companyColors.company_b;

      const statusColor = bus.status === "Completed"
        ? "#4CAF50"
        : bus.status === "In Progress"
          ? "#FF9800"
          : "#9E9E9E";

      const pulseAnimation = bus.status === "In Progress" ? "animation: pulse 1.5s infinite;" : "";

      // Detailed View (Pin)
      const detailedView = `
        <div class="marker-detailed" style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 40px; 
            height: 40px; 
            background: ${colors.bg}; 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg);
            display: flex; 
            align-items: center; 
            justify-content: center; 
            box-shadow: 0 4px 15px ${colors.shadow};
            border: 3px solid white;
          ">
            <div style="transform: rotate(45deg);">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 6v6"></path>
                <path d="M15 6v6"></path>
                <path d="M2 12h19.6"></path>
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
                <circle cx="7" cy="18" r="2"></circle>
                <path d="M9 18h5"></path>
                <circle cx="16" cy="18" r="2"></circle>
              </svg>
            </div>
          </div>
          <div style="
            position: absolute; 
            top: -4px; 
            right: -4px; 
            width: 14px; 
            height: 14px; 
            border-radius: 50%; 
            border: 2px solid white; 
            background-color: ${statusColor};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ${pulseAnimation}
          "></div>
          <div style="
            width: 10px;
            height: 4px;
            background: rgba(0,0,0,0.2);
            border-radius: 50%;
            margin-top: 2px;
          "></div>
        </div>
      `;

      // Simple View (Dot)
      const simpleView = `
        <div class="marker-dot" style="display: none; position: relative;">
          <div style="
            width: 12px;
            height: 12px;
            background: ${colors.hex};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
           <div style="
            position: absolute; 
            top: -2px; 
            right: -2px; 
            width: 8px; 
            height: 8px; 
            border-radius: 50%; 
            border: 1px solid white; 
            background-color: ${statusColor};
            ${pulseAnimation}
          "></div>
        </div>
      `;

      el.innerHTML = detailedView + simpleView;
      return el;
    };

    const updateMarkers = () => {
      // Remove existing markers
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];

      // Add new markers
      filteredBuses.forEach((bus) => {
        const el = createMarkerElement(bus);

        const popup = new maptilersdk.Popup({
          offset: [0, -45],
          closeButton: true,
          closeOnClick: false,
          anchor: 'bottom',
        }).setHTML(createPopupContent(bus, t));

        const marker = new maptilersdk.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([bus.lng, bus.lat])
          .setPopup(popup)
          .addTo(map.current);

        markers.current.push(marker);
      });

      // If only one bus (specific bus selected), flyTo and open popup
      if (filteredBuses.length === 1) {
        const bus = filteredBuses[0];
        map.current.flyTo({
          center: [bus.lng, bus.lat],
          zoom: 15,
          duration: 1000,
        });
        // Open the popup after flying
        setTimeout(() => {
          if (markers.current[0]) {
            markers.current[0].togglePopup();
          }
        }, 1100);
      } else if (filteredBuses.length > 1) {
        // Fit bounds for multiple markers
        const bounds = new maptilersdk.LngLatBounds();
        filteredBuses.forEach((bus) => {
          bounds.extend([bus.lng, bus.lat]);
        });
        map.current.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      }
    };

    if (map.current.loaded()) {
      updateMarkers();
      // Initial zoom check
      const currentZoom = map.current.getZoom();
      if (currentZoom < 12) {
        mapContainer.current.classList.add('map-low-zoom');
      } else {
        mapContainer.current.classList.remove('map-low-zoom');
      }
    } else {
      map.current.on("load", () => {
        updateMarkers();
        // Initial zoom check on load
        const currentZoom = map.current.getZoom();
        if (currentZoom < 12) {
          mapContainer.current.classList.add('map-low-zoom');
        }
      });
    }

    // Zoom listener for marker switching
    const onZoom = () => {
      const zoom = map.current.getZoom();
      if (zoom < 12) {
        mapContainer.current.classList.add('map-low-zoom');
      } else {
        mapContainer.current.classList.remove('map-low-zoom');
      }
    };

    map.current.on('zoom', onZoom);

    // Cleanup zoom listener specifically for this effect to avoid duplicates if re-run
    return () => {
      if (map.current) {
        map.current.off('zoom', onZoom);
      }
    };

  }, [filteredBuses, t]);

  // Fullscreen toggle handler
  const toggleMapFullscreen = useCallback(() => {
    if (!mapWrapper.current) return;

    if (!isMapFullscreen) {
      if (mapWrapper.current.requestFullscreen) {
        mapWrapper.current.requestFullscreen();
      } else if (mapWrapper.current.webkitRequestFullscreen) {
        mapWrapper.current.webkitRequestFullscreen();
      } else if (mapWrapper.current.msRequestFullscreen) {
        mapWrapper.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }, [isMapFullscreen]);

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#333" fontSize={13} fontWeight={600}>
          {t(`routes.${payload.name}`).substring(0, 15) + (t(`routes.${payload.name}`).length > 15 ? '...' : '')}
        </text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#999" fontSize={11}>
          {`฿${value.toLocaleString()}`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 5}
          outerRadius={outerRadius + 8}
          fill={fill}
        />
      </g>
    );
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsMapFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Resize map when fullscreen changes
  useEffect(() => {
    if (map.current) {
      setTimeout(() => {
        map.current.resize();
      }, 100);
    }
  }, [isMapFullscreen]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Pulse animation for in-progress markers */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t('dashboard.title')}</h1>
        <p className="text-sm text-gray-600 mb-4">{t('dashboard.subtitle')}</p>


        <DashboardFilters
          company={filters.company}
          onCompanyChange={(val) => setFilter('company', val)}
          dateRange={filters.dateRange}
          onDateRangeChange={(val) => setFilter('dateRange', val)}
          route={filters.route}
          onRouteChange={(val) => setFilter('route', val)}
          busId={filters.busId}
          onBusIdChange={(val) => setFilter('busId', val)}
          customStartDate={filters.customStartDate}
          customEndDate={filters.customEndDate}
          onCustomDateChange={(type, val) => setFilter(type === 'start' ? 'customStartDate' : 'customEndDate', val)}
          availableBusIds={getAvailableBusIds()}
          availableCompanies={getAvailableCompanies()}
        />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {busesLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          data.stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={t(stat.translationKey)}
              value={stat.value}
              change={stat.change ? `${stat.change} ${t(stat.changeKey)}` : t(stat.changeKey)}
              changeType={stat.changeType}
              icon={stat.icon}
              bgColor={stat.bgColor}
            />
          ))
        )}
      </div>


      <div className={`bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6 ${isMobile && filters.chartType === 'pie' ? 'h-[480px]' : 'h-[350px]'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
          <h2 className="text-lg font-bold">
            {filters.chartType === "bar" ? t('dashboard.revenue_by_route') : t('dashboard.transactions_by_payment')}
          </h2>

          <div className="flex gap-2 self-start sm:self-auto">
            <button
              onClick={() => setFilter('chartType', 'bar')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <BarChart3 size={18} />
              <span className="hidden sm:inline">{t('dashboard.bar_chart')}</span>
              <span className="sm:hidden">Bar</span>
            </button>
            <button
              onClick={() => setFilter('chartType', 'pie')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.chartType === "pie" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <PieChartIcon size={18} />
              <span className="hidden sm:inline">{t('dashboard.pie_chart')}</span>
              <span className="sm:hidden">Pie</span>
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="80%">
          {filters.chartType === "bar" ? (
            <BarChart data={filteredBarData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9800" stopOpacity={1} />
                  <stop offset="100%" stopColor="#F57C00" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={false}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
                height={10}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#666" }}
                tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  border: "none",
                  borderRadius: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  padding: "12px 16px"
                }}
                cursor={{ fill: 'rgba(255, 152, 0, 0.1)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ background: 'white', padding: '12px 16px', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: '#333' }}>
                          {data.fullName || data.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#888' }}>{t('table.revenue')}:</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#FF9800' }}>฿{data.value.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: '#888' }}>{t('table.passengers')}:</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#1976D2' }}>{data.passengers} {t('dashboard.people')}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={filteredBarData}
                cx={isMobile ? "50%" : "35%"}
                cy={isMobile ? "40%" : "50%"}
                innerRadius={50}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
                paddingAngle={2}
              >
                {filteredBarData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'][index % 6]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                formatter={(value, name, props) => [`฿${value.toLocaleString()}`, t(`routes.${props.payload.name}`)]}
              />
              <Legend
                layout={isMobile ? "horizontal" : "vertical"}
                verticalAlign={isMobile ? "bottom" : "middle"}
                align={isMobile ? "center" : "right"}
                iconType="circle"
                iconSize={8}
                wrapperStyle={isMobile ? {
                  fontSize: '11px',
                  bottom: 0,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  paddingTop: '20px'
                } : {
                  paddingLeft: 20,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  fontSize: '12px'
                }}
                formatter={(value, entry) => (
                  <span style={{ color: "#555", fontSize: "0.75rem", fontWeight: 500, marginLeft: 4, marginRight: isMobile ? 8 : 0 }}>
                    {t(`routes.${entry.payload.name}`)}
                  </span>
                )}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>


      <div
        ref={mapWrapper}
        className={`bg-white rounded-lg shadow-sm mb-6 ${isMapFullscreen ? 'p-4' : 'p-6'}`}
        style={isMapFullscreen ? { height: '100%', display: 'flex', flexDirection: 'column' } : {}}
      >
        {/* Header with title and view filter buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
          <h2 className="text-lg font-bold">{t("dashboard.bus_map_title")}</h2>

          {/* In/Out/All Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapViewFilter("all")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${mapViewFilter === "all"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {t("dashboard.show_all")}
            </button>
            <button
              onClick={() => setMapViewFilter("in")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${mapViewFilter === "in"
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5"></path>
                <path d="M5 12l7-7 7 7"></path>
              </svg>
              {t("dashboard.show_in")}
            </button>
            <button
              onClick={() => setMapViewFilter("out")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${mapViewFilter === "out"
                ? "bg-red-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"></path>
                <path d="M19 12l-7 7-7-7"></path>
              </svg>
              {t("dashboard.show_out")}
            </button>
          </div>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainer}
          style={{
            height: isMapFullscreen ? 'calc(100% - 120px)' : '400px',
            width: '100%',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        />

        {/* Bottom Bar with Legend, Count and Fullscreen */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
          {/* Legend */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>{t("dashboard.counter_in")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>{t("dashboard.counter_out")}</span>
          </div>

          {/* Bus Count */}
          <div className="text-gray-600">
            {t("dashboard.showing_buses", { count: filteredBuses.length })}
          </div>

          {/* Fullscreen Button - moved to bottom right */}
          <button
            onClick={toggleMapFullscreen}
            className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
            title={isMapFullscreen ? t('dashboard.exit_fullscreen') : t('dashboard.fullscreen')}
          >
            {isMapFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span className="hidden sm:inline">
              {isMapFullscreen ? t('dashboard.exit_fullscreen') : t('dashboard.fullscreen')}
            </span>
          </button>
        </div>
      </div>


      {/* Map Styles for Zoom Levels */}
      <style>
        {`
          .map-low-zoom .marker-detailed {
            display: none !important;
          }
          .map-low-zoom .marker-dot {
            display: block !important;
          }
          .bus-marker-container:hover .marker-dot {
            transform: scale(1.2);
            transition: transform 0.2s;
          }
        `}
      </style>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{t('dashboard.recent_transactions')}</h2>
          <CustomButton
            variant="outline"
            size="sm"
            icon={<Download size={16} />}
            onClick={handleExportExcel}
            disabled={filteredBuses.length === 0 || exportStatus === 'loading'}
            loading={exportStatus === 'loading'}
          >
            Export Excel
          </CustomButton>
        </div>
        <div className="overflow-x-auto">
          {busesLoading ? (
            <SkeletonTable rows={5} columns={8} />
          ) : (
            <DataTable data={filteredBuses} columns={tableColumns} itemsPerPage={5} onPagedDataChange={setVisibleTableData} />
          )}
        </div>
      </div>

      <ReusableModal
        open={showExportModal}
        onClose={() => { setShowExportModal(false); setExportStatus('idle'); }}
        title="Export to Excel"
        fields={[
          exportStatus === 'loading' ? {
            type: 'info', name: 'status', label: 'Status', value: '⏳ Preparing your file...',
          } : exportStatus === 'success' ? {
            type: 'warning', name: 'success', variant: 'success', icon: '✅',
            message: `Export สำเร็จ! ${visibleTableData.length} รายการ`,
          } : exportStatus === 'error' ? {
            type: 'warning', name: 'error', variant: 'danger', icon: '❌',
            message: 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง',
          } : {
            type: 'info', name: 'info', label: 'จำนวนข้อมูล', value: `${visibleTableData.length} รายการ (จากทั้งหมด ${filteredBuses.length})`,
          },
        ]}
        confirmText={exportStatus === 'success' ? 'Done' : undefined}
        onConfirm={exportStatus === 'success' ? () => { setShowExportModal(false); setExportStatus('idle'); } : undefined}
      />
    </div>
  );
}