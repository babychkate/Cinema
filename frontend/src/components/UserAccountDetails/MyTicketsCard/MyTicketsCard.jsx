import React, { useEffect, useRef } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useDispatch, useSelector } from 'react-redux';
import { cancelTickets, getUserTickets } from '@/redux/Ticket/Action';
import { Button } from '@/components/ui/button';

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return dateString.split("T")[0];
};

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  return dateString.split("T")[1].slice(0, 5);
};

const MyTicketsCard = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.ticket?.tickets || []);
  const isFirstLoad = useRef(true);
  console.log(tickets);

  useEffect(() => {
    dispatch(getUserTickets(isFirstLoad.current));
    isFirstLoad.current = false;
  }, [dispatch]);

  const handleCancelTickets = async (id) => {
    await dispatch(cancelTickets([id]));
    await dispatch(getUserTickets(false));
  }

  return (
    <div className="space-y-6">
      {tickets?.length > 0 ? (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {tickets?.map((ticket) => (
              <CarouselItem key={ticket?.Id}>
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h3 className="text-xl font-semibold text-black">🎬 Film: <span className="text-indigo-600">{ticket?.FilmName}</span></h3>
                  <p className="text-gray-600">🛒 Bought at: <span className="text-black">{formatTime(ticket?.Book_buy_data)}</span></p>
                  <p className="text-gray-600">📅 Date: <span className="text-black">{formatDate(ticket?.Book_buy_data)}</span></p>
                  <p className="text-green-600 font-semibold">💰 Amount: <span className="text-red-500 font-semibold">${ticket?.Price}</span></p>
                  <p className="text-gray-400">🎟️ Seat number: <span className="text-black">{ticket?.Seat_number}</span></p>
                  <p className={`text-sm font-medium ${ticket?.Status === 'Booked' ? 'text-blue-500' : 'text-yellow-500'}`}>
                    Status: {ticket?.Status}
                  </p>
                  <Button variant="destructive" className="mt-4" onClick={() => handleCancelTickets(ticket.Id)}>Cancel</Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p>No tickets booked yet.</p>
      )}
    </div>
  );
};

export default MyTicketsCard;
