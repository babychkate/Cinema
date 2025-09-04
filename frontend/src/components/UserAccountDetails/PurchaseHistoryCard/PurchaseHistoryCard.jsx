import React, { useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useDispatch, useSelector } from 'react-redux';
import { getUserFilmHistory } from '@/redux/History/Action';

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return dateString.split("T")[0];
};

const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  return dateString.split("T")[1].slice(0, 5);
};

const PurchaseHistoryCard = () => {
  const dispatch = useDispatch();
  const purchases = useSelector(store => store.history?.histories || []);

  useEffect(() => {
    dispatch(getUserFilmHistory());
  }, [dispatch]);

  console.log(purchases);

  return (
    <div>
      {purchases.length > 0 ? (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {purchases.map((purchase) => (
              <CarouselItem key={purchase.id}>
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
                  <h3 className="text-xl font-semibold text-black">🎬 Film: <span className="text-indigo-600">{purchase?.filmName}</span></h3>
                  <p className="text-gray-600">🛒 Bought at: <span className="text-black">{formatTime(purchase?.ActionDate)}</span></p>
                  <p className="text-gray-600">📅 Date: <span className="text-black">{formatDate(purchase?.ActionDate)}</span></p>
                  <p className="text-green-600 font-semibold">💰 Amount: <span className="text-red-500 font-semibold">$100</span></p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p>No purchases yet.</p>
      )}
    </div>
  );
};

export default PurchaseHistoryCard;
