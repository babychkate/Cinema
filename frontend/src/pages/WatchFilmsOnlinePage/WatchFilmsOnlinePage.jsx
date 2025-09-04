import GoToHomePage from '@/components/GoToHomePage/GoToHomePage';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFilmList } from '@/redux/Film/Action';
import { saveFilmToHistory } from '@/redux/History/Action';

const WatchFilmsOnlinePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const films = useSelector(store => store.film?.films || []);
    const isFirstLoaded = useRef(true);

    useEffect(() => {
        dispatch(getFilmList(isFirstLoaded.current, null));
        isFirstLoaded.current = false;
    }, [dispatch])

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalPages = Math.ceil(films.length / itemsPerPage);

    const indexOfLastFilm = currentPage * itemsPerPage;
    const indexOfFirstFilm = indexOfLastFilm - itemsPerPage;
    const currentFilms = films.slice(indexOfFirstFilm, indexOfLastFilm);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSaveFilmToHistory = (id) => {
        dispatch(saveFilmToHistory(id));
        navigate(`/watch-online/${id}`);
    }

    return (
        <div className='flex flex-col w-full p-4'>
            <div className='flex justify-between items-center'>
                <GoToHomePage message={"Watch films online"} navigation={"/"} />

                <div className='flex justify-end mb-4 '>
                    <div className='flex gap-2 items-center'>
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Prev
                        </Button>
                        <span className='text-sm'>
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {currentFilms.map((film) => (
                    <div
                        key={film.Id}
                        className='border rounded-lg shadow-sm p-4 flex flex-col items-center text-center'
                    >
                        <div className='w-full h-40 bg-gray-300 rounded-lg mb-4'></div>
                        <h3 className='text-lg font-semibold mb-2'>{film?.Name}</h3>
                        <p className='text-sm text-gray-600 mb-2'>Age Rating: {film?.Age_limit}</p>
                        <p className='text-lg text-gray-800 font-medium mb-4'>$ 150</p>
                        <Button variant="destructive" onClick={() => handleSaveFilmToHistory(film?.Id)}>
                            Watch online
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchFilmsOnlinePage;
