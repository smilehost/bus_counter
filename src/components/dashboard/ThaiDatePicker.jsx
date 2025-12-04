import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const ThaiDatePicker = ({ value, onChange, min = "2000-01-01", max = "2099-12-31", label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayDate, setDisplayDate] = useState(new Date());
    const pickerRef = useRef(null);

    // Convert CE year to BE year
    const toBuddhistYear = (ceYear) => ceYear + 543;
    const toChristianYear = (beYear) => beYear - 543;

    // Parse date string (YYYY-MM-DD) to Date object
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    // Format date to YYYY-MM-DD
    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format date for display (DD/MM/BBBB)
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        const date = parseDate(dateStr);
        if (!date) return '';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const beYear = toBuddhistYear(date.getFullYear());
        return `${day}/${month}/${beYear}`;
    };

    // Get days in month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Thai month names
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const thaiDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Update display date when value changes
    useEffect(() => {
        if (value) {
            const date = parseDate(value);
            if (date) {
                setDisplayDate(date);
            }
        }
    }, [value]);

    const handlePrevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };

    const handleYearChange = (beYear) => {
        const ceYear = toChristianYear(parseInt(beYear));
        setDisplayDate(new Date(ceYear, displayDate.getMonth(), 1));
    };

    const handleDayClick = (day) => {
        const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
        const dateStr = formatDate(newDate);

        // Check if date is within min/max range
        const minDate = parseDate(min);
        const maxDate = parseDate(max);

        if ((minDate && newDate < minDate) || (maxDate && newDate > maxDate)) {
            return;
        }

        onChange(dateStr);
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const year = displayDate.getFullYear();
        const month = displayDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        const selectedDate = value ? parseDate(value) : null;
        const minDate = parseDate(min);
        const maxDate = parseDate(max);

        // Empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isSelected = selectedDate &&
                currentDate.getDate() === selectedDate.getDate() &&
                currentDate.getMonth() === selectedDate.getMonth() &&
                currentDate.getFullYear() === selectedDate.getFullYear();

            const isDisabled = (minDate && currentDate < minDate) || (maxDate && currentDate > maxDate);
            const isToday = new Date().toDateString() === currentDate.toDateString();

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => !isDisabled && handleDayClick(day)}
                    disabled={isDisabled}
                    className={`
                        aspect-square flex items-center justify-center text-sm rounded-lg transition-colors
                        ${isSelected ? 'bg-blue-500 text-white font-bold' : ''}
                        ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                        ${!isSelected && !isToday && !isDisabled ? 'hover:bg-gray-100' : ''}
                        ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Generate year options (BE years)
    const minYear = parseDate(min)?.getFullYear() || 2000;
    const maxYear = parseDate(max)?.getFullYear() || 2099;
    const yearOptions = [];
    for (let year = minYear; year <= maxYear; year++) {
        yearOptions.push(toBuddhistYear(year));
    }

    return (
        <div className="relative" ref={pickerRef}>
            {label && (
                <label className="block text-xs font-semibold mb-1 px-1 text-gray-500">
                    {label}
                </label>
            )}

            {/* Input Display */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px] cursor-pointer bg-white flex items-center justify-between hover:border-blue-400 transition-colors"
            >
                <span className={value ? 'text-gray-700' : 'text-gray-400'}>
                    {value ? formatDisplayDate(value) : 'เลือกวันที่'}
                </span>
                <Calendar size={16} className="text-gray-400" />
            </button>

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 sm:p-4 w-full sm:w-80 left-0 sm:left-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-2 flex-1 justify-center">
                            <select
                                value={displayDate.getMonth()}
                                onChange={(e) => setDisplayDate(new Date(displayDate.getFullYear(), parseInt(e.target.value), 1))}
                                className="text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                                {thaiMonths.map((month, index) => (
                                    <option key={index} value={index}>{month}</option>
                                ))}
                            </select>

                            <select
                                value={toBuddhistYear(displayDate.getFullYear())}
                                onChange={(e) => handleYearChange(e.target.value)}
                                className="text-sm font-semibold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {thaiDays.map((day) => (
                            <div key={day} className="text-center text-xs font-semibold text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThaiDatePicker;
