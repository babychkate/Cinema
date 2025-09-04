import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const AgeRatingFilter = ({ ageRating, setAgeRating }) => {
    return (
        <div>
            <Label htmlFor="ageRating" className="font-semibold">
                Age Rating
            </Label>
            <Input
                id="ageRating"
                type="number"
                value={ageRating || ''}
                onChange={(e) => setAgeRating(e.target.value)}
                placeholder="Enter Age Rating"
            />
        </div>
    );
};

export default AgeRatingFilter;
