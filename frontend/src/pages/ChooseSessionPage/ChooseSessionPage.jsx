import DatePicker from '@/components/DatePicker/DatePicker';
import GoToHomePage from '@/components/GoToHomePage/GoToHomePage';
import SessionCard from '@/components/SessionCard/SessionCard';
import { Button } from '@/components/ui/button';
import { getSessionList } from '@/redux/Session/Action';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ChooseSessionPage = () => {
    const [selectedDay, setSelectedDay] = useState("Today");
    const dispatch = useDispatch();
    const sessions = useSelector(store => store.session?.sessions);

    useEffect(() => {
        dispatch(getSessionList(false));
    }, [dispatch])

    const handleDaySelection = (day) => {
        setSelectedDay(day);
    };

    return (
        <div className='flex flex-col w-full p-4'>
            <GoToHomePage message={"Choose session"} navigation={"/"} />

            <div className='p-2 mt-4 flex items-center justify-start gap-4'>
                <Button
                    variant={selectedDay === "Today" ? "default" : "outline"}
                    onClick={() => handleDaySelection("Today")}
                >
                    Today
                </Button>
                <Button
                    variant={selectedDay === "Tomorrow" ? "default" : "outline"}
                    onClick={() => handleDaySelection("Tomorrow")}
                >
                    Tomorrow
                </Button>
                <DatePicker />
            </div>

            <div className='grid grid-cols-4 gap-10 justify-center'>
                {
                    sessions.map(session => (
                        <SessionCard session={session} />
                    ))
                }
            </div>
        </div>
    )
}

export default ChooseSessionPage;

// shows Choose session and path back to / root
// allows choosing day to see sessions
// allows use calendar
// shows list of components - session cards

//NEEDS SESSION LIST