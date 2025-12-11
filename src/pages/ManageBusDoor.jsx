import React, { useState, useEffect } from "react";
import { useCameraStore } from "../store/cameraStore";
import { useTranslation } from "react-i18next";
import {
  Bus,
  DoorOpen,
  Settings,
  AlertCircle,
  CheckCircle2,
  Search,
  MoreVertical,
  Plus
} from "lucide-react";
import CustomButton from "../components/CustomButto";
import ReusableModal from "../components/modal";

export default function ManageBusDoor() {
  const { t } = useTranslation();
  const { cameras, fetchCameras, loading } = useCameraStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  // Group cameras by Bus ID
  const buses = cameras.reduce((acc, cam) => {
    if (!acc[cam.bus_id]) {
      acc[cam.bus_id] = {
        id: cam.bus_id,
        doors: {}
      };
    }
    // Group by Door Number within Bus
    acc[cam.bus_id].doors[cam.door_number] = cam;
    return acc;
  }, {});

  const busList = Object.values(buses).filter(bus =>
    searchQuery === "" || String(bus.id).includes(searchQuery)
  );

  const handleConfigureDoor = (busId, doorNum) => {
    console.log(`Configure Bus ${busId} Door ${doorNum}`);
    setSelectedBus({ busId, doorNum });
    setIsConfigModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Bus Door Management</h1>
          <p className="text-gray-500 mt-1">Monitor and configure sensors and cameras for each bus door</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Bus ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
          <CustomButton variant="solid" color="primary" icon={<Plus size={18} />}>
            Add Bus Layout
          </CustomButton>
        </div>
      </div>

      {/* Bus Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12 text-gray-400">Loading buses...</div>
        ) : busList.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
            <Bus size={48} className="mb-2 opacity-50" />
            <p>No buses found matching your search</p>
          </div>
        ) : (
          busList.map((bus) => (
            <div key={bus.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Bus Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <Bus size={20} />
                  <span className="font-bold text-lg">Bus {bus.id}</span>
                </div>
                <span className="text-blue-100 text-sm bg-blue-800/30 px-2 py-0.5 rounded">
                  {Object.keys(bus.doors).length} Doors Active
                </span>
              </div>

              {/* Doors List */}
              <div className="p-4 space-y-3">
                {/* We'll assume a standard layout of 2 doors per bus as requested */}
                {[1, 2].map((doorNum) => {
                  const cam = bus.doors[doorNum];
                  return (
                    <div key={doorNum} className={`flex items-center justify-between p-3 rounded-lg border ${cam ? 'border-gray-200 bg-white' : 'border-dashed border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cam ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-200 text-gray-400'}`}>
                          <DoorOpen size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Door {doorNum}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            {cam ? (
                              <>
                                <CheckCircle2 size={10} className="text-green-500" />
                                {cam.camera_name}
                              </>
                            ) : (
                              <>
                                <AlertCircle size={10} className="text-gray-400" />
                                No Config
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConfigureDoor(bus.id, doorNum)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400">Updated: Today</span>
                <CustomButton variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  View Analytics
                </CustomButton>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Configuration Modal */}
      <ReusableModal
        open={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title={`Configure Bus ${selectedBus?.busId} - Door ${selectedBus?.doorNum}`}
        confirmText="Save Configuration"
        onConfirm={() => setIsConfigModalOpen(false)}
        fields={[
          {
            type: 'text',
            name: 'label',
            label: 'Door Label',
            defaultValue: `Door ${selectedBus?.doorNum}` // Placeholder
          },
          {
            type: 'select',
            name: 'type',
            label: 'Door Type',
            options: [
              { value: 'entry', label: 'Entry Only' },
              { value: 'exit', label: 'Exit Only' },
              { value: 'dual', label: 'Dual Flow' }
            ]
          }
        ]}
      />
    </div>
  );
}
