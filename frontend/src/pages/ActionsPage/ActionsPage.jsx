import ActionCard from '@/components/ActionCard/ActionCard';
import GoToHomePage from '@/components/GoToHomePage/GoToHomePage';
import { getSaleList } from '@/redux/Sale/Action';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ActionsPage = () => {
    const dispatch = useDispatch();
    const actions = useSelector(store => store.sale?.sales || []);
    const isFirstLoaded = useRef(true);

    useEffect(() => {
        dispatch(getSaleList(isFirstLoaded.current));
        isFirstLoaded.current = false;
    }, [])

    return (
        <div className='flex flex-col w-full p-4'>
            <GoToHomePage message={"Hot prices!"} navigation={"/"} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {actions.map((action, index) => (
                    <ActionCard key={index}  action={action} />
                ))}
            </div>
        </div>
    );
}

export default ActionsPage;