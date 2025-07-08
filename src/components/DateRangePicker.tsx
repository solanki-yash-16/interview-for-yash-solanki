import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, subWeeks, subYears, startOfDay, endOfDay } from 'date-fns';
import type { DateFilterOption } from '../types/launch';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateChange: (startDate: Date | null, endDate: Date | null, option?: DateFilterOption) => void;
  placeholder?: string;
  currentOption?: DateFilterOption;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
  placeholder = "Past 6 Months",
  currentOption = 'past-6-months'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectingStart, setSelectingStart] = useState(true);
  const [selectedOption, setSelectedOption] = useState<DateFilterOption>(currentOption);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dateOptions = [
    { value: 'past-week' as DateFilterOption, label: 'Past week' },
    { value: 'past-month' as DateFilterOption, label: 'Past month' },
    { value: 'past-3-months' as DateFilterOption, label: 'Past 3 months' },
    { value: 'past-6-months' as DateFilterOption, label: 'Past 6 months' },
    { value: 'past-year' as DateFilterOption, label: 'Past year' },
    { value: 'past-2-years' as DateFilterOption, label: 'Past 2 years' },
    { value: 'custom-range' as DateFilterOption, label: 'Custom Range' }
  ];

  const getDateRangeForOption = (option: DateFilterOption): { start: Date | null; end: Date | null } => {
    const now = new Date();
    const endOfToday = endOfDay(now);
    
    switch (option) {
      case 'past-week':
        return { start: startOfDay(subWeeks(now, 1)), end: endOfToday };
      case 'past-month':
        return { start: startOfDay(subMonths(now, 1)), end: endOfToday };
      case 'past-3-months':
        return { start: startOfDay(subMonths(now, 3)), end: endOfToday };
      case 'past-6-months':
        return { start: startOfDay(subMonths(now, 6)), end: endOfToday };
      case 'past-year':
        return { start: startOfDay(subYears(now, 1)), end: endOfToday };
      case 'past-2-years':
        return { start: startOfDay(subYears(now, 2)), end: endOfToday };
      default:
        return { start: null, end: null };
    }
  };

  const formatDateRange = () => {
    const selectedOptionData = dateOptions.find(opt => opt.value === selectedOption);
    if (selectedOption === 'custom-range') {
      if (!startDate && !endDate) return 'Custom Range';
      if (startDate && !endDate) return `${format(startDate, 'MMM dd, yyyy')} - ...`;
      if (!startDate && endDate) return `... - ${format(endDate, 'MMM dd, yyyy')}`;
      if (startDate && endDate) return `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`;
    }
    return selectedOptionData?.label || placeholder;
  };

  const handleOptionSelect = (option: DateFilterOption) => {
    setSelectedOption(option);
    if (option === 'custom-range') {
      setShowCalendar(true);
      setIsOpen(false);
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setSelectingStart(true);
    } else {
      const range = getDateRangeForOption(option);
      onDateChange(range.start, range.end, option);
      setIsOpen(false);
      setShowCalendar(false);
    }
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart) {
      setTempStartDate(startOfDay(date));
      setTempEndDate(null);
      setSelectingStart(false);
    } else {
      if (tempStartDate && date < tempStartDate) {
        setTempStartDate(startOfDay(date));
        setTempEndDate(tempStartDate);
      } else {
        setTempEndDate(endOfDay(date));
      }
      setSelectingStart(true);
    }
  };

  const handleApplyCustomRange = () => {
    onDateChange(tempStartDate, tempEndDate, 'custom-range');
    setShowCalendar(false);
  };

  const handleClearCustomRange = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    onDateChange(null, null, 'custom-range');
  };

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthChange = (monthIndex: number) => {
    setCurrentMonth(new Date(currentYear, monthIndex, 1));
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
        {/* Month and Year Dropdowns */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <select
              value={currentMonth.getMonth()}
              onChange={(e) => handleMonthChange(parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = (tempStartDate && isSameDay(day, tempStartDate)) || (tempEndDate && isSameDay(day, tempEndDate));
            const isInRange = tempStartDate && tempEndDate && day >= tempStartDate && day <= tempEndDate;
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                disabled={!isCurrentMonth}
                className={`
                  p-2 text-sm rounded hover:bg-blue-50 transition-colors
                  ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                  ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                  ${isInRange && !isSelected ? 'bg-blue-100' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <button
              onClick={handleClearCustomRange}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
            <div className="text-gray-600">
              {selectingStart ? 'Select start date' : 'Select end date'}
            </div>
            <button
              onClick={handleApplyCustomRange}
              disabled={!tempStartDate || !tempEndDate}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
      >
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{formatDateRange()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
          {dateOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              className={`
                w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors
                ${selectedOption === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === dateOptions.length - 1 ? 'rounded-b-lg' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      
      {showCalendar && (
        <div className="absolute top-full left-0 mt-1 z-50">
          {renderCalendar()}
        </div>
      )}
    </div>
  );
};