import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getReviewsByFilmId, sendReview } from '@/redux/Review/Action';

const reviewSchema = z.object({
    mark: z.coerce.number().min(1, 'Rating must be at least 1').max(10, 'Rating cannot exceed 10'),
    content: z.string().min(5, 'Review must be at least 5 characters long')
});

const SendReviewCard = ({ filmId }) => {
    const dispatch = useDispatch();
    const user = useSelector(store => store.auth?.user || {});
    const isFirstLoaded = useRef(true);

    useEffect(() => {
        dispatch(getReviewsByFilmId(filmId, isFirstLoaded.current));
        isFirstLoaded.current = false;
    }, [dispatch, filmId])

    const form = useForm({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            mark: 0,
            content: '',
        }
    });

    const onSubmit = async (data) => {
        await dispatch(sendReview(data, filmId));
        await dispatch(getReviewsByFilmId(filmId));
        form.reset();
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50 w-full">
            <div className="flex items-center gap-3 mb-3">
                <Avatar>
                    <AvatarFallback>{user.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-lg font-semibold">{user.username || 'Anonymous'}</span>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="mark"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rating (1-10)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" max="10" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Review</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="Write your review..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Send Review</Button>
                </form>
            </Form>
        </div>
    );
};

export default SendReviewCard;
