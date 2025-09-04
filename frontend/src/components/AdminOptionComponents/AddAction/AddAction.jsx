import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createSale } from '@/redux/Sale/Action';
import { SelectValue } from '@radix-ui/react-select';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

const AddAction = () => {
    const dispatch = useDispatch();
    const form = useForm({
        defaultValues: {
            discount: 0,
            description: "",
            forWhat: "Snack",
            discountType: "Student",
            isActive: true,
        },
        mode: "onChange",
    });

    const { handleSubmit, setValue, reset } = form;

    const onSubmit = (data) => {
        dispatch(createSale(data));
        reset({
            discount: 0,
            description: "",
            forWhat: "Snack",
            discountType: "Student",
            isActive: true,
        });
    };

    return (
        <div className="p-4 border rounded bg-gray-50 w-1/2">
            <h2 className="text-xl font-bold mb-4">Add a New Action</h2>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="discount"
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
                        name="description"
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
                        name="forWhat"
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reasone</FormLabel>
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
                        name="discountType"
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

                    <Button type="submit" variant="destructive">
                        Save All
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddAction;