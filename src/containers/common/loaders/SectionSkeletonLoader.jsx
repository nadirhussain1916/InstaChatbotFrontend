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
      <Skeleton variant="rectangular" animation="wave" className="h-75" />
      <Skeleton animation="wave" className="h-25" />
    </Box>
  );
}

SectionSkeletonLoader.propTypes = {
  containerHeight: PropTypes.string.isRequired,
};

export default SectionSkeletonLoader;
