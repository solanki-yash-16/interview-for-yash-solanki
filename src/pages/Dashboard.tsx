

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { LaunchTable } from "../components/LaunchTable";
import { LaunchModal } from "../components/LaunchModal";
import { DateRangePicker } from "../components/DateRangePicker";
import { StatusFilter } from "../components/StatusFilter";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { Rocket } from "lucide-react";
import type {
  DateFilterOption,
  DateRange,
  FilterStatus,
  Launch,
} from "../types/launch";
import { spaceXApi } from "../api/spacex-api";
import SpaceXLogo from "../assets/Logo.png";

const Dashboard = () => {
      const [launches, setLaunches] = useState<Launch[]>([]);
      const [rockets, setRockets] = useState<any[]>([]);
      const [launchpads, setLaunchpads] = useState<any[]>([]);
      const [payloads, setPayloads] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      const [filterLoading, setFilterLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [selectedLaunchId, setSelectedLaunchId] = useState<string | null>(null);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
      const [dateRange, setDateRange] = useState<DateRange>({
        start: null,
        end: null,
        option: "all-time",
      });
    
      useEffect(() => {
        fetchLaunches();
        fetchAdditionalData();
      }, []);
    
      const fetchLaunches = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await spaceXApi.getLaunches();
          // Sort by date (newest first)
          const sortedLaunches = data.sort(
            (a, b) =>
              new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()
          );
          setLaunches(sortedLaunches);
        } catch (err: any) {
          console.log(err);
          setError("Failed to fetch launches. Please try again.");
        } finally {
          setLoading(false);
        }
      };
    
      const fetchAdditionalData = async () => {
        try {
          const [rocketsData, launchpadsData] = await Promise.all([
            spaceXApi.getRockets(),
            spaceXApi.getLaunchpads(),
          ]);
          setRockets(rocketsData);
          setLaunchpads(launchpadsData);
    
          // Fetch all payloads
          const response = await fetch("https://api.spacexdata.com/v4/payloads");
          const payloadsData = await response.json();
          setPayloads(payloadsData);
        } catch (err) {
          console.error("Failed to fetch additional data:", err);
        }
      };
      const filteredLaunches = useMemo(() => {
        let filtered = launches;
    
        // Filter by status
        if (statusFilter === "upcoming") {
          filtered = filtered.filter((launch) => launch.upcoming);
        } else if (statusFilter === "successful") {
          filtered = filtered.filter((launch) => launch.success === true);
        } else if (statusFilter === "failed") {
          filtered = filtered.filter((launch) => launch.success === false);
        }
    
        // Filter by date range
        if (dateRange.start && dateRange.end) {
          filtered = filtered.filter((launch) => {
            const launchDate = new Date(launch.date_local);
            return launchDate >= dateRange.start! && launchDate <= dateRange.end!;
          });
        } else if (dateRange.option && dateRange.option !== "custom-range") {
          // Apply preset date filters
          const now = new Date();
          let startDate: Date;
    
          switch (dateRange.option) {
            case "past-week":
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case "past-month":
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            case "past-3-months":
              startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              break;
            case "past-6-months":
              startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
              break;
            case "past-year":
              startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
              break;
            case "past-2-years":
              startDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
              break;
            default:
              startDate = new Date(0); // Show all if no valid option
          }
    
          filtered = filtered.filter((launch) => {
            const launchDate = new Date(launch.date_local);
            return launchDate >= startDate && launchDate <= now;
          });
        }
    
        return filtered;
      }, [launches, statusFilter, dateRange]);
    
      const handleLaunchClick = (launchId: string) => {
        setSelectedLaunchId(launchId);
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLaunchId(null);
      };
    
      const handleDateRangeChange = (
        start: Date | null,
        end: Date | null,
        option?: DateFilterOption
      ) => {
        setFilterLoading(true);
        setDateRange({ start, end, option });
        // Small delay to show loading effect
        setTimeout(() => setFilterLoading(false), 300);
      };
    
      if (loading) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading SpaceX launches...</p>
            </div>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-6 mb-4 inline-block">
                <Rocket className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to Load
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchLaunches}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      }
   return (
    <div className="min-h-screen bg-gray-50">
          <div className="flex items-center shadow-xl justify-center gap-3 py-6">
            <img src={SpaceXLogo} alt="logo"  />
          </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 w-full">
            {/* <div className="border border-b-2 border-gray-300"></div> */}
        </div>

        {/* Filters */}
        <div className="flex flex-col justify-between sm:flex-row gap-4 mb-6">
          <DateRangePicker
            startDate={dateRange.start}
            endDate={dateRange.end}
            onDateChange={handleDateRangeChange}
            placeholder="All Time"
            currentOption={dateRange.option}
          />
          <StatusFilter
            selectedStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Results */}
        {filteredLaunches.length === 0 ? (
          filterLoading ? (
            <div className="text-center py-16">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Filtering launches...</p>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredLaunches.length} of {launches.length} launches
              </p>
            </div>
            <LaunchTable
              launches={filteredLaunches}
              onLaunchClick={handleLaunchClick}
              rockets={rockets}
              launchpads={launchpads}
              payloads={payloads}
              loading={filterLoading}
            />
          </>
        )}

        {/* Modal */}
        {selectedLaunchId && (
          <LaunchModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            launchId={selectedLaunchId}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard