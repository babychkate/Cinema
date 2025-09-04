import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import PersonalInfoCard from './PersonalInfoCard/PersonalInfoCard';
import PurchaseHistoryCard from './PurchaseHistoryCard/PurchaseHistoryCard';
import MyPaymentCardsCard from './MyPaymentCardsCard/MyPaymentCardsCard';
import MyTicketsCard from './MyTicketsCard/MyTicketsCard';
import { useSelector } from 'react-redux';

const UserAccountDetails = () => {
    const [cardContent, setCardContent] = useState('personalInfo');
    const user = useSelector(store => store.auth.user);

    const handleLinkClick = (content) => {
        setCardContent(content);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-8 text-black mx-auto transform translate-y-[-50px]">
            <div className="w-1/3 flex flex-col items-center md:items-start">
                <div className="w-24 h-24 rounded-full shadow-lg flex items-center justify-center mb-4">
                    <span>{user?.username}</span>
                </div>
                <nav className="flex flex-col gap-2 text-black w-full">
                    <a href="#" onClick={() => handleLinkClick('personalInfo')} className={`${cardContent === 'personalInfo' ? 'underline' : ''}`}>
                        Personal Information
                    </a>
                    <a href="#" onClick={() => handleLinkClick('filmPurchaseHistory')} className={`${cardContent === 'filmPurchaseHistory' ? 'underline' : ''}`}>
                        Film Purchase History
                    </a>
                    <a href="#" onClick={() => handleLinkClick('ticketPurchaseHistory')} className={`${cardContent === 'ticketPurchaseHistory' ? 'underline' : ''}`}>
                        Ticket Purchase History
                    </a>
                    <a href="#" onClick={() => handleLinkClick('myTickets')} className={`${cardContent === 'myTickets' ? 'underline' : ''}`}>
                        My Tickets
                    </a>
                </nav>
            </div>

            <div className="w-2/3 flex items-center justify-center">
                <Card className="w-full h-full">
                    <CardHeader className="text-center text-xl">
                        {cardContent === 'personalInfo' && 'Personal Information'}
                        {cardContent === 'filmPurchaseHistory' && 'Films Purchase History'}
                        {cardContent === 'ticketPurchaseHistory' && 'Tickets Purchase History'}
                        {cardContent === 'myTickets' && 'My Tickets'}
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {cardContent === 'personalInfo' && <PersonalInfoCard user={user} />}
                        {cardContent === 'filmPurchaseHistory' && <PurchaseHistoryCard />}
                        {cardContent === 'ticketPurchaseHistory' && <MyPaymentCardsCard />}
                        {cardContent === 'myTickets' && <MyTicketsCard />}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserAccountDetails;
