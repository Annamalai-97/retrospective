"use client"
import React from 'react';
import Zones from '../components/Zones';
import ProtectedRoute from '../components/ProtectedRoute';


const ZonesPage = () => {
  return (
    <ProtectedRoute>
    <div>
      <Zones/>
    </div>
    </ProtectedRoute>
  );
};

export default ZonesPage;
