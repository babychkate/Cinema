import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getUserProfile, login, register } from '@/redux/Auth/Action';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegisterLoginCard = () => {
    const form = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            age: ''
        }
    });
    const { handleSubmit } = form;
    const [isLogin, setIsLogin] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        if (!isLogin) {
            dispatch(register(data));
        } else {
            dispatch(login(data));
        }

        navigate("/");
    };

    return (
        <div className="max-w-md w-full p-4 bg-white rounded-lg shadow-md mt-[-100px]">
            <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {!isLogin && (
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your username ..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your email ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your private name for verification.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your password ..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your password. Password cannot be less 10 symbols.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!isLogin && (
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your age ..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your age to find movies suitable for your viewing.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <Button type="submit" variant="destructive" className="w-full">
                        {isLogin ? 'Login' : 'Register'}
                    </Button>
                </form>
            </Form>

            <div className="text-center mt-4">
                <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                <button
                    className="text-blue-500 ml-1"
                    onClick={() => setIsLogin((prev) => !prev)}
                >
                    {isLogin ? 'Register here' : 'Login here'}
                </button>
            </div>
        </div>
    )
}

export default RegisterLoginCard