import React from 'react';
import PropTypes from 'prop-types';
import { ThreeDots } from 'react-loader-spinner';

function SectionLoader({ width, height, radius }) {
  return (
    <div className="d-flex justify-content-center">
      <ThreeDots height={height} width={width} radius={radius} color="#422438" visible />
    </div>
  );
}

SectionLoader.propTypes = {
  width: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  radius: PropTypes.number,
};

SectionLoader.defaultProps = {
  width: 80,
  height: 80,
  radius: 9,
};

export default SectionLoader;
