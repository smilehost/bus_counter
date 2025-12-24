import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function DataTable({ data, columns, itemsPerPage: defaultItemsPerPage = 10, onPagedDataChange }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
    const { t } = useTranslation();
    const prevPageRef = useRef();
    const prevItemsPerPageRef = useRef();
    const prevDataLengthRef = useRef();

    const rowsPerPageOptions = [5, 10, 50, 100];

    const handleRowsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing rows per page
    };

    // Calculate pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    // Notify parent about current visible data only when pagination changes
    useEffect(() => {
        if (onPagedDataChange && (
            prevPageRef.current !== currentPage ||
            prevItemsPerPageRef.current !== itemsPerPage ||
            prevDataLengthRef.current !== data.length
        )) {
            prevPageRef.current = currentPage;
            prevItemsPerPageRef.current = itemsPerPage;
            prevDataLengthRef.current = data.length;
            onPagedDataChange(data.slice(startIndex, endIndex));
        }
    }, [currentPage, itemsPerPage, data, startIndex, endIndex, onPagedDataChange]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentData.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-4 py-3 text-sm text-gray-700">
                                        {column.render ? column.render(row) : row[column.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`px-3 py-1 rounded text-sm ${currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">{t('table.rows_per_page')}:</label>
                        <select
                            value={itemsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {rowsPerPageOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-600">
                        {t('table.showing')} {data.length > 0 ? startIndex + 1 : 0} {t('table.to')} {Math.min(endIndex, data.length)} {t('table.of')} {data.length} {t('table.entries')}
                    </div>
                </div>
            </div>
        </div>
    );
}