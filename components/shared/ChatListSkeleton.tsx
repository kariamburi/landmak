import Skeleton from "@mui/material/Skeleton";

const ChatListSkeleton = () => {
  return (
    <div className="p-4">
     

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

export default ChatListSkeleton;
