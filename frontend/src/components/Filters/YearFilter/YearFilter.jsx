import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

const YearFilter = ({ year, setYear }) => {
    const currentYear = new Date().getFullYear();

    const handleYearChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setYear(value);
        }
    };

    const handleYearBlur = () => {
        if (year === '') return;

        const value = parseInt(year, 10);
        if (isNaN(value) || value < 1930) {
            setYear(1930);
        } else if (value > currentYear) {
            setYear(currentYear);
        }
    };

    return (
        <div>
            <Label htmlFor="year" className="font-semibold">
                Year (from 1930 to current year)
            </Label>
            <Input
                id="year"
                type="text"
                placeholder="Enter year"
                value={year}
                onChange={handleYearChange}
                onBlur={handleYearBlur}
                min={1930}
                max={currentYear}
            />
        </div>
    )
}

export default YearFilter;