import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createSnack } from '@/redux/Snack/Action';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const AddSnack = () => {
    const dispatch = useDispatch();

    const form = useForm({
        defaultValues: {
            name: "",
            price: 0,
        },
        mode: "onChange",
    });

    const { handleSubmit, setValue, reset, watch } = form;

    const price = watch("price");

    const handlePriceChange = (e) => {
        const value = parseFloat(e.target.value);
        setValue("price", value < 0 ? 0 : value);
    };

    const onSubmit = (data) => {
        dispatch(createSnack(data));
        reset({
            name: "",
            price: 0,
        });
    }

    return (
        <div className="p-4 border rounded bg-gray-50 w-1/2">
            <h2 className="text-xl font-bold mb-4">Add a New Snack</h2>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Snack name ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is public snack name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
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
                                <FormDescription>
                                    This is public price of snack.
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
    );
}

export default AddSnack;
