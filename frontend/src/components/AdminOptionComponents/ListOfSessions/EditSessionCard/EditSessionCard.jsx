import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { getHallList, setSelectedHall } from '@/redux/Hall/Action';
import { getFilmList, setSelectedFilm } from '@/redux/Film/Action';

const EditSessionCard = ({ session, onSave, onClose }) => {
    const dispatch = useDispatch();
    const halls = useSelector(store => store.hall?.halls || []);
    const films = useSelector(store => store.film?.films || []);

    useEffect(() => {
        dispatch(getHallList(false));
        dispatch(getFilmList(false));
    }, [dispatch])

    const selectedHall = useSelector(store => store.hall?.selectedHall || null);
    const selectedFilm = useSelector(store => store.film?.selectedFilm || null);

    const form = useForm({
        defaultValues: {
            hall: session?.hall || {},
            film: session?.film || {},
            startTime: session?.startTime || "",
            endTime: session?.endTime || "",
            date: session?.date || "",
        },
        mode: "onChange",
    });

    const { handleSubmit } = form;
    const modalRef = useRef(null);

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const onSubmit = (data) => {
        const updatedSession = {
            hallId: selectedHall.Id,
            filmId: selectedFilm.Id,
            startTime: data.startTime + ":00",
            endTime: data.endTime + ":00",
            date: data.date
        }
        onSave(updatedSession);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className="p-4 border rounded-lg bg-gray-50 w-1/3"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Edit Session</h2>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="hall"
                            rules={{ required: "Hall is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hall</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(value) => {
                                            const hall = halls.find(h => "Hall " + h.Number === value);
                                            if (hall) dispatch(setSelectedHall(hall));
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a hall" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {halls.map((hall, index) => (
                                                    <SelectItem key={hall.Id} value={"Hall " + hall.Number}>Hall {hall.Number}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        This is the hall where the session will be held.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="film"
                            rules={{ required: "Film is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Film</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(value) => {
                                            const film = films.find(f => f.Name === value);
                                            if (film) dispatch(setSelectedFilm(film));
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a film" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {films.map((film, index) => (
                                                    <SelectItem key={film.Id} value={film.Name}>{film.Name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        This is film what will be shown.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startTime"
                            rules={{ required: "Start time is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Time when session will end.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endTime"
                            rules={{ required: "End time is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Time</FormLabel>
                                    <FormControl>
                                        <Input type="time" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Time when session will end.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            rules={{ required: "Date is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Date when session will end.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="mt-4">
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default EditSessionCard;
