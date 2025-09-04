import React from 'react';
import SeatsList from './SeatsList/SeatsList';
import Screen from './Screen/Screen';

const HallShape = ({ selectedSeats, setSelectedSeats, sessionId }) => {
  return (
    <div className='flex flex-col w-3/4 gap-10 bg-gray-100 p-2 rounded-lg'>
        <Screen />
        <SeatsList selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} sessionId={sessionId} />
    </div>
  )
}

export default HallShape;