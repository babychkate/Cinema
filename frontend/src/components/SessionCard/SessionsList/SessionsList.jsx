import React from 'react';

const SessionsList = () => {
    const rows = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    ];

    const maxSeats = Math.max(...rows.map(row => row.length));

    return (
        <div className="flex flex-col justify-center items-center space-y-1">
            {rows.map((row, rowIndex) => {
                const emptySeats = Math.floor((maxSeats - row.length) / 2);

                return (
                    <div key={rowIndex} className="flex justify-center gap-1">
                        {Array.from({ length: emptySeats }, (_, i) => (
                            <div key={`empty-${rowIndex}-${i}`} className="w-1 h-1 opacity-0"></div>
                        ))}
                        {row.map((seat, i) => (
                            <div
                                key={i}
                                className="w-1 h-1 flex items-center justify-center border rounded-sm bg-gray-800 text-white"
                            ></div>
                        ))}
                        {Array.from({ length: emptySeats }, (_, i) => (
                            <div key={`empty-right-${rowIndex}-${i}`} className="w-1 h-1 opacity-0"></div>
                        ))}
                    </div>
                );
            })}
        </div>
    )
}

export default SessionsList;