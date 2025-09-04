import GoToHomePage from '@/components/GoToHomePage/GoToHomePage';
import { Button } from '@/components/ui/button';
import { getFilmList } from '@/redux/Film/Action';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const FilmDetailsOnlinePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const films = useSelector(store => store.film?.films || []);

    useEffect(() => {
        dispatch(getFilmList(false));
    }, [dispatch])

    const film = films.find(film => film.Id === params.filmId);

    return (
        <div className='flex flex-col w-full p-4'>
            <GoToHomePage message={"Watch film online"} navigation={"/watch-online"} />

            <div className='flex justify-between'>
                <div className='text-3xl'>
                    <h1>{film?.Name}</h1>
                    <h2 className='text-xl mb-4'>{film?.Description}</h2>
                    <Button
                        variant="destructive"
                        className="mt-2"
                        onClick={() => alert('Proceeding to payment...')}
                    >
                        Watch now
                    </Button>
                </div>
                <div>
                    <div className='flex gap-4 mb-3'>
                        <span>Film Rating</span>
                        <span>•</span>
                        <span>{film?.Release_year}</span>
                        <span>•</span>
                        <div>
                            {
                                film?.Genres.map(genre => {
                                    return <span>{genre}</span>
                                })
                            }
                        </div>
                        <span>•</span>
                        <span>{film?.Age_limit || "0"}+</span>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => navigate(`/${params.filmId}/reviews`)}>See reviews</Button>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Watch Trailer</h2>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/6kO2LNnZ3M4"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg w-full"
                ></iframe>
            </div>
        </div>
    );
}

export default FilmDetailsOnlinePage;