import Skeleton from "@mui/material/Skeleton";

const PricingPlansSkeleton = () => {
  return (
    <div className="p-4">
      {/* Plan Header */}
      <div className="mb-4">
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="text" width={200} height={20} />
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <Skeleton variant="rectangular" width={100} height={30} />
            <Skeleton variant="text" width={120} height={24} className="mt-2" />
            <div className="mt-2 space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="text" width="80%" height={20} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Duration Selection Buttons */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={80} height={30} />
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mt-4">
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </div>
    </div>
  );
};

export default PricingPlansSkeleton;
