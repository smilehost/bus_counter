import React, { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { useTranslation } from 'react-i18next';
import CustomButton from "../components/CustomButto";
import ReusableModal from "../components/modal";
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ManageCamera() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Mock camera data with company and schedule
  const cameras = [
    {
      id: 1,
      name: "Northern Express",
      company: "Northern Bus Co.",
      schedule: "Daily",
      departureTimes: "08:00, 12:00, 16:00",
      status: "active",
      color: "#1976D2", // Blue
    },
    {
      id: 2,
      name: "Southern Route",
      company: "Southern Express",
      schedule: "Weekdays",
      departureTimes: "07:30, 13:30, 18:30",
      status: "active",
      color: "#2E7D32", // Green
    },
    {
      id: 3,
      name: "Eastern Circuit",
      company: "Eastern Transport",
      schedule: "Weekends",
      departureTimes: "09:00, 15:00",
      status: "active",
      color: "#F57C00", // Orange
    },
    {
      id: 4,
      name: "Western Line",
      company: "Western Motors",
      schedule: "Daily",
      departureTimes: "06:00, 10:00, 14:00, 18:00",
      status: "inactive",
      color: "#7B1FA2", // Purple
    },
    {
      id: 5,
      name: "Central Express",
      company: "Northern Bus Co.",
      schedule: "Daily",
      departureTimes: "07:00, 11:00, 15:00, 19:00",
      status: "active",
      color: "#C62828", // Red
    },
    {
      id: 6,
      name: "Coastal Route",
      company: "Southern Express",
      schedule: "Weekdays",
      departureTimes: "08:30, 14:30",
      status: "active",
      color: "#0097A7", // Cyan
    },
  ];

  const handleAddCamera = () => {
    console.log("Add camera clicked");
  };

  const handleViewCamera = (camera) => {
    console.log("View camera:", camera);
  };

  const handleEditCamera = (camera) => {
    setSelectedCamera(camera);
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = (formData) => {
    console.log("Edit camera confirmed:", formData);
    console.log("Selected camera:", selectedCamera);
    // TODO: ส่งข้อมูลไป API เพื่ออัปเดต
    setIsEditModalOpen(false);
    setSelectedCamera(null);
  };

  const handleDeleteCamera = (camera) => {
    setSelectedCamera(camera);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Delete camera confirmed:", selectedCamera);
    // TODO: ส่งข้อมูลไป API เพื่อลบ
    setIsDeleteModalOpen(false);
    setSelectedCamera(null);
  };

  // Get edit modal fields config
  const getEditModalFields = () => {
    if (!selectedCamera) return [];

    return [
      {
        type: "disabled",
        name: "id",
        label: "Camera ID",
        value: `CAM-${String(selectedCamera.id).padStart(3, '0')}`,
      },
      {
        type: "text-lang",
        name: "name_en",
        label: "Camera Name",
        language: "EN",
        defaultValue: selectedCamera.name,
      },
      {
        type: "text-lang",
        name: "name_th",
        label: "Camera Name",
        language: "TH",
        defaultValue: "",
      },
      {
        type: "text-lang",
        name: "company",
        label: "Company",
        language: "EN",
        defaultValue: selectedCamera.company,
      },
      {
        type: "textarea",
        name: "departureTimes",
        label: "Departure Times",
        rows: 2,
        maxLength: 200,
        defaultValue: selectedCamera.departureTimes,
      },
    ];
  };

  // Filter cameras
  const filteredCameras = cameras.filter((camera) => {
    const matchesSearch =
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || camera.status === statusFilter;
    const matchesCompany = companyFilter === "all" || camera.company === companyFilter;

    return matchesSearch && matchesStatus && matchesCompany;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCameras = filteredCameras.slice(startIndex, endIndex);

  // Get unique companies for filter
  const companies = [...new Set(cameras.map(c => c.company))];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{t('manage_camera.title')}</h1>
        <p className="text-sm text-gray-600">{t('manage_camera.subtitle')}</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('manage_camera.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-gray-600">
            <Filter size={18} />
            <span className="text-sm font-medium">{t('filters.label')}</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer bg-white"
          >
            <option value="all">{t('filters.all_status')}</option>
            <option value="active">{t('manage_camera.active')}</option>
            <option value="inactive">{t('manage_camera.inactive')}</option>
          </select>

          {/* Company Filter */}
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] cursor-pointer bg-white"
          >
            <option value="all">{t('filters.all_companies')}</option>
            {companies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          {/* Add Button */}
          <CustomButton
            variant="solid"
            color="primary"
            size="md"
            icon={<Plus size={20} />}
            onClick={handleAddCamera}
            className="whitespace-nowrap"
          >
            {t('manage_camera.add_new_camera')}
          </CustomButton>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('table.camera')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('table.company')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('table.schedule')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('table.status')}
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCameras.length > 0 ? (
                currentCameras.map((camera) => (
                  <tr key={camera.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-1 h-12 rounded-full"
                          style={{ backgroundColor: camera.color }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {camera.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {camera.departureTimes}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700">{camera.company}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-700">{camera.schedule}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${camera.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {camera.status === "active" ? t('manage_camera.active') : t('manage_camera.inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          onlyIcon
                          icon={<LockIcon />}
                          iconColor="#10B981"
                          onClick={() => handleViewCamera(camera)}
                        />
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          onlyIcon
                          icon={<EditIcon />}
                          iconColor="#1976D2"
                          onClick={() => handleEditCamera(camera)}
                        />
                        <CustomButton
                          variant="ghost"
                          size="sm"
                          onlyIcon
                          icon={<DeleteIcon />}
                          iconColor="#EF4444"
                          onClick={() => handleDeleteCamera(camera)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium mb-2">{t('manage_camera.no_cameras_found')}</p>
                      <p className="text-sm">{t('manage_camera.adjust_search')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCameras.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Results Info */}
              <div className="text-sm text-gray-600">
                {t('table.showing')} {startIndex + 1} {t('table.to')} {Math.min(endIndex, filteredCameras.length)} {t('table.of')} {filteredCameras.length} {t('table.entries')}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  ‹
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="text-gray-400">...</span>;
                  }
                  return null;
                })}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                >
                  ›
                </button>

                {/* Items per page */}
                <div className="ml-4 flex items-center gap-2">
                  <select
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    defaultValue={itemsPerPage}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">{t('table.per_page')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Camera Modal */}
      <ReusableModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCamera(null);
        }}
        title={`${t('manage_camera.edit')} ${selectedCamera?.name || ''}`}
        fields={getEditModalFields()}
        confirmText={t('manage_camera.edit')}
        onConfirm={handleEditConfirm}
        variant="info"
      />

      {/* Delete Confirmation Modal */}
      <ReusableModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCamera(null);
        }}
        title={t('manage_camera.delete')}
        fields={[
          {
            type: "warning",
            name: "warning",
            variant: "danger",
            icon: "🗑️",
            message: `คุณต้องการลบกล้อง "${selectedCamera?.name || ''}" ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้`,
          },
          {
            type: "info",
            name: "cameraName",
            label: "ชื่อกล้อง",
            value: selectedCamera?.name || '',
          },
          {
            type: "info",
            name: "company",
            label: "บริษัท",
            value: selectedCamera?.company || '',
          },
        ]}
        confirmText={t('manage_camera.delete')}
        onConfirm={handleDeleteConfirm}
        variant="danger"
      />
    </div>
  );
}
