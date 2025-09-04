import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFilmList } from '@/redux/Film/Action';
import { getSessionList } from '@/redux/Session/Action';

const MovieDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const films = useSelector(store => store.film?.films || []);

  const currentFilmNumber = useSelector(store => store.film?.currentFilmNumber || 1);
  const selectedLocation = useSelector(store => store.location?.selectedLocation || null);

  useEffect(() => {
    dispatch(getFilmList(false, null));
    dispatch(getSessionList(false));
  }, [dispatch])

  const film = films[currentFilmNumber - 1];

  return (
    <div className='grid grid-cols-[3fr_2fr] gap-10'>
      <div className='text-3xl'>
        <h1>{film?.Name || "Film name"}</h1>
        <h2 className='text-[16px] mb-4'>{film?.Description || "Film description"}</h2>
        <Button
          variant="destructive"
          className="mt-2"
          onClick={() => navigate(`${selectedLocation?.id}/sessions`)}
        >
          Choose Session
        </Button>
      </div>
      <div>
        <div className='flex gap-4 mb-3'>
          <span>{film?.Rating || "Film rating"}</span>
          <span>•</span>
          <span>{film?.Release_year || "Film release year"}</span>
          <span>•</span>
          <div>
            {
              film?.Genres.map(genre => {
                return <span>{genre}</span>
              })
            }
          </div>
          <span>•</span>
          <span>{film?.Age_limit + "+" || "Film age rating"}</span>
        </div>
        <Button variant="destructive" size="sm" onClick={() => navigate(`/${film?.Id}/reviews`)}>See reviews</Button>
      </div>
    </div>
  )
}

export default MovieDetails;