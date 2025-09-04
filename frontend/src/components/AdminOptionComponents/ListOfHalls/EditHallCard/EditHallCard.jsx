import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const EditHallCard = ({ isOpen, onClose, editHall, onChange, onSave }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit hall</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="name">Hall number</Label>
                    <Input
                        name="Number"
                        value={editHall.Number}
                        onChange={onChange}
                        placeholder="Hall number ..."
                    />
                </div>
                <DialogFooter>
                    <Button onClick={onSave}>Save changes</Button>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditHallCard;