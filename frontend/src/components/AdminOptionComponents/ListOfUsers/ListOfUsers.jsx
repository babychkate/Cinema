import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import BlockUserCard from './BlockUserCard/BlockUserCard';
import { useDispatch, useSelector } from 'react-redux';
import { blockUser, getUserList } from '@/redux/User/Action';
import { store } from '@/redux/Store';

const ListOfUsers = () => {
    const dispatch = useDispatch();
    const users = useSelector(store => store.userReducer.users);
    const [selectedUser, setSelectedUser] = useState(null);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        dispatch(getUserList(isFirstLoad.current));
        isFirstLoad.current = false;
    }, [dispatch]);

    const handleBlockClick = (user) => {
        setSelectedUser(user);
    };

    const handleConfirmBlock = async () => {
        if (!selectedUser) return;

        await dispatch(blockUser(selectedUser?.UserName));
        setSelectedUser(null);
        await dispatch(getUserList(true));
    };

    return (
        <div className='flex flex-col'>
            <p className="text-2xl font-bold mb-4">All Users List</p>
            <div className="border rounded-lg overflow-hidden">
                <div className='grid grid-cols-[2fr_1fr_2fr_1fr_0.5fr] bg-gray-100 font-bold px-4 py-2'>
                    <div>ID</div>
                    <div>Name</div>
                    <div>Email</div>
                    <div>Age</div>
                    <div>Action</div>
                </div>
                {users.map(user => (
                    <div key={user.Id} className="grid grid-cols-[2fr_1fr_2fr_1fr_0.5fr] border-t px-4 py-2 items-center">
                        <div>{user.Id}</div>
                        <div>{user.UserName}</div>
                        <div>{user.Email}</div>
                        <div>{user.Age}</div>
                        <Button variant="destructive" onClick={() => handleBlockClick(user)}>Block</Button>
                    </div>
                ))}
            </div>

            {selectedUser && (
                <BlockUserCard
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onConfirm={handleConfirmBlock}
                    name={selectedUser.UserName}
                />
            )}
        </div>
    );
}

export default ListOfUsers;
