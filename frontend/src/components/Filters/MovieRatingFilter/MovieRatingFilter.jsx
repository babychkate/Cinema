import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import React from 'react';

const MovieRatingFilter = ({ movieRating, setMovieRating }) => {
    return (
        <div>
            <div className="mt-4">
                <Label htmlFor="movieRating" className="font-semibold">
                    Movie Rating
                </Label>
                <div className="flex items-center space-x-4">
                    <Slider
                        onValueChange={setMovieRating}
                        min={1}
                        max={10}
                        step={1}
                    />
                    <span>{movieRating} min</span> 
                </div>
            </div>
        </div>
    );
};

export default MovieRatingFilter;