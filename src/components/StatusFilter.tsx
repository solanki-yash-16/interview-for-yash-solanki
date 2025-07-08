import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import type { FilterStatus } from '../types/launch';

interface StatusFilterProps {
  selectedStatus: FilterStatus;
  onStatusChange: (status: FilterStatus) => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statusOptions = [
    { value: 'upcoming' as FilterStatus, label: 'Upcoming Launches' },
    { value: 'successful' as FilterStatus, label: 'Successful Launches' },
    { value: 'failed' as FilterStatus, label: 'Failed Launches' },
    { value: 'all' as FilterStatus, label: 'All Launches' }
  ];

  const selectedOption = statusOptions.find(option => option.value === selectedStatus);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
      >
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onStatusChange(option.value);
                setIsOpen(false);
              }}
              className={`
                w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                ${selectedStatus === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                ${option === statusOptions[0] ? 'rounded-t-lg' : ''}
                ${option === statusOptions[statusOptions.length - 1] ? 'rounded-b-lg' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};