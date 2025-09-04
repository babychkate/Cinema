import BuyTicketList from '@/components/BuyTicketList/BuyTicketList';
import GoToHomePage from '@/components/GoToHomePage/GoToHomePage';
import HallShape from '@/components/HallShape/HallShape';
import { getSessionList } from '@/redux/Session/Action';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const HallPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const sessions = useSelector(store => store.session?.sessions);

  useEffect(() => {
    dispatch(getSessionList(false));
  }, [dispatch]);

  const session = sessions?.find(s => s.Id === params.sessionId);

  const [selectedSeats, setSelectedSeats] = useState(() => {
    const savedSeats = localStorage.getItem(`selectedSeats_${params.sessionId}`);
    return savedSeats ? JSON.parse(savedSeats) : [];
  });

  useEffect(() => {
    localStorage.setItem(`selectedSeats_${params.sessionId}`, JSON.stringify(selectedSeats));
  }, [selectedSeats, params.sessionId]);

  return (
    <div className='flex flex-col w-full p-4'>
      <GoToHomePage message={"Issuing tickets"} navigation={`/${params.locationId}/sessions`} />

      <div className='flex flex-col justify-start p-2 mt-4 mb-4 border-b-2'>
        <div className='text-2xl mb-2'>
          <h1>Choose seats in Hall</h1>
        </div>
        <div className='flex gap-4 items-center'>
          <span>{session?.Film}</span>
          <span>•</span>
          <span>{session?.Date}</span>
          <span>•</span>
          <div className='flex gap-2'>
            <span>{session?.Start_time}</span>
            <span>-</span>
            <span>{session?.End_time}</span>
          </div>
          <span>•</span>
          <span>Hall {session?.Hall}</span>
        </div>
      </div>

      <div className='flex gap-4'>
        <HallShape selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} sessionId={params.sessionId} />
        <BuyTicketList selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />
      </div>
    </div>
  );
};

export default HallPage;
