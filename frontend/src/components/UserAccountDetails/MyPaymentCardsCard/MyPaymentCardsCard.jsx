import React, { useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useDispatch, useSelector } from 'react-redux';
import { clearUserTicketHistory, getUserTicketHistory } from '@/redux/History/Action';
import { Button } from '@/components/ui/button';

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[0];
};

const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.split("T")[1].slice(0, 5);
};

const MyPaymentCardsCard = () => {
    const dispatch = useDispatch();
    const tickets = useSelector(store => store.history?.histories || []);

    useEffect(() => {
        dispatch(getUserTicketHistory());
    }, [dispatch])

    const handleClearTicketHistory = async () => {
        await dispatch(clearUserTicketHistory());
        await dispatch(getUserTicketHistory());
    }

    return (
        <div className="space-y-6">
            {tickets.length > 0 ? (
                <Carousel className="w-full max-w-xs">
                    <CarouselContent>
                        {tickets.map((ticket) => (
                            <CarouselItem key={ticket?.Id}>
                                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                                    <h3 className="text-xl font-semibold text-black">🎬 Film: <span className="text-indigo-600">{ticket?.filmName}</span></h3>
                                    <p className="text-gray-600">🛒 Bought at: <span className="text-black">{formatTime(ticket?.ActionDate)}</span></p>
                                    <p className="text-gray-600">📅 Date: <span className="text-black">{formatDate(ticket?.ActionDate)}</span></p>
                                    <p className="text-gray-600">💰 Amount: <span className="text-red-500 font-semibold">$100</span></p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            ) : (
                <p>No tickets saved yet.</p>
            )}
            {
                tickets.length > 0 && <Button onClick={() => handleClearTicketHistory()}>Clear History</Button>
            }
        </div>
    );
};

export default MyPaymentCardsCard;
