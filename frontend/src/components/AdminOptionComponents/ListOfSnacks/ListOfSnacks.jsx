import { Button } from '@/components/ui/button';
import React, { useEffect, useRef, useState } from 'react';
import EditSnackCard from './EditSnackCard/EditSnackCard';
import DeleteSnackCard from './DeleteSnackCard/DeleteSnackCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSnack, getSnackList, updateSnack } from '@/redux/Snack/Action';

const ListOfSnacks = () => {
    const dispatch = useDispatch();
    const snacks = useSelector(store => store.snack?.snacks);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        dispatch(getSnackList(isFirstLoad.current));
        isFirstLoad.current = false;
    }, [dispatch])

    const [editingSnack, setEditingSnack] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSnackId, setSelectedSnackId] = useState(null);

    const handleEditClick = (snack) => {
        setEditingSnack(snack);
    };

    const handleCloseModal = () => {
        setEditingSnack(null);
    };

    const handleSaveSnack = async (updatedSnack) => {
        const patches = [];

        if (updatedSnack.Price !== editingSnack.Price) {
            patches.push({ op: 'replace', path: '/Price', value: updatedSnack.Price });
        }

        if (updatedSnack.Name !== editingSnack.Name) {
            patches.push({ op: 'replace', path: '/Name', value: updatedSnack.Name });
        }

        await dispatch(updateSnack(editingSnack.Id, patches));
        await dispatch(getSnackList(false));
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

    const openDeleteDialog = (snackId) => {
        setSelectedSnackId(snackId);
        setIsDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setSelectedSnackId(null);
        setIsDialogOpen(false);
    };

    const handleDeleteSnack = async () => {
        if (selectedSnackId) {
            await dispatch(deleteSnack(selectedSnackId));
            await dispatch(getSnackList(false));
        }
        closeDeleteDialog();
    };

    return (
        <div className='flex flex-col'>
            <p className="text-2xl font-bold mb-4">All Snack List</p>
            <div className="border rounded-lg overflow-hidden">
                <div className='grid grid-cols-[2fr_1fr_1fr_1fr] bg-gray-100 font-bold px-4 py-2'>
                    <div>ID</div>
                    <div>Name</div>
                    <div>Price</div>
                    <div>Actions</div>
                </div>
                {snacks.map(snack => (
                    <div key={snack.Id} className="grid grid-cols-[2fr_1fr_1fr_1fr] border-t px-4 py-2 items-center">
                        <div>{snack.Id}</div>
                        <div>{snack.Name}</div>
                        <div>{snack.Price}</div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleEditClick(snack)}>Edit</Button>
                            <Button variant="destructive" onClick={() => openDeleteDialog(snack.Id)}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>

            {editingSnack && (
                <EditSnackCard
                    snack={editingSnack}
                    onSave={handleSaveSnack}
                    onClose={handleCloseModal}
                />
            )}
            <DeleteSnackCard
                name={snacks.find(snack => snack.Id === selectedSnackId)?.Name || 'Unknown Snack'}
                isOpen={isDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDeleteSnack}
            />
        </div>
    );
}

export default ListOfSnacks;