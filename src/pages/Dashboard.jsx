import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Users, Bus, Map, Filter } from "lucide-react";

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
  const [company, setCompany] = useState("all");
  const [province, setProvince] = useState("all");

  const stats = [
    {
      title: "Total Passengers",
      value: "420",
      change: "+8.1% from yesterday",
      changeType: "positive",
      icon: Users,
      bgColor: successColor,
    },
    {
      title: "Total Revenue",
      value: "$12,600",
      change: "+12.3% from yesterday",
      changeType: "positive",
      icon: Bus,
      bgColor: primaryColor,
    },
    {
      title: "Active Routes",
      value: "4",
      change: "Today",
      icon: Map,
      bgColor: "#AB47BC",
    },
  ];

  const pieData = [
    { name: "Cash", value: 57, color: successColor },
    { name: "QR Code", value: 43, color: secondaryColor },
  ];

  const barData = [
    { name: "Route A", value: 3500 },
    { name: "Route B", value: 2500 },
    { name: "Route C", value: 4500 },
    { name: "Route D", value: 1800 },
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-gray-600 mb-4">
          Today's overview of transactions and statistics
        </p>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Filter size={18} />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Companies</option>
              <option value="a">Company A</option>
              <option value="b">Company B</option>
            </select>

            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Provinces</option>
              <option value="bk">Bangkok</option>
              <option value="cm">Chiang Mai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm" style={{ height: "420px" }}>
          <h2 className="text-lg font-bold mb-4">Transactions by Payment Method</h2>
          <ResponsiveContainer width="100%" height="85%">
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
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm" style={{ height: "420px" }}>
          <h2 className="text-lg font-bold mb-4">Revenue by Route</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
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
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}