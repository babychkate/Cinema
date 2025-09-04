import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const BlockUserCard = ({ isOpen, onClose, onConfirm, name }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Blocking</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to block user '{name}'?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Block</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default BlockUserCard;