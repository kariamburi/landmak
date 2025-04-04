import Skeleton from "@mui/material/Skeleton";

const AdPerformanceSkeleton = () => {
  return (
    <div className="p-4">
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ad Image */}
        <div className="col-span-1">
          <Skeleton variant="rectangular" width="100%" height={200} />
        </div>

        {/* Ad Details */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg shadow-md">
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={200} height={20} />
            <Skeleton variant="text" width={180} height={20} />
          </div>

          {/* Ad Engagement */}
          <div className="p-4 border rounded-lg shadow-md">
            <Skeleton variant="text" width={150} height={24} />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} variant="text" width="80%" height={20} />
            ))}
          </div>

          {/* Ad Status */}
          <div className="p-4 border rounded-lg shadow-md flex flex-col">
            <Skeleton variant="rectangular" width={80} height={30} />
            <div className="flex space-x-2 mt-2">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </div>
          </div>

          {/* Ad Performance */}
          <div className="p-4 border rounded-lg shadow-md">
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={80} height={20} />
          </div>

          {/* Contact Info */}
          <div className="p-4 border rounded-lg shadow-md">
            <Skeleton variant="text" width={150} height={24} />
            <Skeleton variant="text" width={120} height={20} />
            <Skeleton variant="text" width={200} height={20} />
          </div>

          {/* Geographical Info */}
          <div className="p-4 border rounded-lg shadow-md">
            <Skeleton variant="text" width={180} height={24} />
            <Skeleton variant="text" width={200} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdPerformanceSkeleton;
