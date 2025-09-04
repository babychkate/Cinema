import { Button } from '@/components/ui/button';
import { viewAllUserTickets } from '@/redux/Ticket/Action';
import { getUserList } from '@/redux/User/Action';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ListOfTickets = () => {
    const dispatch = useDispatch();

    const tickets = useSelector(store => store.ticket?.tickets || []);
    const users = useSelector(store => store.userReducer?.users || []);

    const isFirstLoaded = useRef(true);

    useEffect(() => {
        dispatch(viewAllUserTickets(isFirstLoaded.current));
        isFirstLoaded.current = false;
        dispatch(getUserList(false));
    }, [dispatch]);

    const getUsername = (userId) => {
        const user = users.find(u => u.Id === userId);
        return user ? user.UserName : "Unknown";
    };

    return (
        <div className='flex flex-col'>
            <p className="text-2xl font-bold mb-4">All Ticket List</p>
            <div className="border rounded-lg overflow-hidden">
                <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-gray-100 font-bold px-4 py-2'>
                    <div>ID</div>
                    <div>User</div>
                    <div>Film</div>
                    <div>Seat</div>
                    <div>Price</div>
                    <div>Status</div>
                    <div>Booked at</div>
                </div>
                {tickets.map(ticket => (
                    <div key={ticket?.Id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_1fr] border-t px-4 py-2 items-center">
                        <div>{ticket?.Id}</div>
                        <div>{getUsername(ticket?.UserId)}</div>
                        <div>{ticket?.FilmName}</div>
                        <div>{ticket?.Seat_number}</div>
                        <div>${ticket?.Price}</div>
                        <div className={`${ticket?.Status === "Bought" ? "text-green-600" : "text-yellow-500"}`}>
                            {ticket?.Status}
                        </div>
                        <div>{new Date(ticket?.Book_buy_data).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListOfTickets;