import React from 'react';
import TeamProfile from '../components/teamProfile';
import ProtectedRoute from '../components/ProtectedRoute';



const ReflectPage = () => {
  return (
    <ProtectedRoute>
    <div>
      <TeamProfile/>
    </div>
    </ProtectedRoute>
  );
};

export default ReflectPage;
