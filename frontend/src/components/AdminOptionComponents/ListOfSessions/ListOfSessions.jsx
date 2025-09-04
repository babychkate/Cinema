import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import EditSessionCard from './EditSessionCard/EditSessionCard';
import DeleteSessionCard from './DeleteSessionCard/DeleteSessionCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSession, getSessionList, updateSession } from '@/redux/Session/Action';

const ListOfSessions = () => {
    const dispatch = useDispatch();
    const sessions = useSelector(store => store.session?.sessions);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        dispatch(getSessionList(isFirstLoad.current));
        isFirstLoad.current = false;
    }, [dispatch])

    const [editingSession, setEditingSession] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);

    const handleEditClick = (session) => {
        setEditingSession(session);
    };

    const handleCloseModal = () => {
        setEditingSession(null);
    };

    const generatePatches = (newSession) => {
        const patches = [];

        patches.push({ path: "/hall", value: newSession?.hallId });
        patches.push({ path: "/film", value: newSession?.filmId });
        patches.push({ path: "/starttime", value: String(newSession?.startTime) });
        patches.push({ path: "/endtime", value: String(newSession?.endTime) });
        patches.push({ path: "/date", value: String(newSession?.date) });

        return patches;
    };

    const handleSaveSession = async (updatedSession) => {
        const patches = generatePatches(updatedSession);
        await dispatch(updateSession(editingSession.Id, patches));
        await dispatch(getSessionList(true));
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

    const openDeleteDialog = (sessionId) => {
        setSelectedSessionId(sessionId);
        setIsDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setSelectedSessionId(null);
        setIsDialogOpen(false);
    };

    const handleDeleteSession = async () => {
        if (selectedSessionId) {
            await dispatch(deleteSession(selectedSessionId));
            await dispatch(getSessionList(true));
            closeDeleteDialog();
        }
    };

    return (
        <div className='flex flex-col'>
            <p className="text-2xl font-bold mb-4">All Session List</p>
            <div className="border rounded-lg overflow-hidden">
                <div className='grid grid-cols-6 bg-gray-100 font-bold px-4 py-2'>
                    <div>ID</div>
                    <div>Hall number</div>
                    <div>Film name</div>
                    <div>Start Time</div>
                    <div>End Time</div>
                    <div>Actions</div>
                </div>
                {sessions.map(session => (
                    <div key={session.Id} className="grid grid-cols-6 border-t px-4 py-2 items-center">
                        <div>{session.Id}</div>
                        <div>Hall {session.Hall}</div>
                        <div>{session.Film}</div>
                        <div>{session.Start_time}</div>
                        <div>{session.End_time}</div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleEditClick(session)}>Edit</Button>
                            <Button variant="destructive" onClick={() => openDeleteDialog(session.Id)}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>

            {editingSession && (
                <EditSessionCard
                    session={editingSession}
                    onSave={handleSaveSession}
                    onClose={handleCloseModal}
                />
            )}

            <DeleteSessionCard
                isOpen={isDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={handleDeleteSession}
            />
        </div>
    );
};

export default ListOfSessions;
