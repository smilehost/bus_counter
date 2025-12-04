import React, { useState, useCallback, useMemo } from "react";
import { Filter, Calendar, Clock, BarChart2 } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function DashboardFilters({
    company,
    onCompanyChange = () => { },
    dateRange,
    onDateRangeChange = () => { },
    route,
    onRouteChange = () => { },
    customStartDate,
    customEndDate,
    onCustomDateChange = () => { },
    onIncludeTimeChange = () => { },
    interval = 'hourly',
    onIntervalChange = () => { }
}) {
    const { t } = useTranslation();

    // State for manual input
    const [manualStartDate, setManualStartDate] = useState('');
    const [manualEndDate, setManualEndDate] = useState('');
    const [manualStartTime, setManualStartTime] = useState('');
    const [manualEndTime, setManualEndTime] = useState('');

    const showDatePicker = dateRange === 'custom';
    const showTimePicker = ['today', 'yesterday'].includes(dateRange);

    const getTimeFromDateString = useCallback((dateString) => {
        if (!dateString) return '';

        if (dateString.includes('T')) {
            const timePart = dateString.split('T')[1];
            if (timePart && timePart.length >= 5) {
                return timePart.substring(0, 5);
            }
        }

        return '';
    }, []);

    const getBaseDate = useCallback((rangeType) => {
        const date = new Date();
        if (rangeType === 'yesterday') {
            date.setDate(date.getDate() - 1);
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, []);

    const startDateInput = useMemo(() => {
        if (manualStartDate) return manualStartDate;
        if (customStartDate && customStartDate.includes('T')) {
            return customStartDate.split('T')[0];
        }
        return '';
    }, [customStartDate, manualStartDate]);

    const endDateInput = useMemo(() => {
        if (manualEndDate) return manualEndDate;
        if (customEndDate && customEndDate.includes('T')) {
            return customEndDate.split('T')[0];
        }
        return '';
    }, [customEndDate, manualEndDate]);

    const startTimeInput = useMemo(() => {
        if (manualStartTime) return manualStartTime;
        return getTimeFromDateString(customStartDate);
    }, [customStartDate, manualStartTime, getTimeFromDateString]);

    const endTimeInput = useMemo(() => {
        if (manualEndTime) return manualEndTime;
        return getTimeFromDateString(customEndDate);
    }, [customEndDate, manualEndTime, getTimeFromDateString]);

    const handleManualTimeInput = (type, inputValue) => {
        let cleaned = inputValue.replace(/[^\d:]/g, '');

        let hours = '';
        let minutes = '00';

        if (cleaned.includes(':')) {
            const parts = cleaned.split(':');
            hours = parts[0].padStart(2, '0');
            minutes = (parts[1] || '00').padStart(2, '0');
        } else if (cleaned.length >= 3) {
            hours = cleaned.substring(0, 2).padStart(2, '0');
            minutes = cleaned.substring(2, 4).padStart(2, '0');
        } else if (cleaned.length > 0) {
            hours = cleaned.padStart(2, '0');
            minutes = '00';
        }

        const h = parseInt(hours);
        const m = parseInt(minutes);

        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            const formattedTime = `${hours}:${minutes}`;

            if (type === 'start') {
                setManualStartTime(formattedTime);
            } else {
                setManualEndTime(formattedTime);
            }

            const baseDate = getBaseDate(dateRange);
            const finalDateTime = `${baseDate}T${formattedTime}`;
            onCustomDateChange(type, finalDateTime);

            return true;
        }

        return false;
    };

    const handleDateRangeChange = (e) => {
        const val = e.target.value;
        onDateRangeChange(val);

        if (['today', 'yesterday'].includes(val)) {
            onIncludeTimeChange(true);

            const base = getBaseDate(val);
            onCustomDateChange('start', `${base}T00:00`);
            onCustomDateChange('end', `${base}T23:59`);

            setManualStartDate('');
            setManualEndDate('');
            setManualStartTime('');
            setManualEndTime('');
        } else if (val === 'custom') {
            const today = getBaseDate('today');
            onCustomDateChange('start', `${today}T00:00`);
            onCustomDateChange('end', `${today}T23:59`);
            setManualStartDate(today);
            setManualEndDate(today);
        }
    };

    const handleDateInputChange = (type, value) => {
        if (type === 'start') {
            setManualStartDate(value);
        } else {
            setManualEndDate(value);
        }

        if (value && value.length === 10 && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const time = type === 'start' ? 'T00:00' : 'T23:59';
            onCustomDateChange(type, `${value}${time}`);
        }
    };

    const parseManualDateInput = (type, inputValue) => {
        let cleaned = inputValue.replace(/[^\d/-]/g, '');

        const patterns = [
            /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
            /^(\d{1,2})(\d{2})(\d{4})$/
        ];

        for (let pattern of patterns) {
            const match = cleaned.match(pattern);
            if (match) {
                const day = match[1].padStart(2, '0');
                const month = match[2].padStart(2, '0');
                const year = match[3];

                const monthNum = parseInt(month);
                const dayNum = parseInt(day);

                if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
                    const formattedDate = `${year}-${month}-${day}`;
                    const time = type === 'start' ? 'T00:00' : 'T23:59';

                    if (type === 'start') {
                        setManualStartDate(formattedDate);
                    } else {
                        setManualEndDate(formattedDate);
                    }

                    onCustomDateChange(type, `${formattedDate}${time}`);
                    return true;
                }
            }
        }

        return false;
    };

    const handleManualInputBlur = (type, value) => {
        if (value && !value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            parseManualDateInput(type, value);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-col gap-4">
                {/* First Row - Main Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Filter size={18} />
                        <span className="text-sm font-medium">{t('filters.label')}</span>
                    </div>

                    {/* Company Filter */}
                    <select
                        value={company}
                        onChange={(e) => onCompanyChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer bg-white"
                    >
                        <option value="all">{t('filters.all_companies')}</option>
                        <option value="company_a">{t('companies.company_a')}</option>
                        <option value="company_b">{t('companies.company_b')}</option>
                        <option value="company_c">{t('companies.company_c')}</option>
                    </select>

                    {/* Date Range Filter */}
                    <div className="relative flex-1 sm:flex-initial">
                        <select
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer bg-white"
                        >
                            <option value="all">{t('filters.date.all_date')}</option>
                            <option value="today">{t('filters.date.today')}</option>
                            <option value="yesterday">{t('filters.date.yesterday')}</option>
                            <option value="last_7_days">{t('filters.date.last_7_days')}</option>
                            <option value="last_30_days">{t('filters.date.last_30_days')}</option>
                            <option value="this_month">{t('filters.date.this_month')}</option>
                            <option value="last_month">{t('filters.date.last_month')}</option>
                            <option value="custom">{t('filters.date.custom')}</option>
                        </select>
                    </div>

                    {/* Route Filter */}
                    <select
                        value={route}
                        onChange={(e) => onRouteChange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer bg-white"
                    >
                        <option value="all">{t('filters.all_routes')}</option>
                        <option value="route_a">{t('routes.route_a')}</option>
                        <option value="route_b">{t('routes.route_b')}</option>
                        <option value="route_c">{t('routes.route_c')}</option>
                        <option value="route_d">{t('routes.route_d')}</option>
                    </select>
                </div>

                {/* Second Row - Time & Interval Options */}
                {showTimePicker && (
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200 bg-gray-50 border border-gray-200">
                        <div className="flex items-center gap-2 text-gray-800 font-medium mr-2">
                            <Clock size={18} />
                            <span className="text-sm">
                                {t('filters.specify_time')}:
                            </span>
                        </div>

                        {/* Start Time Picker */}
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm hover:border-blue-400 transition-colors">
                            <span className="text-xs text-gray-500 font-bold uppercase">{t('filters.from')}</span>
                            <input
                                type="text"
                                value={startTimeInput}
                                onChange={(e) => {
                                    setManualStartTime(e.target.value);
                                }}
                                onBlur={(e) => handleManualTimeInput('start', e.target.value)}
                                placeholder="HH:MM"
                                className="text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text bg-white border-0 p-1 min-w-[70px] text-center"
                            />
                        </div>

                        <span className="text-gray-400 font-bold">→</span>

                        {/* End Time Picker */}
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm hover:border-blue-400 transition-colors">
                            <span className="text-xs text-gray-500 font-bold uppercase">{t('filters.to')}</span>
                            <input
                                type="text"
                                value={endTimeInput}
                                onChange={(e) => {
                                    setManualEndTime(e.target.value);
                                }}
                                onBlur={(e) => handleManualTimeInput('end', e.target.value)}
                                placeholder="HH:MM"
                                className="text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text bg-white border-0 p-1 min-w-[70px] text-center"
                            />
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200 mx-2 hidden sm:block"></div>

                        {/* Interval Selector */}
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm hover:border-blue-400 transition-colors ml-auto sm:ml-0">
                            <BarChart2 size={16} className="text-gray-600" />
                            <span className="text-xs text-gray-500 font-bold mr-1">{t('filters.view')}</span>
                            <select
                                value={interval}
                                onChange={(e) => onIntervalChange(e.target.value)}
                                className="text-sm font-medium text-gray-700 focus:outline-none bg-white cursor-pointer border-0 p-0"
                            >
                                <option value="hourly">{t('filters.hourly')}</option>
                                <option value="summary">{t('filters.summary')}</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Third Row - Custom Date Picker */}
                {showDatePicker && (
                    <div className="flex items-center gap-3 p-3 rounded-lg flex-wrap bg-gray-50 border border-gray-200">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold mb-1 px-1 text-gray-500">
                                {t('filters.start_date_label')}
                            </label>
                            <input
                                type="date"
                                value={startDateInput}
                                onChange={(e) => handleDateInputChange('start', e.target.value)}
                                onBlur={(e) => handleManualInputBlur('start', e.target.value)}
                                placeholder={t('filters.date_placeholder')}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px] cursor-pointer bg-white"
                            />
                        </div>

                        <span className="text-gray-400 mt-5">→</span>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold mb-1 px-1 text-gray-500">
                                {t('filters.end_date_label')}
                            </label>
                            <input
                                type="date"
                                value={endDateInput}
                                onChange={(e) => handleDateInputChange('end', e.target.value)}
                                onBlur={(e) => handleManualInputBlur('end', e.target.value)}
                                placeholder={t('filters.date_placeholder')}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px] cursor-pointer bg-white"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}