import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import EditHallCard from './EditHallCard/EditHallCard';
import DeleteHallCard from './DeleteHallCard/DeleteHallCard';
import { useDispatch, useSelector } from 'react-redux';
import { closeHall, deleteHall, getHallList, openHall, updateHall } from '@/redux/Hall/Action';

const ListOfHalls = () => {
    const dispatch = useDispatch();
    const halls = useSelector(store => store.hall?.halls || []);
    const locations = useSelector(store => store.location?.locations || []);

    const [selectedHall, setSelectedHall] = useState(null);
    const [editHall, setEditHall] = useState({ Id: '', Number: '', Count_of_seats: '' });
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const isFirstLoad = useRef(true);

    console.log(halls);

    useEffect(() => {
        dispatch(getHallList(isFirstLoad.current));
        isFirstLoad.current = false;
    }, [dispatch]);

    const toggleHallStatus = async (hall) => {
        console.log(hall);
        if (hall.Is_available) {
            await dispatch(closeHall(hall.Id));
        } else {
            await dispatch(openHall(hall.Id));
        }

        await dispatch(getHallList(false));
    };

    const openEditModal = (hall) => {
        setSelectedHall(hall);
        setEditHall({ Id: hall.Id, Number: hall.Number, Count_of_seats: hall.Count_of_seats });
        setIsEditOpen(true);
    };

    const openDeleteModal = (hall) => {
        setSelectedHall(hall);
        setIsDeleteOpen(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditHall(prev => ({ ...prev, [name]: value }));
    };

    const saveChanges = async () => {
        await dispatch(updateHall(editHall.Id, [
            { op: "replace", path: "/Number", value: Number(editHall.Number) },
        ]));
        await dispatch(getHallList(true));
        setIsEditOpen(false);
    };

    const handleDeleteHall = async () => {
        await dispatch(deleteHall(selectedHall.Id));
        await dispatch(getHallList(true));
        setIsDeleteOpen(false);
    };

    return (
        <div className='flex flex-col'>
            <p className="text-2xl font-bold mb-4">All hall list</p>
            <div className="border rounded-lg overflow-hidden">
                <div className='grid grid-cols-[2fr_0.5fr_0.5fr_0.75fr_1fr_1.5fr] bg-gray-100 font-bold px-4 py-2'>
                    <div>ID</div>
                    <div>Hall number</div>
                    <div>Seats</div>
                    <div>Status</div>
                    <div>Location</div>
                    <div>Actions</div>
                </div>
                {halls.map(hall => (
                    <div key={hall.Id} className="grid grid-cols-[2fr_0.5fr_0.5fr_0.75fr_1fr_1.5fr] border-t px-4 py-2 items-center">
                        <div>{hall.Id}</div>
                        <div>{hall.Number}</div>
                        <div>{hall.Count_of_seats}</div>
                        <div className={hall.Is_available ? "text-green-600" : "text-red-600"}>
                            {hall.Is_available ? "Open" : "Close"}
                        </div>
                        <div>
                            {
                                locations
                                    .find(location => location.Id === hall.LocationId)?.Name + ", " +
                                locations.find(location => location.Id === hall.LocationId)?.City
                                || 'Unknown'
                            }
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => toggleHallStatus(hall)}>
                                {hall.Is_available ? "Close" : "Open"}
                            </Button>
                            <Button variant="outline" onClick={() => openEditModal(hall)}>Edit</Button>
                            <Button variant="destructive" onClick={() => openDeleteModal(hall)}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>

            <EditHallCard
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                editHall={editHall}
                onChange={handleEditChange}
                onSave={saveChanges}
            />

            <DeleteHallCard
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteHall}
                hallNumber={selectedHall?.Number}
            />
        </div>
    );
};

export default ListOfHalls;
