import Skeleton from "@mui/material/Skeleton";

const LocationListSkeleton = () => {
  return (
    <div className="p-4">
      {/* Category Title */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={40} height={24} />
      </div>

      {/* Property Items */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2 p-2">
            <Skeleton variant="rectangular" width={40} height={40} />
            <div className="flex-1">
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="30%" height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationListSkeleton;
