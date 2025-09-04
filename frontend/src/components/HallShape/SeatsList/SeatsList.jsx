import { getHallList } from '@/redux/Hall/Action';
import { getSessionList } from '@/redux/Session/Action';
import { getTicketsByHallId } from '@/redux/Ticket/Action';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SeatsList = ({ selectedSeats, setSelectedSeats, sessionId }) => {
  const dispatch = useDispatch();
  const sessions = useSelector(store => store.session?.sessions);
  const halls = useSelector(store => store.hall?.halls);
  const tickets = useSelector(store => store.ticket?.tickets || []);

  const session = sessions?.find(s => s.Id === sessionId);
  const hall = halls?.find(h => h.Id === session?.HallId);

  useEffect(() => {
    dispatch(getHallList(false));
    dispatch(getSessionList(false));
  }, [dispatch]);

  useEffect(() => {
    if (session?.Id) {
      dispatch(getTicketsByHallId(session.HallId));
    }
  }, [dispatch, session?.HallId]);

  const sortedTickets = tickets.sort((a, b) => a.Seat_number - b.Seat_number);

  const boughtSeats = new Set(
    sortedTickets.filter(ticket => ticket?.Status === "Bought").map(ticket => ticket?.Seat_number)
  );

  const bookedSeats = new Set(
    sortedTickets.filter(ticket => ticket?.Status === "Booked").map(ticket => ticket?.Seat_number)
  );

  const countOfSeats = hall?.Count_of_seats || 0;
  const rows = [];
  let seatCount = 0;

  const rowSizes = [15, 24, 29];
  for (let i = 0; i < rowSizes.length; i++) {
    let row = [];
    for (let j = 0; j < rowSizes[i]; j++) {
      if (seatCount < countOfSeats) {
        row.push(seatCount);
        seatCount++;
      }
    }
    rows.push(row);
  }

  while (seatCount < countOfSeats) {
    let row = [];
    for (let i = 0; i < 29; i++) {
      if (seatCount < countOfSeats) {
        row.push(seatCount);
        seatCount++;
      }
    }
    rows.push(row);
  }

  const handleSeatClick = (seatNumber) => {
    if (boughtSeats.has(seatNumber + 1) || bookedSeats.has(seatNumber + 1)) return;

    const ticket = sortedTickets.find(ticket => ticket?.Seat_number === (seatNumber + 1));
    if (!ticket) return;

    const isAlreadySelected = selectedSeats.some(seat => seat?.Seat_number === ticket?.Seat_number);

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter(seat => seat?.Seat_number !== ticket?.Seat_number));
    } else {
      setSelectedSeats([...selectedSeats, ticket]);
    }
  };

  const maxSeats = Math.max(...rows.map((row) => row.length));

  return (
    <>
      <div className="flex flex-col justify-center items-center space-y-1">
        {rows.map((row, rowIndex) => {
          const emptySeats = Math.floor((maxSeats - row.length) / 2);

          return (
            <div key={rowIndex} className="flex justify-center gap-1">
              {Array.from({ length: emptySeats }, (_, i) => (
                <div key={`empty-${rowIndex}-${i}`} className="w-8 h-8 opacity-0"></div>
              ))}
              {row.map((_, colIndex) => {
                const currentSeat = rowIndex * 100 + colIndex + 100;
                const isBought = boughtSeats.has(currentSeat + 1);
                const isBooked = bookedSeats.has(currentSeat + 1);
                const isSelected = selectedSeats.some(ticket => ticket?.Seat_number === currentSeat + 1);

                return (
                  <div
                    key={currentSeat}
                    onClick={() => handleSeatClick(currentSeat)}
                    className={`w-8 h-8 flex items-center justify-center border cursor-pointer rounded-sm text-white 
                      ${isBought ? 'bg-gray-800 cursor-not-allowed' :
                        isBooked ? 'bg-blue-500 cursor-not-allowed' :
                          isSelected ? 'bg-yellow-500' : 'bg-gray-400'
                      } 
                        ${isBought || isBooked ? '' : 'hover:border-4 hover:border-yellow-500'
                      }`}
                  >
                    {currentSeat + 1}
                  </div>
                );
              })}
              {Array.from({ length: emptySeats }, (_, i) => (
                <div key={`empty-right-${rowIndex}-${i}`} className="w-8 h-8 opacity-0"></div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-sm bg-gray-400"></div>
          <h3>-</h3>
          <h3>Free</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-sm bg-yellow-500"></div>
          <h3>-</h3>
          <h3>Selected</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-sm bg-gray-800"></div>
          <h3>-</h3>
          <h3>Bought</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-sm bg-blue-500"></div>
          <h3>-</h3>
          <h3>Booked</h3>
        </div>
      </div>
    </>
  );
};

export default SeatsList;
