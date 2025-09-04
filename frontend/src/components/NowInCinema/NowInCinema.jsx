import { getFilmList, setFilmNumber } from '@/redux/Film/Action';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const NowInCinema = () => {
    const dispatch = useDispatch();
    const [currentFilmNumber, setCurrentFilmNumber] = useState(1);
    const films = useSelector(store => store.film?.films);

    useEffect(() => {
        dispatch(getFilmList(false, null));
    }, [dispatch])

    const decrement = () => {
        setCurrentFilmNumber(prevNumber => {
            const newFilmNumber = prevNumber != 1 ? prevNumber - 1 : 1;
            dispatch(setFilmNumber(newFilmNumber)); 
            return newFilmNumber;
        });
    }

    const increment = () => {
        setCurrentFilmNumber(prevNumber => {
            const newFilmNumber = prevNumber != films?.length ? prevNumber + 1 : films?.length;
            dispatch(setFilmNumber(newFilmNumber)); 
            return newFilmNumber;
        });
    }

    return (
        <div className='w-[300px]'>
            <h2 className='text-2xl mb-3'>Now in the Cinema</h2>

            <div className='ml-2 w-[50px] text-center text-xl'>
                <div className='flex flex-col items-center'>
                    <div 
                        className='mb-2 p-1 rounded-full hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out'
                        onClick={decrement}
                    >
                        <ChevronUpIcon className="w-5 h-5 text-black" />
                    </div>
                    <div className='mb-1'>
                        <span>{currentFilmNumber}</span>
                    </div>
                    <div className='mb-1'>
                        <div className='border-l-2 border-gray-400 h-[40px]'></div>
                    </div>
                    <div>
                        <span className='text-gray-400'>{films?.length || "None"}</span>
                    </div>
                    <div 
                        className='mt-2 p-1 rounded-full hover:bg-gray-200 cursor-pointer transition duration-300 ease-in-out'
                        onClick={increment}
                    >
                        <ChevronDownIcon className="w-5 h-5 text-black" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NowInCinema;