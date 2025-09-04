import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

const EditSnackCard = ({ snack, onSave, onClose }) => {
    const form = useForm({
        defaultValues: {
            Name: snack?.Name || "",
            Price: snack?.Price || "",
        },
        mode: "onChange",
    });

    const modalRef = useRef(null);
    const { handleSubmit, setValue, watch } = form;

    const price = watch("Price");

    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value);
        setValue("Price", value < 0 ? 0 : value);
    };

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const onSubmit = (data) => {
        const updatedSnack = { ...snack, ...data };
        onSave(updatedSnack);
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
                <h2 className="text-xl font-bold mb-4">Edit Snack</h2>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="Name"
                            rules={{ required: "Name is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="Snack name ..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="Price"
                            rules={{ required: "Price is required" }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="20 ..."
                                            {...field}
                                            value={price}
                                            onChange={handlePriceChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="mt-4">
                            Save Changes
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default EditSnackCard;