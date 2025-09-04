import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';

const DatePicker = () => {
    const [date, setDate] = useState(new Date());

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker;