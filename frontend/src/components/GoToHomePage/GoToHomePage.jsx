import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GoToHomePage = ({ message, navigation }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center p-4  text-black">
            <div 
                className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out"
                onClick={() => navigate(navigation)}
            >
                <ArrowLeft className="text-black w-5 h-5" />
            </div>
            <div className="ml-4">
                <h1 className="text-lg font-bold">{message}</h1>
            </div>
        </div>
    );
};

export default GoToHomePage;
