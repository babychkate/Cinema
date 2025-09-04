import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import React from 'react';

const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi"];

const GenreFilter = ({ genre, setGenre }) => {
    return (
        <div>
            <Label htmlFor="genre" className="font-semibold">
                Genre
            </Label>
            <Select onValueChange={setGenre}>
                <SelectTrigger id="genre">
                    {genre === "all" ? "All" : genre }
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                            {genre}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export default GenreFilter;