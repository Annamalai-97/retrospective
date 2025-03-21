import React from 'react'
import CustomZones from '../../components/CustomZones';
import ProtectedRoute from '../../components/ProtectedRoute';


const customZonespage = () => {
  return (
    <ProtectedRoute>
    <div>
      <CustomZones/>
    </div>
    </ProtectedRoute>
  );
};

export default customZonespage;