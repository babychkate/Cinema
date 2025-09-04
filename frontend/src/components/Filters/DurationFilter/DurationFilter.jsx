import { Label } from '@/components/ui/label';
import React from 'react';

const DurationFilter = ({ duration, setDuration }) => {
    const handleTimeChange = (event) => {
        setDuration(event.target.value); 
    };

    return (
        <div>
            <Label htmlFor="duration" className="font-semibold">
                Duration (hh:mm)
            </Label>
            <input
                id="duration"
                type="time"
                value={duration}
                onChange={handleTimeChange}
                step="600" 
                className="w-full p-2 border rounded-md"
            />
        </div>
    );
};

export default DurationFilter;
