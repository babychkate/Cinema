import React, { useEffect, useRef, useState } from 'react';
import Location from '../Location/Location';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Filters from '../Filters/Filters';
import UserAvatar from '../UserAvatar/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchFilms } from '@/redux/User/Action';
import { MoreVertical } from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchRef = useRef(null);
  const filteredFilms = useSelector(store => store.userReducer?.filteredFilms || []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery) {
      setIsSearchVisible(true);
      dispatch(searchFilms(searchQuery));
    } else {
      setIsSearchVisible(false);
    }
  }, [dispatch, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='border-b py-4 px-5 flex items-center justify-between'>
      <div className='flex justify-between items-center gap-8'>
        <h1 className='cursor-pointer' onClick={() => navigate("/")}>Jeen Studio</h1>
        <Location />
      </div>
      <div className='flex justify-between items-center gap-8'>
        <Button variant="ghost" size="lg" className="text-xl underline decoration-2" onClick={() => navigate("/")}>In the cinema</Button>
        <Button variant="destructive" size="lg" onClick={() => navigate("/watch-online")}>Watch online</Button>
        <Button variant="ghost" size="lg" className="text-xl underline decoration-2" onClick={() => navigate("/actions")}>Hot Price Actions</Button>
      </div>
      <div className='flex justify-between items-center gap-8'>
        <Input type="text" placeholder="Film here..." value={searchQuery} onChange={handleSearchChange} />
        <Filters />
        <UserAvatar />
        <Button variant="ghost" size="icon" className="p-4" onClick={() => navigate("/about-us")}>
          <MoreVertical className='w-6 h-6' />
        </Button>
      </div>
      {searchQuery && isSearchVisible && (
        <div ref={searchRef} className="absolute left-[61%] top-[10%] w-[380px] p-4 border rounded-lg bg-white shadow-lg z-10">
          <h2 className="text-xl font-bold mb-3">Films</h2>
          <div className="flex flex-col gap-4">
            {filteredFilms.length > 0 ? (
              filteredFilms.map(film => (
                <div key={film.Id} className="border p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img src={film.ImageUrl} alt={film.Name} className="w-full h-40 object-cover rounded-md mb-3" />
                  <h3 className="font-semibold text-lg">{film.Name}</h3>
                  <p className="text-sm text-gray-600">{film.Description}</p>
                </div>
              ))
            ) : (
              <p>No films found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
