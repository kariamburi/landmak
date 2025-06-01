import { AlertTriangle, CheckCircle, Eye, XCircle } from 'lucide-react';

export const DisputeBadge = ({
  status,
}: {
  status: 'none' | 'reported' | 'suspected' | 'verified' | undefined;
}) => {
  if (!status || status === 'none') return null;

  const config = {
    reported: {
      className: 'bg-yellow-100 text-yellow-800',
      icon: <AlertTriangle className="w-4 h-4 mr-1" />,
      text: 'Land Dispute Reported',
    },
    suspected: {
      className: 'bg-blue-100 text-blue-800',
      icon: <Eye className="w-4 h-4 mr-1" />,
      text: 'Under Review',
    },
    verified: {
      className: 'bg-red-100 text-red-800',
      icon: <XCircle className="w-4 h-4 mr-1" />,
      text: 'Dispute Verified',
    },
  };

  const configItem = config[status];
  if (!configItem) return null;

  const { className, icon, text } = configItem;
  return (
    <span className={`inline-flex items-center mt-2 text-xs font-medium px-2 py-1 rounded ${className}`}>
      {icon}
      {text}
    </span>
  );
};
