import GoToHomePage from '@/components/GoToHomePage/GoToHomePage';
import RegisterLoginCard from '@/components/RegisterLoginCard/RegisterLoginCard';
import React from 'react';

const AuthPage = () => {
  return (
    <div className="relative min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="absolute top-4 left-4">
        <GoToHomePage message={"Login to your personal account"} navigation={"/"} />
      </div>

      <RegisterLoginCard />
    </div>
  );
};

export default AuthPage;
