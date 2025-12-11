import React, { useEffect, useRef, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";


import DashboardFilters from "../components/dashboard/DashboardFilters";
import DataTable from "../components/dashboard/DataTable";


import { useDashboardStore } from "../store/dashboardStore";


maptilersdk.config.apiKey = "gMPRNdZ7nFG7TFsWmEQr";


const ACCENT_COLOR = "#FFA726";


const COMPANY_LOCATIONS = {
  company_a: { lat: 18.7883, lng: 98.9853, name: "Chiang Mai" },
  company_b: { lat: 13.7563, lng: 100.5018, name: "Bangkok" },
  company_c: { lat: 16.4419, lng: 102.8360, name: "Khon Kaen" },
};
const generateAllBuses = () => {
  const companyRoutes = {
    company_a: ["route_r1", "route_r3", "route_b1"],
    company_b: ["route_515", "route_140", "route_511", "route_29", "route_504"],
    company_c: ["route_kk_red", "route_kk_blue", "route_kk_songthaew8"],
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
          company,
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

const createMarkerElement = (bus) => {
  const el = document.createElement("div");
  el.style.cssText = "cursor: pointer; transition: transform 0.2s ease; width: 40px; height: 50px;";


  const companyColors = {
    company_a: { bg: "linear-gradient(180deg, #E91E63 0%, #C2185B 100%)", shadow: "rgba(233, 30, 99, 0.5)" },
    company_b: { bg: "linear-gradient(180deg, #2196F3 0%, #1565C0 100%)", shadow: "rgba(33, 150, 243, 0.5)" },
    company_c: { bg: "linear-gradient(180deg, #4CAF50 0%, #2E7D32 100%)", shadow: "rgba(76, 175, 80, 0.5)" },
  };

  const colors = companyColors[bus.company] || companyColors.company_b;

  const statusColor = bus.status === "Completed"
    ? "#4CAF50"
    : bus.status === "In Progress"
      ? "#FF9800"
      : "#9E9E9E";

  const pulseAnimation = bus.status === "In Progress" ? "animation: pulse 1.5s infinite;" : "";

  el.innerHTML = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">

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

  return `
    <div style="padding: 16px; min-width: 200px;">
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
          <div style="font-size: 12px; color: #888;">${t(`routes.${bus.route}`)}</div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
          <span style="color: #888;">${t("table.company")}</span>
          <span style="font-weight: 500; color: #333;">${t(`companies.${bus.company}`)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
          <span style="color: #888;">${t("table.passengers")}</span>
          <span style="font-weight: 500; color: #333;">${bus.passengers}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
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
  const map = useRef(null);
  const markers = useRef([]);
  const [buses, setBuses] = useState([]);
  const [isReady, setIsReady] = useState(false);


  const { filters, data, setFilter } = useDashboardStore();


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


  const filteredBuses = buses.filter((bus) => {
    const companyMatch = filters.company === "all" || bus.company === filters.company;
    const routeMatch = filters.route === "all" || bus.route === filters.route || filters.route === t(`routes.${bus.route}`);
    return companyMatch && routeMatch;
  });


  useEffect(() => {
    setBuses(generateAllBuses());
    setIsReady(true);
  }, []);


  const tableColumns = [
    { header: t('table.id'), accessor: "id" },
    {
      header: t('table.route'),
      accessor: "route",
      render: (row) => t(`routes.${row.route}`),
    },
    {
      header: t('table.company'),
      accessor: "company",
      render: (row) => t(`companies.${row.company}`),
    },
    { header: t('table.passengers'), accessor: "passengers" },
    { header: t('table.revenue'), accessor: "revenue" },
    { header: t('table.time'), accessor: "time" },
    {
      header: t('table.status'),
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "Completed" ? "bg-green-100 text-green-700"
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

    // Default to Bangkok or first filtered bus location
    const defaultCenter = COMPANY_LOCATIONS.company_b; // Bangkok

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 11,
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

    if (filters.company !== "all" && COMPANY_LOCATIONS[filters.company]) {
      const location = COMPANY_LOCATIONS[filters.company];
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 12,
        duration: 1500,
      });
    } else {
      // When "all" is selected, show Thailand overview
      map.current.flyTo({
        center: [100.5018, 15.8700], // Center of Thailand
        zoom: 5.5,
        duration: 1500,
      });
    }
  }, [filters.company]);


  useEffect(() => {
    if (!map.current) return;

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

      // Fit bounds if there are markers
      if (filteredBuses.length > 0) {
        const bounds = new maptilersdk.LngLatBounds();
        filteredBuses.forEach((bus) => {
          bounds.extend([bus.lng, bus.lat]);
        });
        map.current.fitBounds(bounds, { padding: 60, maxZoom: 13 });
      }
    };

    if (map.current.loaded()) {
      updateMarkers();
    } else {
      map.current.on("load", updateMarkers);
    }
  }, [filteredBuses, t]);

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
        />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {data.stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={t(stat.translationKey)}
            value={stat.value}
            change={stat.change ? `${stat.change} ${t(stat.changeKey)}` : t(stat.changeKey)}
            changeType={stat.changeType}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>


      <div className="bg-white rounded-lg p-6 shadow-sm mb-6" style={{ height: "420px" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {filters.chartType === "bar" ? t('dashboard.revenue_by_route') : t('dashboard.transactions_by_payment')}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('chartType', 'bar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <BarChart3 size={18} />
              {t('dashboard.bar_chart')}
            </button>
            <button
              onClick={() => setFilter('chartType', 'pie')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filters.chartType === "pie" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <PieChartIcon size={18} />
              {t('dashboard.pie_chart')}
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          {filters.chartType === "bar" ? (
            <BarChart data={filteredBarData} margin={{ top: 10, right: 15, left: -10, bottom: 60 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9800" stopOpacity={1} />
                  <stop offset="100%" stopColor="#F57C00" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: "#888" }}
                angle={-35}
                textAnchor="end"
                height={60}
                interval={0}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#888" }}
                tickFormatter={(value) => `฿${(value / 1000).toFixed(0)}k`}
                axisLine={false}
                tickLine={false}
                width={45}
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
                data={currentPieData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={CustomPieLabel}
                outerRadius={100}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={3}
              >
                {currentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={40}
                iconType="circle"
                iconSize={8}
                formatter={(value, entry) => (
                  <span style={{ color: "#555", fontSize: "0.75rem", fontWeight: 500 }}>
                    {value}: {entry.payload.value}%
                  </span>
                )}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>


      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-lg font-bold mb-4">{t("dashboard.bus_map_title")}</h2>
        <div
          ref={mapContainer}
          style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden" }}
        />
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>{t("table.completed")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-400"></span>
            <span>{t("table.in_progress")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            <span>{t("table.scheduled")}</span>
          </div>
          <div className="ml-auto">
            {t("dashboard.showing_buses", { count: filteredBuses.length })}
          </div>
        </div>
      </div>


      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">{t('dashboard.recent_transactions')}</h2>
        <DataTable data={filteredTableData} columns={tableColumns} itemsPerPage={5} />
      </div>
    </div>
  );
}