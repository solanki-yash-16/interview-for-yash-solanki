import React, { useEffect, useState } from "react";
import {
  X,
  ExternalLink,
  Calendar,
  MapPin,
  Rocket,
  Package,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import type { LaunchDetails } from "../types/launch";
import { LoadingSpinner } from "./LoadingSpinner";
import { StatusBadge } from "./StatusBadge";
import { spaceXApi } from "../api/spacex-api";

interface LaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  launchId: string;
}

export const LaunchModal: React.FC<LaunchModalProps> = ({
  isOpen,
  onClose,
  launchId,
}) => {
  const [launchDetails, setLaunchDetails] = useState<LaunchDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && launchId) {
      fetchLaunchDetails();
    }
  }, [isOpen, launchId]);

  const fetchLaunchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await spaceXApi.getLaunchDetails(launchId);
      setLaunchDetails(details);
    } catch (err: unknown) {
      console.log(err);
      setError("Failed to load launch details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusType = (
    success: boolean | null,
    upcoming: boolean
  ): "success" | "failed" | "upcoming" => {
    if (upcoming) return "upcoming";
    if (success === true) return "success";
    return "failed";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        ) : launchDetails ? (
          <>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                {launchDetails.launch.links.patch.small && (
                  <img
                    src={launchDetails.launch.links.patch.small}
                    alt={launchDetails.launch.name}
                    className="w-16 h-16 rounded-full bg-gray-100"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {launchDetails.launch.name}
                  </h2>
                  <StatusBadge
                    status={getStatusType(
                      launchDetails.launch.success,
                      launchDetails.launch.upcoming
                    )}
                    className="mt-1"
                  />
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>

            <div className="p-6">
              {launchDetails.launch.details && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {launchDetails.launch.details}
                  </p>
                  {launchDetails.launch.links.wikipedia && (
                    <a
                      href={launchDetails.launch.links.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      Wikipedia <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Mission Details
                  </h3>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Launch Date</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">
                    {format(
                      new Date(launchDetails.launch.date_utc),
                      "dd MMMM yyyy HH:mm"
                    )}
                  </p>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Launch Site</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">
                    {launchDetails.launchpad.full_name}
                  </p>

                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Rocket</span>
                  </div>
                  <p className="text-sm text-gray-900 ml-6">
                    {launchDetails.rocket.name}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Technical Details
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Flight Number
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 ml-6">
                        {launchDetails.launch.flight_number}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Mission Name
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 ml-6">
                        {launchDetails.launch.name}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Rocket Type
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 ml-6">
                        {launchDetails.rocket.type || "N/A"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Manufacturer
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 ml-6">
                        {launchDetails.rocket.company}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Nationality
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 ml-6">
                        {launchDetails.rocket.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {launchDetails.payloads.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payloads
                  </h3>
                  <div className="space-y-3">
                    {launchDetails.payloads.map((payload) => (
                      <div
                        key={payload.id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {payload.name}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Type:</span>
                            <span className="ml-2 text-gray-900">
                              {payload.type}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Orbit:</span>
                            <span className="ml-2 text-gray-900">
                              {payload.orbit}
                            </span>
                          </div>
                          {payload.mass_kg && (
                            <div>
                              <span className="text-gray-600">Mass:</span>
                              <span className="ml-2 text-gray-900">
                                {payload.mass_kg} kg
                              </span>
                            </div>
                          )}
                          {payload.customers.length > 0 && (
                            <div>
                              <span className="text-gray-600">Customers:</span>
                              <span className="ml-2 text-gray-900">
                                {payload.customers.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(launchDetails.launch.links.webcast ||
                launchDetails.launch.links.article) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Links
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {launchDetails.launch.links.webcast && (
                      <a
                        href={launchDetails.launch.links.webcast}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Watch Launch
                      </a>
                    )}
                    {launchDetails.launch.links.article && (
                      <a
                        href={launchDetails.launch.links.article}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Read Article
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
