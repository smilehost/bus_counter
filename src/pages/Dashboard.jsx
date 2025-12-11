import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { useTranslation } from 'react-i18next';

// Components
import DashboardFilters from "../components/dashboard/DashboardFilters";
import DataTable from "../components/dashboard/DataTable";
import BusMap from "../components/dashboard/BusMap";

// Store
import { useDashboardStore } from "../store/dashboardStore";

// Color scheme constants
const ACCENT_COLOR = "#FFA726";

// Sub-component: StatsCard
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

  // 1. ดึง State และ Actions จาก Store
  const { filters, data, setFilter } = useDashboardStore();

  // 2. Derived State (คำนวณข้อมูลที่จะแสดงผลตาม Filter)
  // การคำนวณนี้ทำใน Component เพื่อให้ Reactive กับการเปลี่ยน Filter ทันที
  const currentBarData = data.barChart[filters.company] || data.barChart.all;
  const currentPieData = data.pieChart[filters.company] || data.pieChart.all;

  const filteredBarData = filters.route === "all"
    ? currentBarData
    : currentBarData.filter(item => item.name.toLowerCase().replace(" ", "_") === filters.route);

  // 3. Table Column Config
  const tableColumns = [
    { header: t('table.id'), accessor: "id" },
    { header: t('table.route'), accessor: "route" },
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

  // Helper for Pie Label
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

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t('dashboard.title')}</h1>
        <p className="text-sm text-gray-600 mb-4">{t('dashboard.subtitle')}</p>

        {/* Filters: เชื่อมต่อกับ Store Actions */}
        <DashboardFilters
          company={filters.company}
          onCompanyChange={(val) => setFilter('company', val)}
          dateRange={filters.dateRange}
          onDateRangeChange={(val) => setFilter('dateRange', val)}
          route={filters.route}
          onRouteChange={(val) => setFilter('route', val)}
        />
      </div>

      {/* Stats Cards: Map ข้อมูลจาก Store */}
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

      {/* Chart Section */}
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
            <BarChart data={filteredBarData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 12 }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="value" fill={ACCENT_COLOR} radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={currentPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomPieLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {currentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: "#666", fontSize: "0.875rem" }}>
                    {value}: {entry.payload.value}%
                  </span>
                )}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Bus Map */}
      <BusMap company={filters.company} route={filters.route} />

      {/* Data Table */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">{t('dashboard.recent_transactions')}</h2>
        <DataTable data={data.transactions} columns={tableColumns} itemsPerPage={5} />
      </div>
    </div>
  );
}