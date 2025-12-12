import React from "react";

/**
 * Base skeleton component with pulse animation
 */
export const Skeleton = ({ className = "", style = {} }) => (
    <div
        className={`bg-gray-200 animate-pulse rounded ${className}`}
        style={style}
    />
);

/**
 * Skeleton for stats/metric cards
 */
export const SkeletonCard = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-3 h-full">
        {/* Icon placeholder */}
        <div className="w-14 h-14 rounded-lg bg-gray-200 animate-pulse flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
            {/* Title */}
            <div className="h-3 bg-gray-200 animate-pulse rounded w-20" />
            {/* Value */}
            <div className="h-7 bg-gray-200 animate-pulse rounded w-16" />
            {/* Change */}
            <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
        </div>
    </div>
);

/**
 * Skeleton for table rows
 * @param {number} columns - Number of columns in the table
 */
export const SkeletonTableRow = ({ columns = 6 }) => (
    <tr className="border-b border-gray-100">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i} className="px-4 py-4">
                <div
                    className="h-4 bg-gray-200 animate-pulse rounded"
                    style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                />
            </td>
        ))}
    </tr>
);

/**
 * Skeleton for data table with header and rows
 * @param {number} rows - Number of skeleton rows
 * @param {number} columns - Number of columns
 */
export const SkeletonTable = ({ rows = 5, columns = 6 }) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4">
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-gray-200 animate-pulse rounded flex-1"
                />
            ))}
        </div>
        {/* Table Body */}
        <table className="w-full">
            <tbody>
                {Array.from({ length: rows }).map((_, i) => (
                    <SkeletonTableRow key={i} columns={columns} />
                ))}
            </tbody>
        </table>
    </div>
);

/**
 * Skeleton for text lines
 * @param {string} width - Width of the skeleton (e.g., "100%", "80%")
 */
export const SkeletonText = ({ width = "100%", height = "h-4" }) => (
    <div
        className={`bg-gray-200 animate-pulse rounded ${height}`}
        style={{ width }}
    />
);

/**
 * Skeleton for chart area
 */
export const SkeletonChart = ({ height = "280px" }) => (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm" style={{ height }}>
        <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-gray-200 animate-pulse rounded w-40" />
            <div className="flex gap-2">
                <div className="h-9 bg-gray-200 animate-pulse rounded w-24" />
                <div className="h-9 bg-gray-200 animate-pulse rounded w-24" />
            </div>
        </div>
        <div className="h-[calc(100%-60px)] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
    </div>
);

/**
 * Skeleton for map area
 */
export const SkeletonMap = ({ height = "400px" }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-gray-200 animate-pulse rounded w-36" />
            <div className="flex gap-2">
                <div className="h-9 bg-gray-200 animate-pulse rounded w-16" />
                <div className="h-9 bg-gray-200 animate-pulse rounded w-16" />
                <div className="h-9 bg-gray-200 animate-pulse rounded w-16" />
            </div>
        </div>
        <div
            className="bg-gray-100 animate-pulse rounded-xl flex items-center justify-center"
            style={{ height }}
        >
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        </div>
        <div className="mt-3 flex items-center gap-4">
            <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-3 bg-gray-200 animate-pulse rounded w-32" />
        </div>
    </div>
);

/**
 * Skeleton for bus door card
 */
export const SkeletonBusCard = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-200 animate-pulse px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded" />
                <div className="h-5 bg-gray-300 rounded w-16" />
            </div>
            <div className="h-5 bg-gray-300 rounded w-24" />
        </div>
        {/* Doors */}
        <div className="p-4 space-y-3">
            {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        <div className="space-y-1">
                            <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
                            <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
                        </div>
                    </div>
                    <div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />
                </div>
            ))}
        </div>
        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
            <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24" />
        </div>
    </div>
);

/**
 * Skeleton for camera table row
 */
export const SkeletonCameraTableRow = () => (
    <tr className="border-b border-gray-100">
        {/* ID */}
        <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-8" />
        </td>
        {/* Camera Info */}
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="space-y-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-28" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-20" />
                </div>
            </div>
        </td>
        {/* Bus / Door */}
        <td className="px-6 py-4">
            <div className="space-y-1">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-16" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-14" />
            </div>
        </td>
        {/* Access Key */}
        <td className="px-6 py-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-28" />
        </td>
        {/* Status */}
        <td className="px-6 py-4 text-center">
            <div className="h-6 bg-gray-200 animate-pulse rounded-full w-16 mx-auto" />
        </td>
        {/* Actions */}
        <td className="px-6 py-4 text-center">
            <div className="flex justify-center gap-2">
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded" />
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded" />
            </div>
        </td>
    </tr>
);

export default {
    Skeleton,
    SkeletonCard,
    SkeletonTableRow,
    SkeletonTable,
    SkeletonText,
    SkeletonChart,
    SkeletonMap,
    SkeletonBusCard,
    SkeletonCameraTableRow,
};
