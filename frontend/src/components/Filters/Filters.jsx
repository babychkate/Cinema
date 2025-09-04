import React, { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import GenreFilter from "./GenreFilter/GenreFilter";
import YearFilter from "./YearFilter/YearFilter";
import DurationFilter from "./DurationFilter/DurationFilter";
import AgeRatingFilter from "./AgeRatingFilter/AgeRatingFilter";
import MovieRatingFilter from "./MovieRatingFilter/MovieRatingFilter";
import { useDispatch } from "react-redux";
import { filterFilms, setFilters } from "@/redux/User/Action";
import { getFilmList } from "@/redux/Film/Action";

const Filters = () => {
    const dispatch = useDispatch();

    const [selectedGenre, setSelectedGenre] = useState("all");
    const [selectedYear, setSelectedYear] = useState(null);
    const [duration, setDuration] = useState(null);
    const [selectedAgeRating, setSelectedAgeRating] = useState(null);
    const [movieRating, setMovieRating] = useState([0, 10]);

    const applyFilters = async () => {
        const filters = {
            selectedGenre,
            movieRating,
            selectedYear,
            selectedAgeRating,
            duration
        };

        console.log(filters);

        await dispatch(setFilters(filters));

        await dispatch(getFilmList(true, filters));
    };

    const resetFilters = async () => {
        setSelectedGenre("all");
        setSelectedYear(null);
        setDuration(null);
        setSelectedAgeRating(null);
        await dispatch(setFilters(null));
        await dispatch(getFilmList(true, null));
    }

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" className="flex items-center gap-2">
                    Filters <ChevronDown className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                    <GenreFilter genre={selectedGenre} setGenre={setSelectedGenre} />
                    <YearFilter year={selectedYear} setYear={setSelectedYear} />
                    <DurationFilter duration={duration} setDuration={setDuration} />
                    <AgeRatingFilter ageRating={selectedAgeRating} setAgeRating={setSelectedAgeRating} />
                    <MovieRatingFilter movieRating={movieRating} setMovieRating={setMovieRating} />

                    <div className="text-right flex gap-4 justify-around">
                        <Button
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default Filters;
