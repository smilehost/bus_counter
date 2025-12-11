import React, { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { useTranslation } from "react-i18next";
import { Bus } from "lucide-react";
import { renderToString } from "react-dom/server";
import "./BusMap.css";

// MapTiler API Key
maptilersdk.config.apiKey = "gMPRNdZ7nFG7TFsWmEQr";

// Mock bus data with positions
const MOCK_BUSES = [
    // Route A buses
    { id: 1, route: "Route A", company: "company_a", lat: 13.7563, lng: 100.5018, passengers: 45, status: "In Progress" },
    { id: 2, route: "Route A", company: "company_b", lat: 13.7450, lng: 100.5350, passengers: 38, status: "Completed" },
    { id: 3, route: "Route A", company: "company_c", lat: 13.7680, lng: 100.4950, passengers: 22, status: "Scheduled" },
    // Route B buses
    { id: 4, route: "Route B", company: "company_a", lat: 13.7300, lng: 100.5200, passengers: 52, status: "In Progress" },
    { id: 5, route: "Route B", company: "company_b", lat: 13.7550, lng: 100.5650, passengers: 29, status: "Completed" },
    { id: 6, route: "Route B", company: "company_c", lat: 13.7420, lng: 100.4800, passengers: 41, status: "In Progress" },
    // Route C buses
    { id: 7, route: "Route C", company: "company_a", lat: 13.7800, lng: 100.5400, passengers: 33, status: "Scheduled" },
    { id: 8, route: "Route C", company: "company_b", lat: 13.7250, lng: 100.5100, passengers: 48, status: "In Progress" },
    { id: 9, route: "Route C", company: "company_c", lat: 13.7600, lng: 100.5550, passengers: 27, status: "Completed" },
    // Route D buses
    { id: 10, route: "Route D", company: "company_a", lat: 13.7380, lng: 100.5450, passengers: 35, status: "In Progress" },
    { id: 11, route: "Route D", company: "company_b", lat: 13.7700, lng: 100.5250, passengers: 19, status: "Scheduled" },
    { id: 12, route: "Route D", company: "company_c", lat: 13.7150, lng: 100.5000, passengers: 56, status: "Completed" },
];

// Helper to create marker element
const createMarkerElement = (bus) => {
    const el = document.createElement("div");
    el.className = "bus-marker";

    const statusClass = bus.status === "Completed"
        ? "completed"
        : bus.status === "In Progress"
            ? "in-progress"
            : "scheduled";

    el.innerHTML = `
    <div class="bus-marker-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6v6"></path>
        <path d="M15 6v6"></path>
        <path d="M2 12h19.6"></path>
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
        <circle cx="7" cy="18" r="2"></circle>
        <path d="M9 18h5"></path>
        <circle cx="16" cy="18" r="2"></circle>
      </svg>
      <div class="bus-marker-status ${statusClass}"></div>
    </div>
  `;

    return el;
};

// Helper to create popup content
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

    return `
    <div class="bus-popup">
      <div class="bus-popup-header">
        <div class="bus-popup-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <div class="bus-popup-title">${t("dashboard.bus")} #${bus.id}</div>
          <div class="bus-popup-subtitle">${bus.route}</div>
        </div>
      </div>
      <div class="bus-popup-info">
        <div class="bus-popup-row">
          <span class="bus-popup-label">${t("table.company")}</span>
          <span class="bus-popup-value">${t(`companies.${bus.company}`)}</span>
        </div>
        <div class="bus-popup-row">
          <span class="bus-popup-label">${t("table.passengers")}</span>
          <span class="bus-popup-value">${bus.passengers}</span>
        </div>
        <div class="bus-popup-row">
          <span class="bus-popup-label">${t("table.status")}</span>
          <span class="bus-popup-status ${statusClass}">${statusText}</span>
        </div>
      </div>
    </div>
  `;
};

export default function BusMap({ company, route }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markers = useRef([]);
    const { t } = useTranslation();

    // Filter buses based on props
    const filteredBuses = MOCK_BUSES.filter((bus) => {
        const companyMatch = company === "all" || bus.company === company;
        const routeMatch = route === "all" || bus.route.toLowerCase().replace(" ", "_") === route;
        return companyMatch && routeMatch;
    });

    // Initialize map
    useEffect(() => {
        if (map.current) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [100.5018, 13.7563], // Bangkok center
            zoom: 11,
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Update markers when filters change
    useEffect(() => {
        if (!map.current) return;

        // Wait for map to be loaded
        const updateMarkers = () => {
            // Remove existing markers
            markers.current.forEach((marker) => marker.remove());
            markers.current = [];

            // Add new markers
            filteredBuses.forEach((bus) => {
                const el = createMarkerElement(bus);

                const popup = new maptilersdk.Popup({
                    offset: 25,
                    closeButton: true,
                    closeOnClick: false,
                }).setHTML(createPopupContent(bus, t));

                const marker = new maptilersdk.Marker({ element: el })
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
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold mb-4">{t("dashboard.bus_map_title")}</h2>
            <div className="bus-map-container" ref={mapContainer} />
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
    );
}
