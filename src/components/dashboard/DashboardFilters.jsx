import React from "react";
import { Filter } from "lucide-react";

export default function DashboardFilters({
    company,
    onCompanyChange,
    dateRange,
    onDateRangeChange,
    route,
    onRouteChange
}) {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                    <Filter size={18} />
                    <span className="text-sm font-medium">Filters:</span>
                </div>

                {/* Company Filter */}
                <select
                    value={company}
                    onChange={(e) => onCompanyChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Companies</option>
                    <option value="company_a">Company A</option>
                    <option value="company_b">Company B</option>
                    <option value="company_c">Company C</option>
                </select>

                {/* Date Range Filter */}
                <select
                    value={dateRange}
                    onChange={(e) => onDateRangeChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="today">Today</option>
                    <option value="all_day">All Day</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                    <option value="night">Night</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                </select>

                {/* Route Filter */}
                <select
                    value={route}
                    onChange={(e) => onRouteChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Routes</option>
                    <option value="route_a">Route A</option>
                    <option value="route_b">Route B</option>
                    <option value="route_c">Route C</option>
                    <option value="route_d">Route D</option>
                </select>
            </div>
        </div>
    );
}