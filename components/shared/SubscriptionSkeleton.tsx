import Skeleton from "@mui/material/Skeleton";

const SubscriptionSkeleton = () => {
  return (
    <div className="flex w-full items-center gap-2 p-2 bg-gray-100 rounded-md">
      {/* Status Icon */}
      <Skeleton variant="circular" width={12} height={12} />
      
      {/* Status Text */}
      <Skeleton variant="text" width={50} height={20} />
      
      {/* Plan Name */}
      <Skeleton variant="text" width={80} height={20} />
      
      {/* Upgrade Link */}
      <Skeleton variant="rectangular" width={60} height={20} />
    </div>
  );
};

export default SubscriptionSkeleton;
