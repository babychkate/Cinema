import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DeleteFilmCard = ({ isOpen, onClose, onConfirm, filmName }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete the film "{filmName}"?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteFilmCard;