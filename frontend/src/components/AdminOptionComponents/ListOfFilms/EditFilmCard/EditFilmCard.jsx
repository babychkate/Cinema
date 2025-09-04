import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const genres = ["Genre 1", "Genre 2", "Genre 3", "Genre 4"];

const EditFilmCard = ({ film, onSave, onClose }) => {
    const form = useForm({
        defaultValues: {
            Name: film?.Name || "",
            Description: film?.Description || "",
            Release_year: film?.Release_year || 1930,
            Genres: film?.Genres || [],
        },
        mode: "onChange",
    });

    const { handleSubmit, setValue, watch } = form;
    const modalRef = useRef(null);

    const genresValue = watch('Genres');

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleGenreChange = (value) => {
        if (!genresValue.includes(value)) {
            const updatedGenres = [...genresValue, value];
            setValue("genres", updatedGenres);
        } else {
            alert("This genre has already been selected!");
        }
    };

    const handleGenreRemove = (genreToRemove) => {
        const updatedGenres = genresValue.filter(genre => genre !== genreToRemove);
        setValue("genres", updatedGenres);
    };

    const onSubmit = (data) => {
        const updatedFilm = { ...film, ...data };
        onSave(updatedFilm);
    };

    return (
        <div
            className="fixed scroll-m-1 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className="p-4 border rounded-lg bg-gray-50 w-1/2 max-w-lg h-4/5 overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Edit Film</h2>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="Name"
                            rules={{ required: "Name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Film name ..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the public name of the film.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Description"
                            rules={{ required: "Description is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Film description ..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the public description of the film.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Release_year"
                            rules={{
                                required: "Release year is required",
                                validate: (value) => {
                                    if (value === "" || isNaN(value)) {
                                        setValue("Release_year", 1930);
                                        return "Release year must be a valid number";
                                    }
                                    if (value < 1930) {
                                        setValue("Release_year", 1930);
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
                                        This is the release year of the film.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Genres"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Genres</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={handleGenreChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a genre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {genres.map((genre, index) => (
                                                    <SelectItem key={index} value={genre || genre?.Name}>{genre || genre?.Name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Select genres for the film.
                                    </FormDescription>
                                    <FormMessage />
                                    <div className="mt-4 w-full">
                                        <div className="flex gap-4">
                                            {genresValue.map((genre, index) => (
                                                <div
                                                    key={index}
                                                    className="w-20 px-3 py-1 text-[12px] shadow-lg rounded-lg bg-white"
                                                    onClick={() => handleGenreRemove(genre)}
                                                >
                                                    {genre || genre?.Name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" variant="destructive">
                            Save All
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default EditFilmCard;
