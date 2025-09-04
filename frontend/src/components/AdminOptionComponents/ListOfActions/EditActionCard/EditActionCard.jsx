import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

const EditActionCard = ({ editAction, onSave, onClose }) => {
    console.log(editAction);
    const form = useForm({
        defaultValues: {
            Discount: editAction?.Discount || 0,
            Description: editAction?.Description || "",
            For_what: editAction?.For_what || "Snack",
            Discount_type: editAction?.Discount_type || "Student",
            active: editAction?.Is_Active ? "Active" : "Non Active",
        },
        mode: "onChange",
    });

    const { setValue, handleSubmit } = form;
    const modalRef = useRef(null);

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const onSubmit = (data) => {
        const updatedAction = {
            Discount: data.Discount,
            Description: data.Description,
            For_what: data.For_what,
            Discount_type: data.Discount_type,
            Is_Active: data.active === "Active",
        }
        onSave(updatedAction);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className="p-4 border rounded-lg bg-gray-50 w-1/3"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Edit Action</h2>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="Discount"
                            rules={{
                                required: "discount is required",
                                validate: (value) => {
                                    if (value === "" || isNaN(value)) {
                                        setValue("discount", 0);
                                        return "Discount must be a valid number";
                                    }
                                    if (value < 0) {
                                        setValue("discount", 0);
                                        return "Discount cannot be less than 0";
                                    }
                                    return true;
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="213 ..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the public discount on tickect/snack.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Description"
                            rules={{ required: "Description is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Action description ..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is public description of action.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="For_what"
                            rules={{ required: "Type is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select discount type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Snack">Snack</SelectItem>
                                            <SelectItem value="Ticket">Ticket</SelectItem>
                                            <SelectItem value="Both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Discount_type"
                            rules={{ required: "Type is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select discount type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Student">Student</SelectItem>
                                            <SelectItem value="Purchases4">Purchases4</SelectItem>
                                            <SelectItem value="SummerForKids">SummerForKids</SelectItem>
                                            <SelectItem value="ShowDateDiscount">ShowDateDiscount</SelectItem>
                                            <SelectItem value="Reviews100Plus">Reviews100Plus</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={(value) => setValue('active', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Non Active">Non Active</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Select whether the discount is active or non active.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" variant="destructive">
                            Save All
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default EditActionCard;