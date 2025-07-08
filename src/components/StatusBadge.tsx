interface StatusBadgeProps {
  status: 'success' | 'failed' | 'upcoming';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          label: 'Success',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'failed':
        return {
          label: 'Failed',
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'upcoming':
        return {
          label: 'Upcoming',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}>
      {config.label}
    </span>
  );
};