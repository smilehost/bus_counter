import React, { useState, useCallback, useMemo } from "react";
import { Filter, Clock, BarChart2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import ThaiDatePicker from './ThaiDatePicker';

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

    // Time specific states
    const [startHour, setStartHour] = useState('');
    const [startMinute, setStartMinute] = useState('');
    const [endHour, setEndHour] = useState('');
    const [endMinute, setEndMinute] = useState('');

    const showDatePicker = dateRange === 'custom';
    const showSingleDatePicker = dateRange === 'single_day';
    const showTimePicker = ['today', 'yesterday'].includes(dateRange);

    const getTimeParts = useCallback((dateString) => {
        if (!dateString || !dateString.includes('T')) return { h: '', m: '' };
        const timePart = dateString.split('T')[1];
        if (!timePart) return { h: '', m: '' };
        const [h, m] = timePart.split(':');
        return { h: h || '', m: m || '' };
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

    // Derived time inputs
    const startHourInput = useMemo(() => {
        if (startHour !== '') return startHour;
        return getTimeParts(customStartDate).h;
    }, [startHour, customStartDate, getTimeParts]);

    const startMinuteInput = useMemo(() => {
        if (startMinute !== '') return startMinute;
        return getTimeParts(customStartDate).m;
    }, [startMinute, customStartDate, getTimeParts]);

    const endHourInput = useMemo(() => {
        if (endHour !== '') return endHour;
        return getTimeParts(customEndDate).h;
    }, [endHour, customEndDate, getTimeParts]);

    const endMinuteInput = useMemo(() => {
        if (endMinute !== '') return endMinute;
        return getTimeParts(customEndDate).m;
    }, [endMinute, customEndDate, getTimeParts]);

    const handleTimeChange = (type, part, value) => {
        const cleaned = value.replace(/[^\d]/g, '');

        if (type === 'start') {
            if (part === 'hour') setStartHour(cleaned);
            else setStartMinute(cleaned);
        } else {
            if (part === 'hour') setEndHour(cleaned);
            else setEndMinute(cleaned);
        }
    };

    const handleTimeBlur = (type, part, value) => {
        let cleaned = value.replace(/[^\d]/g, '');
        let intVal = parseInt(cleaned);

        if (isNaN(intVal)) {
            if (type === 'start') {
                if (part === 'hour') setStartHour('');
                else setStartMinute('');
            } else {
                if (part === 'hour') setEndHour('');
                else setEndMinute('');
            }
            return;
        }

        if (part === 'hour') {
            if (intVal < 0) intVal = 0;
            if (intVal > 23) intVal = 23;
        } else {
            if (intVal < 0) intVal = 0;
            if (intVal > 59) intVal = 59;
        }

        const formatted = String(intVal).padStart(2, '0');

        if (type === 'start') {
            if (part === 'hour') setStartHour(formatted);
            else setStartMinute(formatted);
        } else {
            if (part === 'hour') setEndHour(formatted);
            else setEndMinute(formatted);
        }

        const currentParts = type === 'start' ? getTimeParts(customStartDate) : getTimeParts(customEndDate);
        const h = part === 'hour' ? formatted : (currentParts.h || '00');
        const m = part === 'minute' ? formatted : (currentParts.m || '00');

        const baseDate = getBaseDate(dateRange);
        const finalDateTime = `${baseDate}T${h}:${m}`;
        onCustomDateChange(type, finalDateTime);
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
            setStartHour('');
            setStartMinute('');
            setEndHour('');
            setEndMinute('');
        } else if (val === 'custom') {
            const today = getBaseDate('today');
            onCustomDateChange('start', `${today}T00:00`);
            onCustomDateChange('end', `${today}T23:59`);
            setManualStartDate(today);
            setManualEndDate(today);
        } else if (val === 'single_day') {
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
                            <option value="single_day">{t('filters.date.single_day')}</option>
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
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={startHourInput}
                                    onChange={(e) => handleTimeChange('start', 'hour', e.target.value)}
                                    onBlur={(e) => handleTimeBlur('start', 'hour', e.target.value)}
                                    placeholder="HH"
                                    maxLength={2}
                                    className="text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text bg-white border-0 p-1 w-[30px] text-center rounded"
                                />
                                <span className="text-gray-400">:</span>
                                <input
                                    type="text"
                                    value={startMinuteInput}
                                    onChange={(e) => handleTimeChange('start', 'minute', e.target.value)}
                                    onBlur={(e) => handleTimeBlur('start', 'minute', e.target.value)}
                                    placeholder="MM"
                                    maxLength={2}
                                    className="text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text bg-white border-0 p-1 w-[30px] text-center rounded"
                                />
                            </div>
                        </div>

                        <span className="text-gray-400 font-bold">→</span>

                        {/* End Time Picker */}
                        <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm hover:border-blue-400 transition-colors">
                            <span className="text-xs text-gray-500 font-bold uppercase">{t('filters.to')}</span>
                            <div className="flex items-center gap-1">
                                <input
                                    type="text"
                                    value={endHourInput}
                                    onChange={(e) => handleTimeChange('end', 'hour', e.target.value)}
                                    onBlur={(e) => handleTimeBlur('end', 'hour', e.target.value)}
                                    placeholder="HH"
                                    maxLength={2}
                                    className="text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text bg-white border-0 p-1 w-[30px] text-center rounded"
                                />
                                <span className="text-gray-400">:</span>
                                <input
                                    type="text"
                                    value={endMinuteInput}
                                    onChange={(e) => handleTimeChange('end', 'minute', e.target.value)}
                                    onBlur={(e) => handleTimeBlur('end', 'minute', e.target.value)}
                                    placeholder="MM"
                                    maxLength={2}
                                    className="text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text bg-white border-0 p-1 w-[30px] text-center rounded"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Third Row - Single Day Picker */}
                {showSingleDatePicker && (
                    <div className="flex items-center gap-3 p-3 rounded-lg flex-wrap bg-gray-50 border border-gray-200">
                        <ThaiDatePicker
                            value={startDateInput}
                            onChange={(value) => {
                                handleDateInputChange('start', value);
                                handleDateInputChange('end', value);
                            }}
                            min="2000-01-01"
                            max="2099-12-31"
                            label={t('filters.select_date')}
                        />
                    </div>
                )}

                {/* Fourth Row - Custom Date Range Picker */}
                {showDatePicker && (
                    <div className="flex items-center gap-3 p-3 rounded-lg flex-wrap bg-gray-50 border border-gray-200">
                        <ThaiDatePicker
                            value={startDateInput}
                            onChange={(value) => handleDateInputChange('start', value)}
                            min="2000-01-01"
                            max="2099-12-31"
                            label={t('filters.start_date_label')}
                        />

                        <span className="text-gray-400 mt-5 hidden sm:inline">→</span>

                        <ThaiDatePicker
                            value={endDateInput}
                            onChange={(value) => handleDateInputChange('end', value)}
                            min="2000-01-01"
                            max="2099-12-31"
                            label={t('filters.end_date_label')}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}