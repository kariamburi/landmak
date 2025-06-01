import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

type Props = {
  size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

const MapaVerifiedBadge: React.FC<Props> = ({ size = 'md' }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex mt-2 items-center gap-1 font-medium rounded-full bg-green-100 text-green-700 border border-green-400 cursor-default ${sizeClasses[size]}`}
          >
            <VerifiedOutlinedIcon sx={{ fontSize: 18 }} className="text-green-600" />
            mapa Verified
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p>This property has been verified by the mapa team.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MapaVerifiedBadge;
