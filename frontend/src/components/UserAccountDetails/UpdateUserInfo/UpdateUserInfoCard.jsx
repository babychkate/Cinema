import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "@/redux/User/Action";

const UpdateUserInfoCard = () => {
    const dispatch = useDispatch();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [ageError, setAgeError] = useState("");

    const handleAgeChange = (e) => {
        const value = e.target.value;
        setAge(value);

        if (value < 0) {
            setAge(0);
            setAgeError("Age cannot be less than 0");
        } else {
            setAgeError("");
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setAgeError("");

        dispatch(updateUserProfile(name, email, age));

        setIsDialogOpen(false);
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Button onClick={() => setIsDialogOpen(true)} variant="destructive">
                    Edit
                </Button>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update your personal information</DialogTitle>
                        <DialogDescription>Enter your changed information</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Your name ..."
                                    className="w-full"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Your email ..."
                                    className="w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="Your age ..."
                                    className="w-full"
                                    value={age}
                                    onChange={handleAgeChange}
                                />
                                {ageError && <p className="text-red-500 text-sm">{ageError}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive" disabled={!!ageError || !name || !email || !age}>
                                Save changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateUserInfoCard;
