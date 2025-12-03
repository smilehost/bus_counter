import React from "react";
import { Filter } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function DashboardFilters({
    company,
    onCompanyChange,
    dateRange,
    onDateRangeChange,
    route,
    onRouteChange
}) {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                    <Filter size={18} />
                    <span className="text-sm font-medium">{t('filters.label')}</span>
                </div>

                {/* Company Filter */}
                <select
                    value={company}
                    onChange={(e) => onCompanyChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">{t('filters.all_companies')}</option>
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
                    <option value="today">{t('filters.date.today')}</option>
                    <option value="yesterday">{t('filters.date.yesterday')}</option>
                    <option value="last_7_days">{t('filters.date.last_7_days')}</option>
                    <option value="last_30_days">{t('filters.date.last_30_days')}</option>
                    <option value="this_month">{t('filters.date.this_month')}</option>
                    <option value="last_month">{t('filters.date.last_month')}</option>
                </select>

                {/* Route Filter */}
                <select
                    value={route}
                    onChange={(e) => onRouteChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">{t('filters.all_routes')}</option>
                    <option value="route_a">Route A</option>
                    <option value="route_b">Route B</option>
                    <option value="route_c">Route C</option>
                    <option value="route_d">Route D</option>
                </select>
            </div>
        </div>
    );
}