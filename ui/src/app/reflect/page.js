import React from 'react';
import Reflect from '../components/reflect';
import ProtectedRoute from '../components/ProtectedRoute';



const ReflectPage = () => {
  return (
    <ProtectedRoute>
    <div>
      <Reflect/>
    </div>
    </ProtectedRoute>
  );
};

export default ReflectPage;
