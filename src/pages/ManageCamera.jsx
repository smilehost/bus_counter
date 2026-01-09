import React, { useState, useEffect } from "react";
import { useCameraStore } from "../store/cameraStore";
import { Search, Filter, Plus, Monitor, Bus, DoorOpen, MoreHorizontal, RefreshCcw } from "lucide-react";
import { useTranslation } from 'react-i18next';
import CustomButton from "../components/CustomButto";
import ReusableModal from "../components/modal";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Chip from '@mui/material/Chip';
import { SkeletonCard, SkeletonCameraTableRow } from "../components/Skeleton";

export default function ManageCamera() {
  const { t } = useTranslation();
  const { cameras, loading, error, fetchCameras } = useCameraStore();

  // Local state for UI
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // New State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // State for Access Key visibility (hidden by default for security)
  const [visibleAccessKeys, setVisibleAccessKeys] = useState({});

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  // Filtering Logic
  const filteredCameras = cameras.filter((cam) => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      cam.camera_name?.toLowerCase().includes(searchLower) ||
      String(cam.bus_id).includes(searchLower) ||
      cam.installed_assces_key?.toLowerCase().includes(searchLower);

    const matchStatus = statusFilter === "all"
      ? true
      : String(Number(cam.installed_on_activate)) === statusFilter;

    return matchSearch && matchStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCameras = filteredCameras.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleEdit = (camera) => {
    setSelectedCamera(camera);
    setIsEditModalOpen(true);
  };

  const handleDelete = (camera) => {
    setSelectedCamera(camera);
    setIsDeleteModalOpen(true);
  };

  const handleEditConfirm = (formData) => {
    console.log("Saving camera:", formData);
    // TODO: Implement update action in store
    setIsEditModalOpen(false);
  };

  const handleAddConfirm = (formData) => {
    console.log("Adding new camera:", formData);
    // TODO: Implement add action in store
    setIsAddModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting camera:", selectedCamera?.install_id);
    // TODO: Implement delete action in store
    setIsDeleteModalOpen(false);
  };

  // Toggle Access Key visibility
  const toggleAccessKeyVisibility = (cameraId) => {
    setVisibleAccessKeys(prev => ({
      ...prev,
      [cameraId]: !prev[cameraId]
    }));
  };

  // Mask access key for security
  const maskAccessKey = (key) => {
    if (!key) return '***';
    return '•'.repeat(Math.min(key.length, 12));
  };

  // Field Configs
  const getEditFields = () => {
    if (!selectedCamera) return [];
    return [
      {
        type: "text-lang",
        language: "EN_NUM",
        name: "bus_id",
        label: t('table.device_id', 'Device ID'),
        defaultValue: selectedCamera.bus_id,
      },
      {
        type: "select",
        name: "installed_on_activate",
        label: t('table.status', 'Status'),
        defaultValue: selectedCamera.installed_on_activate ? "true" : "false",
        options: [
          { value: "true", label: t('manage_camera.active', 'Active') },
          { value: "false", label: t('manage_camera.inactive', 'Inactive') },
        ]
      }
    ];
  };

  const getAddFields = () => {
    // TODO: Fetch these options from API
    const companyOptions = [
      { value: "1", label: "Company A (ID: 1)" },
      { value: "2", label: "Company B (ID: 2)" },
      { value: "3", label: "Company C (ID: 3)" },
      { value: "15", label: "Company D (ID: 15)" },
    ];

    const busOptions = [
      { value: "1", label: "Bus 1" },
      { value: "2", label: "Bus 2" },
      { value: "3", label: "Bus 3" },
      { value: "10", label: "Bus 10" },
      { value: "11", label: "Bus 11" },
      { value: "12", label: "Bus 12" },
    ];

    return [
      {
        type: "text",
        name: "device_name",
        label: t('form.device_name', 'Device Name'),
        defaultValue: "",
      },
      {
        type: "text-lang",
        language: "EN_NUM",
        name: "device_uid",
        label: t('form.device_uid', 'Device UID'),
        defaultValue: "",
      },
      {
        type: "select",
        name: "com_id",
        label: t('form.com_id', 'Company'),
        defaultValue: "",
        options: [
          { value: "", label: t('form.select_company', '-- Select Company --') },
          ...companyOptions
        ],
      },
      {
        type: "select",
        name: "bus_id",
        label: t('form.bus_id', 'Bus'),
        defaultValue: "",
        options: [
          { value: "", label: t('form.select_bus', '-- Select Bus --') },
          ...busOptions
        ],
      },
      {
        type: "camera-group",
        name: "cameras_group",
        label: t('form.cameras_group', 'Camera Group (Doors)'),
        defaultValue: [
          { door_num: "", camera_top_uid: "", camera_face_uid: "" }
        ],
      },
    ];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{t('manage_camera.title', 'Manage Devices')}</h1>
          <p className="text-gray-500 mt-1">{t('manage_camera.subtitle', 'Manage all your installed Raspberry Pi 5 devices and configurations')}</p>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton
            variant="outline"
            size="md"
            onClick={() => fetchCameras()}
            icon={<RefreshCcw size={18} className={loading ? "animate-spin" : ""} />}
          >
            {t('common.refresh', 'Refresh')}
          </CustomButton>
          <CustomButton
            variant="solid"
            color="primary"
            size="md"
            icon={<Plus size={20} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            {t('manage_camera.add_new_camera', 'Add New Device')}
          </CustomButton>
        </div>
      </div>

      {/* Stats / Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Monitor size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Devices</p>
                <p className="text-2xl font-bold text-gray-800">{cameras.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg text-green-600">
                <div className="w-6 h-6 rounded-full border-2 border-green-500 animate-pulse bg-green-200"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Now</p>
                <p className="text-2xl font-bold text-gray-800">
                  {cameras.filter(c => c.installed_on_activate).length}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('manage_camera.search_placeholder', 'Search device ID...')}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-600 mr-2">{t('filters.label', 'Filter By:')}</span>
            <select
              className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{t('filters.all_status', 'All Status')}</option>
              <option value="1">{t('manage_camera.active', 'Active')}</option>
              <option value="0">{t('manage_camera.inactive', 'Inactive')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">{t('table.device_info', 'Device Info')}</th>
                {/* <th className="px-6 py-4">{t('table.bus_info', 'Bus / Door')}</th> */}
                <th className="px-6 py-4">{t('table.access_key', 'Access Key')}</th>
                <th className="px-6 py-4 text-center">{t('table.status', 'Status')}</th>
                <th className="px-6 py-4 text-center">{t('table.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <>
                  <SkeletonCameraTableRow />
                  <SkeletonCameraTableRow />
                  <SkeletonCameraTableRow />
                  <SkeletonCameraTableRow />
                  <SkeletonCameraTableRow />
                </>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-red-500 bg-red-50">
                    <p className="font-medium">{t('common.error', 'Error loading data')}</p>
                    <p className="text-sm opacity-75">{error}</p>
                  </td>
                </tr>
              ) : currentCameras.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Monitor size={48} className="text-gray-200" />
                      <p className="text-lg font-medium">{t('manage_camera.no_cameras_found')}</p>
                      <p className="text-sm">{t('manage_camera.adjust_search')}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentCameras.map((cam) => (
                  <tr key={cam.install_id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      #{cam.install_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Monitor size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{t('table.device_id', 'Device')} {cam.bus_id}</p>
                          <p className="text-xs text-gray-500">Updated: {new Date(cam.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Bus size={16} className="text-gray-400" />
                          <span className="font-medium">Bus {cam.bus_id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <DoorOpen size={14} />
                          <span>Door {cam.door_number}</span>
                        </div>
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-mono border border-gray-200 min-w-[100px]">
                          {visibleAccessKeys[cam.install_id]
                            ? cam.installed_assces_key
                            : maskAccessKey(cam.installed_assces_key)}
                        </code>
                        <button
                          onClick={() => toggleAccessKeyVisibility(cam.install_id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
                          title={visibleAccessKeys[cam.install_id] ? t('common.hide', 'Hide') : t('common.show', 'Show')}
                        >
                          {visibleAccessKeys[cam.install_id]
                            ? <VisibilityOffIcon fontSize="small" />
                            : <VisibilityIcon fontSize="small" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${cam.installed_on_activate
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${cam.installed_on_activate ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {cam.installed_on_activate ? t('manage_camera.active', 'Active') : t('manage_camera.inactive', 'Inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="tooltip" title="Edit">
                          <CustomButton onlyIcon variant="ghost" size="sm" onClick={() => handleEdit(cam)} icon={<EditIcon fontSize="small" className="text-gray-500 hover:text-amber-500" />} />
                        </div>
                        <div className="tooltip" title="Delete">
                          <CustomButton onlyIcon variant="ghost" size="sm" onClick={() => handleDelete(cam)} icon={<DeleteIcon fontSize="small" className="text-gray-500 hover:text-red-500" />} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {t('table.showing')} {cameras.length > 0 ? startIndex + 1 : 0} {t('table.to')} {Math.min(startIndex + itemsPerPage, cameras.length)} {t('table.of')} {cameras.length} {t('table.entries')}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show reasonable page numbers (simplified here)
                let p = i + 1;
                if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded ${currentPage === p ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-white disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ReusableModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={t('manage_camera.edit_camera', 'Edit Device')}
        confirmText={t('common.save')}
        onConfirm={handleEditConfirm}
        fields={getEditFields()}
        variant="info"
      />

      {/* Add Modal */}
      <ReusableModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t('manage_camera.add_new_camera', 'Add New Device')}
        confirmText={t('common.add', 'Add')}
        onConfirm={handleAddConfirm}
        fields={getAddFields()}
        variant="primary"
      />

      {/* Delete Modal */}
      <ReusableModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t('manage_camera.delete_camera', 'Delete Device')}
        confirmText={t('common.delete')}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        fields={[
          {
            type: 'info',
            label: t('table.device_id', 'Device ID'),
            value: selectedCamera?.bus_id
          },
          {
            type: 'warning',
            message: t('manage_camera.delete_confirmation', 'Are you sure you want to delete this device? This action cannot be undone.')
          }
        ]}
      />
    </div>
  );
}
