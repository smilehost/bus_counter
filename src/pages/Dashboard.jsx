import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Users, Bus, Map, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import DataTable from "../components/dashboard/DataTable";
import { useTranslation } from 'react-i18next';

// Color scheme
const primaryColor = "#1976D2";
const secondaryColor = "#64B5F6";
const accentColor = "#FFA726";
const successColor = "#66BB6A";

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
          style={{ color: changeType === "positive" ? successColor : "#666" }}
        >
          {change}
        </div>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [company, setCompany] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [route, setRoute] = useState("all");
  const [chartType, setChartType] = useState("bar"); // Default: bar chart

  // Mock data by company
  const allBarData = {
    all: [
      { name: "Route A", value: 3500 },
      { name: "Route B", value: 2500 },
      { name: "Route C", value: 4500 },
      { name: "Route D", value: 1800 },
    ],
    company_a: [
      { name: "Route A", value: 2800 },
      { name: "Route B", value: 2100 },
      { name: "Route C", value: 3600 },
      { name: "Route D", value: 1500 },
    ],
    company_b: [
      { name: "Route A", value: 3200 },
      { name: "Route B", value: 1900 },
      { name: "Route C", value: 4100 },
      { name: "Route D", value: 1600 },
    ],
    company_c: [
      { name: "Route A", value: 3100 },
      { name: "Route B", value: 2300 },
      { name: "Route C", value: 4200 },
      { name: "Route D", value: 1700 },
    ],
  };

  const allPieData = {
    all: [
      { name: "Cash", value: 57, color: successColor },
      { name: "QR Code", value: 43, color: secondaryColor },
    ],
    company_a: [
      { name: "Cash", value: 65, color: successColor },
      { name: "QR Code", value: 35, color: secondaryColor },
    ],
    company_b: [
      { name: "Cash", value: 48, color: successColor },
      { name: "QR Code", value: 52, color: secondaryColor },
    ],
    company_c: [
      { name: "Cash", value: 60, color: successColor },
      { name: "QR Code", value: 40, color: secondaryColor },
    ],
  };

  // Get data based on selected company
  const barData = allBarData[company] || allBarData.all;
  const pieData = allPieData[company] || allPieData.all;

  // Filter bar data by route if specific route is selected
  const filteredBarData = route === "all"
    ? barData
    : barData.filter(item => item.name.toLowerCase().replace(" ", "_") === route);

  const stats = [
    {
      title: t('dashboard.total_passengers'),
      value: "420",
      change: `+8.1% ${t('dashboard.from_yesterday')}`,
      changeType: "positive",
      icon: Users,
      bgColor: successColor,
    },
    {
      title: t('dashboard.total_revenue'),
      value: "$12,600",
      change: `+12.3% ${t('dashboard.from_yesterday')}`,
      changeType: "positive",
      icon: Bus,
      bgColor: primaryColor,
    },
    {
      title: t('dashboard.active_routes'),
      value: "4",
      change: t('dashboard.today'),
      icon: Map,
      bgColor: "#AB47BC",
    },
  ];

  // Table data
  const tableData = [
    { id: 1, route: "Route A", passengers: 245, revenue: "$3,500", time: "08:30 AM", status: "Completed" },
    { id: 2, route: "Route B", passengers: 198, revenue: "$2,500", time: "09:15 AM", status: "Completed" },
    { id: 3, route: "Route C", passengers: 312, revenue: "$4,500", time: "10:00 AM", status: "Completed" },
    { id: 4, route: "Route D", passengers: 156, revenue: "$1,800", time: "10:45 AM", status: "Completed" },
    { id: 5, route: "Route A", passengers: 223, revenue: "$3,200", time: "11:30 AM", status: "In Progress" },
    { id: 6, route: "Route B", passengers: 189, revenue: "$2,400", time: "12:15 PM", status: "In Progress" },
    { id: 7, route: "Route C", passengers: 267, revenue: "$4,100", time: "01:00 PM", status: "Scheduled" },
    { id: 8, route: "Route D", passengers: 145, revenue: "$1,700", time: "01:45 PM", status: "Scheduled" },
    { id: 9, route: "Route A", passengers: 234, revenue: "$3,300", time: "02:30 PM", status: "Scheduled" },
    { id: 10, route: "Route B", passengers: 201, revenue: "$2,600", time: "03:15 PM", status: "Scheduled" },
    { id: 11, route: "Route C", passengers: 289, revenue: "$4,300", time: "04:00 PM", status: "Scheduled" },
    { id: 12, route: "Route D", passengers: 167, revenue: "$1,900", time: "04:45 PM", status: "Scheduled" },
  ];

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
          className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === "Completed"
            ? "bg-green-100 text-green-700"
            : row.status === "In Progress"
              ? "bg-blue-100 text-blue-700"
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
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t('dashboard.title')}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {t('dashboard.subtitle')}
        </p>

        {/* Filters */}
        <DashboardFilters
          company={company}
          onCompanyChange={setCompany}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          route={route}
          onRouteChange={setRoute}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Chart Section with Toggle */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6" style={{ height: "420px" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {chartType === "bar" ? t('dashboard.revenue_by_route') : t('dashboard.transactions_by_payment')}
          </h2>

          {/* Chart Toggle Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("bar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === "bar"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <BarChart3 size={18} />
              {t('dashboard.bar_chart')}
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === "pie"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              <PieChartIcon size={18} />
              {t('dashboard.pie_chart')}
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height="85%">
          {chartType === "bar" ? (
            <BarChart data={filteredBarData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
              <Bar dataKey="value" fill={accentColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomPieLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
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

      {/* Data Table */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">{t('dashboard.recent_transactions')}</h2>
        <DataTable data={tableData} columns={tableColumns} itemsPerPage={5} />
      </div>
    </div>
  );
}