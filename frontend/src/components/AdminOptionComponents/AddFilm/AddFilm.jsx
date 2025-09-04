import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createFilm } from '@/redux/Film/Action';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const genres = ["Genre 1", "Genre 2", "Genre 3", "Genre 4"];
const ageRatings = ["0+", "3+", "6+", "12+", "16+", "18+"];

const AddFilm = () => {
    const dispatch = useDispatch();

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            releaseYear: 1930,
            imageUrl: "",
            trailerUrl: "",
            ageRating: "0+",
            genres: [],
        },
        mode: "onChange",
    });

    const [selectedGenres, setSelectedGenres] = useState([]);
    const { handleSubmit, setValue, reset } = form;

    const onSubmit = (data) => {
        console.log(data);

        const filmDto = {
            name: data.name,
            description: data.description,
            releaseYear: data.releaseYear,
            imageUrl: data.imageUrl,
            trailerUrl: data.trailerUrl,
            ageRating: data.ageRating,
            genres: [{ name: "Action" }], // here need update !!!!!!!!!!!!!!!!!!!!!!!
        };
    
        dispatch(createFilm(filmDto));

        setSelectedGenres([]);
        reset({
            name: "",
            description: "",
            releaseYear: 1930,
            imageUrl: "",
            trailerUrl: "",
            ageRating: "0+",
            genres: [],
        });
    }

    const handleGenreChange = (value) => {
        if (!selectedGenres.includes(value)) {
            const updatedGenres = [...selectedGenres, value];
            setSelectedGenres(updatedGenres);
            setValue('genres', updatedGenres);
        }
    };

    return (
        <div className="p-4 border rounded bg-gray-50 w-1/2">
            <h2 className="text-xl font-bold mb-4">Add a New Film</h2>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Film name ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is public name of film.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Film description ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is public description of film.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="releaseYear"
                        rules={{
                            required: "Release year is required",
                            validate: (value) => {
                                if (value === "" || isNaN(value)) {
                                    setValue("releaseYear", 1930);
                                    return "Release year must be a valid number";
                                }
                                if (value < 1930) {
                                    setValue("releaseYear", 1930);
                                    return "Release year cannot be less than 1930";
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Release year</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="1930 ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is release year of film.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        rules={{ required: "Image URL is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Film image url</FormLabel>
                                <FormControl>
                                    <Input placeholder="Film image url ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is public image of film.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="trailerUrl"
                        rules={{ required: "Trailer URL is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Film trailer url</FormLabel>
                                <FormControl>
                                    <Input placeholder="Film trailer url ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is public trailer of film.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="genres"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Genres</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => handleGenreChange(value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {genres.map((genre, index) => (
                                                <SelectItem key={index} value={genre}>{genre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    This is film genres.
                                </FormDescription>
                                <FormMessage />
                                <div className="mt-4 w-full">
                                    <div className="flex gap-4">
                                        {selectedGenres.map((genre, index) => (
                                            <div key={index} className="w-20 px-3 py-1 text-[12px] shadow-lg rounded-lg bg-white">{genre}</div>
                                        ))}
                                    </div>
                                </div>

                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ageRating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age rating</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => setValue("ageRating", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an age rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ageRatings.map((rating, index) => (
                                                <SelectItem key={index} value={rating}>{rating}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    This is the film's age rating.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" variant="destructive">
                        Save All
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default AddFilm;
