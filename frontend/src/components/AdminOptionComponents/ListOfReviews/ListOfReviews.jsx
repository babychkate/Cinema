import { Button } from '@/components/ui/button';
import { deleteReviewByAdmin, getReviewList } from '@/redux/Review/Action';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteReviewCard from './DeleteReviewCard/DeleteReviewCard';

const ListOfReviews = () => {
    const dispatch = useDispatch();
    const reviews = useSelector(store => store.review?.reviews || []);
    const isFirstLoaded = useRef(true);

    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        dispatch(getReviewList(isFirstLoaded.current));
        isFirstLoaded.current = false;
    }, [dispatch])

    const handleDeleteClick = (review) => {
        setSelectedReview(review);
    };

    const handleCloseModal = () => {
        setSelectedReview(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedReview) {
            await dispatch(deleteReviewByAdmin(selectedReview.Id));
            await dispatch(getReviewList(true));
            setSelectedReview(null);
        }
    };

    return (
        <div className='flex flex-col'>
            <p className="text-2xl font-bold mb-4">All Users List</p>
            <div className="border rounded-lg overflow-hidden">
                <div className='grid grid-cols-[3fr_1fr_1fr_2fr_0.5fr_1fr] bg-gray-100 font-bold px-4 py-2'>
                    <div>ID</div>
                    <div>User</div>
                    <div>Film</div>
                    <div>Content</div>
                    <div>Mark</div>
                    <div>Action</div>
                </div>
                {reviews.map(review => (
                    <div key={review?.Id} className="grid grid-cols-[3fr_1fr_1fr_2fr_0.5fr_1fr] border-t px-4 py-2 items-center">
                        <div>{review?.Id}</div>
                        <div>{review?.User?.UserName}</div>
                        <div>{review?.Film?.Name}</div>
                        <div>{review?.Content}</div>
                        <div>{review?.Mark}</div>
                        <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteClick(review)}
                        >
                            Delete
                            </Button>
                    </div>
                ))}
            </div>

            {selectedReview && (
                <DeleteReviewCard 
                    isOpen={ () => selectedReview !== null} 
                    onClose={handleCloseModal} 
                    onConfirm={handleConfirmDelete} 
                />
            )}
        </div>
    );
}

export default ListOfReviews;