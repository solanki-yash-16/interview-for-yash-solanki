/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { format } from 'date-fns';
import type { Launch } from '../types/launch';
import { StatusBadge } from './StatusBadge';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LaunchTableProps {
  launches: Launch[];
  onLaunchClick: (launchId: string) => void;
  loading?: boolean;
  rockets: any[];
  launchpads: any[];
  payloads: any[];
}

export const LaunchTable: React.FC<LaunchTableProps> = ({ 
  launches, 
  onLaunchClick,
  loading = false,
  rockets = [],
  launchpads = [],
  payloads = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(launches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaunches = launches.slice(startIndex, endIndex);

  const getStatusType = (success: boolean | null, upcoming: boolean): 'success' | 'failed' | 'upcoming' => {
    if (upcoming) return 'upcoming';
    if (success === true) return 'success';
    return 'failed';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getRocketName = (rocketId: string) => {
    const rocket = rockets.find(r => r.id === rocketId);
    return rocket?.name || 'N/A';
  };

  const getLaunchpadName = (launchpadId: string) => {
    const launchpad = launchpads.find(l => l.id === launchpadId);
    return launchpad?.full_name || 'N/A';
  };

  const getPayloadOrbit = (payloadIds: string[]) => {
    if (!payloadIds || payloadIds.length === 0) return 'N/A';
    const payload = payloads.find(p => payloadIds.includes(p.id));
    return payload?.orbit || 'N/A';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-900">No.</th>
              <th className="text-left p-4 font-semibold text-gray-900">Launched (UTC)</th>
              <th className="text-left p-4 font-semibold text-gray-900">Location</th>
              <th className="text-left p-4 font-semibold text-gray-900">Mission</th>
              <th className="text-left p-4 font-semibold text-gray-900">Orbit</th>
              <th className="text-left p-4 font-semibold text-gray-900">Launch Status</th>
              <th className="text-left p-4 font-semibold text-gray-900">Rocket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentLaunches.map((launch, index) => (
              <tr
                key={launch.id}
                onClick={() => onLaunchClick(launch.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="p-4 text-sm text-gray-900">
                  {String(startIndex + index + 1).padStart(2, '0')}
                </td>
                <td className="p-4 text-sm text-gray-900">
                  {formatDate(launch.date_local)}
                </td>
                <td className="p-4 text-sm text-gray-900">
                  {getLaunchpadName(launch.launchpad)}
                </td>
                <td className="p-4 text-sm text-gray-900">
                  {launch.name}
                </td>
                <td className="p-4 text-sm text-gray-900">
                  {getPayloadOrbit(launch.payloads)}
                </td>
                <td className="p-4">
                  <StatusBadge status={getStatusType(launch.success, launch.upcoming)} />
                </td>
                <td className="p-4 text-sm text-gray-900">
                  {getRocketName(launch.rocket)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {currentLaunches.map((launch, index) => (
          <div
            key={launch.id}
            onClick={() => onLaunchClick(launch.id)}
            className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  #{String(startIndex + index + 1).padStart(2, '0')}
                </span>
                <StatusBadge status={getStatusType(launch.success, launch.upcoming)} />
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(launch.date_local)}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{launch.name}</h3>
            <div className="text-sm text-gray-600">
              <div>Location: {getLaunchpadName(launch.launchpad)}</div>
              <div>Rocket: {getRocketName(launch.rocket)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`
                      px-3 py-1 rounded-lg text-sm transition-colors
                      ${currentPage === pageNum 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`
                      px-3 py-1 rounded-lg text-sm transition-colors
                      ${currentPage === totalPages 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, launches.length)} of {launches.length} results
          </div>
        </div>
      )}
    </div>
  );
};