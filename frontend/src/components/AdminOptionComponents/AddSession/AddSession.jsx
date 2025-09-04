import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFilmList, setSelectedFilm } from "@/redux/Film/Action";
import { getHallList, setSelectedHall } from "@/redux/Hall/Action";
import { createSession } from "@/redux/Session/Action";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const AddSession = () => {
    const dispatch = useDispatch();
    const halls = useSelector(store => store.hall?.halls || []);
    const films = useSelector(store => store.film?.films || []);

    const selectedHall = useSelector(store => store.hall?.selectedHall || null);
    const selectedFilm = useSelector(store => store.film?.selectedFilm || null);

    useEffect(() => {
        dispatch(getHallList(false));
        dispatch(getFilmList(false, null));
    }, [dispatch]);

    const form = useForm({
        defaultValues: {
            hall: {},
            film: {},
            startTime: "",
            endTime: "",
            date: "",
        },
        mode: "onChange",
    });

    const { handleSubmit, reset } = form;

    const onSubmit = (data) => {
        console.log(data);

        const sessionData = {
            startTime: data.startTime + ":00",
            endTime: data.endTime + ":00",
            date: data.date,
            hallId: selectedHall?.Id || "",
            filmId: selectedFilm?.Id || "",
        };

        console.log(sessionData);
        dispatch(createSession(sessionData));

        reset({
            hall: {},
            film: {},
            startTime: "",
            endTime: "",
            date: "",
        });
    };

    return (
        <div className="p-4 border rounded bg-gray-50 w-1/2">
            <h2 className="text-xl font-bold mb-4">Add a New Session</h2>
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
                                    This is hall where will be session.
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

                    <Button type="submit" variant="destructive">
                        Save Session
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddSession;