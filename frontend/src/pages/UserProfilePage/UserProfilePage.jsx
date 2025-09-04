import GoToHomePage from '@/components/GoToHomePage/GoToHomePage';
import UserAccountDetails from '@/components/UserAccountDetails/UserAccountDetails';
import React from 'react';

const UserProfilePage = () => {
    return (
        <div className="relative min-h-screen bg-gray-100 flex">
            <div className="absolute top-4 left-4">
                <GoToHomePage message={"My profile"} navigation={"/"} />
            </div>

            <div className="flex items-center pl-10 w-1/2">
                <div className="w-[100%]">
                    <UserAccountDetails />
                </div>
            </div>

        </div>
    );
};

export default UserProfilePage;
