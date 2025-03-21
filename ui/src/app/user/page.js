import React from 'react';
import Management from '../components/Management';
import ProtectedRoute from '../components/ProtectedRoute';


const UserPage = () => {
  return (
    <ProtectedRoute>
    <div>
      <Management/> 
    </div>
    </ProtectedRoute>
  );
};

export default UserPage;
