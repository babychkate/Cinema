import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@/redux/Store';
import { getUserProfile, logout } from '@/redux/Auth/Action';

const UserAvatar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const user = useSelector(store => store.auth.user);

    const isAuthenticated = !!user;

    const handleMenuToggle = () => setOpen((prev) => !prev);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
        setOpen(false); 
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token && !user) {
            dispatch(getUserProfile());
        }
    }, [dispatch, user]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                {
                    isAuthenticated
                        ? <Avatar>
                            <AvatarFallback>{user?.username ? user.username[0].toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                        : "None"
                }
            </PopoverTrigger>
            <PopoverContent>
                {
                    isAuthenticated
                        ?
                        <>
                            <Button
                                variant="ghost"
                                className="w-full text-left"
                                onClick={() => { handleMenuToggle(); navigate("/my-profile") }}
                            >
                                My Profile
                            </Button>
                            <Button variant="destructive" className="w-full text-left" onClick={handleLogout}>Logout</Button>
                        </>
                        :
                        <Button
                            variant="destructive"
                            className="w-full text-left"
                            onClick={() => { handleMenuToggle(); navigate("/auth") }}
                        >
                            Register
                        </Button>
                }
            </PopoverContent>
        </Popover>
    )
}

export default UserAvatar