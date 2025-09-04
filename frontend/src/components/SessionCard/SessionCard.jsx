import React from 'react';
import SessionsList from './SessionsList/SessionsList';
import { useNavigate, useParams } from 'react-router-dom';

const SessionCard = ({ session }) => {
    const navigate = useNavigate();
    const params = useParams();

    return (
        <div 
            className="text-black p-4 rounded-md shadow-md w-80 border border-white relative cursor-pointer"
            onClick={() => navigate(`/${params.locationId}/sessions/${session.Id}`)}
        >
            <div className="flex justify-between text-sm mb-2">
                <span>{session.Start_time} - {session.End_time}</span>
                <span>{session.Date}</span>
                <span>Hall {session.Hall}</span>
            </div>
            <div className="bg-gray-200 text-center py-4 rounded-md border border-white">
                <SessionsList session={session} />
            </div>
            <div className="text-center text-sm mt-2">
                <span>{session.Film}</span>
            </div>
        </div>
    );
};

export default SessionCard;
