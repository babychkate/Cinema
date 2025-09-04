import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType";
import { baseURL } from "@/config/constants";

export const register = (data) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });

    try {
        const response = await axios.post(`${baseURL}/api/Register`, data);
        if (response) {
            dispatch({ type: REGISTER_SUCCESS, payload: data });
            toast.success(response.data.message);
        }

    } catch (e) {
        dispatch({ type: REGISTER_FAILURE });
        toast.error(e.response.data);
    }
    
};

export const login = (data) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
        const response = await axios.post(`${baseURL}/api/Login/login`, data);

        if (response.data && response.data.token) {
            const token = response.data.token;
            localStorage.setItem("token", token);
            dispatch({ type: LOGIN_SUCCESS, payload: token });
            await dispatch(getUserProfile());
            toast.success("Login successful!");
        } else {
            throw new Error("Token not found in response");
        }
    } catch (e) {
        dispatch({ type: LOGIN_FAILURE });
        toast.error("Login failed. Please try again.");
        console.error(e);
    }
};

export const getUserProfile = () => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });

    try {
        const data = await axios.post(`${baseURL}/api/Login/profile`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        
        dispatch({ type: GET_USER_SUCCESS, payload: data });
    } catch (e) {
        console.log(e);
        toast.error(e);
        dispatch({ type: GET_USER_FAILURE });
    }
}

export const logout = () => async (dispatch) => {
    dispatch({ type: LOGOUT });
    localStorage.clear();
}