import Skeleton from "@mui/material/Skeleton";
import { Box, Divider } from "@mui/material";

const FilterSkeleton = () => {
  return (
    <Box sx={{ padding: 2, background: "#f5f5f5", borderRadius: 2 }}>
      <Skeleton variant="text" width={80} height={24} />
      <Divider sx={{ my: 2 }} />
      <Box display="flex" gap={2}>
        <Skeleton variant="rectangular" width={150} height={40} />
        <Skeleton variant="rectangular" width={150} height={40} />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Skeleton variant="text" width={120} height={24} />
      <Skeleton variant="rectangular" width={200} height={30} />
      <Skeleton variant="rectangular" width={200} height={30} />
      <Skeleton variant="rectangular" width={200} height={30} />
      <Divider sx={{ my: 2 }} />
      <Skeleton variant="text" width={140} height={24} />
    </Box>
  );
};

export default FilterSkeleton;
