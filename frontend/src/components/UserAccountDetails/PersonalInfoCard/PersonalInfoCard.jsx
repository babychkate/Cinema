import { CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react';
import UpdateUserInfoCard from '../UpdateUserInfo/UpdateUserInfoCard';

const PersonalInfoCard = ({ user }) => {
    const maskedPassword = user?.Password ? '*'.repeat(user.Password.length) : '';

    return (
        <>
            <div>
                <CardDescription className="text-gray-400">Name:</CardDescription>
                <span>{user?.username}</span>
            </div>
            <div>
                <CardDescription className="text-gray-400">Email:</CardDescription>
                <span>{user?.email}</span>
            </div>
            <div>
                <CardDescription className="text-gray-400">Age:</CardDescription>
                <span>{user?.Age}</span>
            </div>
            <div>
                <CardDescription className="text-gray-400">Password:</CardDescription>
                <Input type="text" disabled value={maskedPassword} className="bg-gray-700 text-white" />
            </div>
            <div>
                <UpdateUserInfoCard />
            </div>
        </>
    )
}

export default PersonalInfoCard;
