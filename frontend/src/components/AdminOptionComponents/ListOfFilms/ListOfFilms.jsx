import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import EditFilmCard from './EditFilmCard/EditFilmCard';
import DeleteFilmCard from './DeleteFilmCard/DeleteFilmCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFilm, getFilmList, updateFilm } from '@/redux/Film/Action';

const ListOfFilms = () => {
    const dispatch = useDispatch();
    const films = useSelector(store => store.film?.films || []);
    const filters = useSelector(store => store.userReducer?.filters || null);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        dispatch(getFilmList(isFirstLoad.current, null));
        isFirstLoad.current = false;
    }, []);

    const [editingFilm, setEditingFilm] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFilmId, setSelectedFilmId] = useState(null);

    const handleEditClick = (film) => {
        setEditingFilm(film);
    };

    const handleCloseModal = () => {
        setEditingFilm(null);
    };

    const generatePatches = (oldFilm, newFilm) => {
        const patches = [];

        if (oldFilm.Name !== newFilm.Name) {
            patches.push({ op: "replace", path: "/name", value: newFilm.Name });
        }

        if (oldFilm.Description !== newFilm.Description) {
            patches.push({ op: "replace", path: "/description", value: newFilm.Description });
        }

        if (oldFilm.Release_year !== newFilm.Release_year) {
            patches.push({ op: "replace", path: "/releaseyear", value: String(newFilm.Release_year) });
        }

        if (JSON.stringify(oldFilm.Genres) !== JSON.stringify(newFilm.Genres)) {
            patches.push({ op: "replace", path: "/genres", value: newFilm.Genres });
        }

        return patches;
    };

    const handleSaveFilm = async (updatedFilm) => {
        const patches = generatePatches(editingFilm, updatedFilm);
        if (patches.length > 0) {
            await dispatch(updateFilm(editingFilm.Id, patches));
        }

        await dispatch(getFilmList(false));

        handleCloseModal();
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const openDeleteDialog = (filmId) => {
        setSelectedFilmId(filmId);
        setIsDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setSelectedFilmId(null);
        setIsDialogOpen(false);
    };

    const handleDeleteFilm = async () => {
        await dispatch(deleteFilm(selectedFilmId));
        await dispatch(getFilmList(true, null));
        setIsDialogOpen(false);
    };

    return (
        <div className='flex flex-col'>
            <p className="text-2xl font-bold mb-4">All film list</p>
            <div className="border rounded-lg overflow-hidden">
                <div className='grid grid-cols-8 bg-gray-100 font-bold px-4 py-2'>
                    <div>ID</div>
                    <div>Image</div>
                    <div>Film name</div>
                    <div>Film description</div>
                    <div>Release year</div>
                    <div>Age rating</div>
                    <div>Genres</div>
                    <div>Actions</div>
                </div>
                {films.map((film) => (
                    <div key={film.Id} className="grid grid-cols-8 px-4 py-2 border-t">
                        <div>{film.Id}</div>
                        <div>
                            <img src={film.ImageUrl} alt="Film" className="w-20 h-20 object-cover" />
                        </div>
                        <div>{film.Name}</div>
                        <div>{film.Description}</div>
                        <div>{film.Release_year}</div>
                        <div>{film.Age_limit}</div>
                        <div className="grid grid-cols-1 gap-4">
                            {film.Genres && film.Genres.length > 0 ? (
                                film.Genres.map((genre, index) => (
                                    <div key={index} className="w-20 px-3 py-1 text-[12px] shadow-lg rounded-lg bg-white">
                                        {genre?.Name || genre}
                                    </div>
                                ))
                            ) : (
                                <div className="w-20 px-3 py-1 text-[12px] shadow-lg rounded-lg bg-gray-200">No Genres</div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleEditClick(film)}>Edit</Button>
                            <Button variant="destructive" onClick={() => openDeleteDialog(film.Id)}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>

            {editingFilm && (
                <EditFilmCard
                    film={editingFilm}
                    onSave={handleSaveFilm}
                    onClose={handleCloseModal}
                />
            )}

            <DeleteFilmCard
                isOpen={isDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDeleteFilm}
                filmName={films.find(film => film.Id === selectedFilmId)?.Name || 'Unknown Film'}
            />
        </div>
    )
}

export default ListOfFilms;
