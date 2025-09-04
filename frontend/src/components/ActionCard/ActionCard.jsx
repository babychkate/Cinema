import React from 'react';
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import { apply100PlusReviewsSale, applyDateSale, applyFourSale, applyStudentSale, applySummerSale } from '@/redux/Sale/Action';

const ActionCard = ({ action }) => {
    const dispatch = useDispatch();

    const handleApplySale = (type) => {
        switch (type) {
            case "Student":
                dispatch(applyStudentSale());
                break;
            case "Purchases4":
                dispatch(applyFourSale());
                break;
            case "SummerForKids":
                dispatch(applySummerSale());
                break;
            case "ShowDateDiscount":
                dispatch(applyDateSale());
                break;
            case "Reviews100Plus":
                dispatch(apply100PlusReviewsSale());
                break;
            default:
                return;
        }
    }

    return (
        <div className="bg-gradient-to-br from-red-400 to-yellow-300 text-white rounded-2xl shadow-2xl p-6 w-80 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/833/833314.png"
                    alt="Discount"
                    className="w-12 h-12"
                />
            </div>
            <div className="text-3xl font-bold mt-4">-{action?.Discount} %</div>
            <div className="mt-2 text-lg font-semibold text-center">{action?.Description}</div>
            <div className="mt-4 text-sm">🎯 <strong>Apply for:</strong> {action?.For_what}</div>
            <div className="mt-2 text-sm">📌 <strong>Type:</strong> {action?.Discount_type}</div>

            <Button
                className="mt-6 bg-white text-red-500 font-bold px-6 py-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition"
                onClick={() => handleApplySale(action?.Discount_type)}
            >
                Apply
            </Button>
        </div>
    );
};

export default ActionCard;
