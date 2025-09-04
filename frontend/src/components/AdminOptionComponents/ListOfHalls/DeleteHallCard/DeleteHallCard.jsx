import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DeleteHallCard = ({ isOpen, onClose, onConfirm, hallNumber }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete the hall "{hallNumber}"?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteHallCard;
