import React from 'react';
import { Skeleton, Box } from '@mui/material';
import PropTypes from 'prop-types';
import { mainContainerStyles } from '@/styles/mui/components/skeleton-loader-styles';

function SectionSkeletonLoader({ containerHeight }) {
  return (
    <Box
      className="my-3 container-max-width w-100 container"
      sx={{ height: `${containerHeight}`, ...mainContainerStyles }}
    >
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

{/* For other variants, adjust the size with `width` and `height` */}
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={210} height={60} />
<Skeleton variant="rounded" width={210} height={60} />
    </Box>
  );
}

SectionSkeletonLoader.propTypes = {
  containerHeight: PropTypes.string.isRequired,
};

export default SectionSkeletonLoader;
