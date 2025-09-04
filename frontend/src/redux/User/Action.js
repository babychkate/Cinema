import axios from "axios";
import {
    BLOCK_USER_FAILURE,
    BLOCK_USER_REQUEST,
    BLOCK_USER_SUCCESS,
    FILTER_FILMS_FAILURE,
    FILTER_FILMS_REQUEST,
    FILTER_FILMS_SUCCESS,
    GET_USER_LIST_FAILURE,
    GET_USER_LIST_REQUEST,
    GET_USER_LIST_SUCCESS,
    SEARCH_FILMS_FAILURE,
    SEARCH_FILMS_REQUEST,
    SEARCH_FILMS_SUCCESS,
    SET_FILTERS,
    UPDATE_USER_PROFILE_FAILURE,
    UPDATE_USER_PROFILE_REQUEST,
    UPDATE_USER_PROFILE_SUCCESS
} from "./ActionType";
import { toast } from "react-toastify";
import { getUserProfile } from "../Auth/Action";
import { baseURL } from "@/config/constants";

export const updateUserProfile = (name, email, age) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_PROFILE_REQUEST });

    try {
        const patches = [];

        if (name) {
            patches.push({ path: "/name", value: name });
        }
        if (email) {
            patches.push({ path: "/email", value: email });
        }
        if (age) {
            patches.push({ path: "/age", value: age });
        }

        if (patches.length === 0) {
            throw new Error("No changes to update");
        }

        const response = await axios.patch(
            `${baseURL}/UpdateProfile`,
            patches,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json-patch+json"
                }
            }
        );

        dispatch({ type: UPDATE_USER_PROFILE_SUCCESS, payload: response.data });
        await dispatch(getUserProfile());
        toast.success("Profile updated successfully!");
    } catch (error) {
        dispatch({ type: UPDATE_USER_PROFILE_FAILURE });
        console.error("Error updating profile:", error);
        toast.error(error.response?.data || "Error updating profile!");
    }
};

export const getUserList = (showToast) => async (dispatch) => {
    dispatch({ type: GET_USER_LIST_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/Admin`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response && response.data) {
            dispatch({ type: GET_USER_LIST_SUCCESS, payload: response.data });

            if (showToast) {
                toast.success("All users getted successfully!");
            }

            return response.data;
        }
    } catch (e) {
        dispatch({ type: GET_USER_LIST_FAILURE });
        if (showToast) {
            toast.error("Get list of users failed!");
        }
        return null;
    }
};

export const blockUser = (userNameToDelete) => async (dispatch) => {
    dispatch({ type: BLOCK_USER_REQUEST });

    try {
        const response = await axios.delete(`${baseURL}/api/Admin/DeleteUser/${userNameToDelete}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        if (response && response.data) {
            dispatch({ type: BLOCK_USER_SUCCESS });
            toast.success(response.data || "User blocked successfully!");
        }
    } catch (error) {
        dispatch({ type: BLOCK_USER_FAILURE });

        const errorMessage = error.response?.data || "Failed to block user!";
        toast.error(errorMessage);
    }
};

export const filterFilms = (genre, rating, year, sortOrder, duration) => async (dispatch) => {
    dispatch({ type: FILTER_FILMS_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/User/Filters`, {
            params: {
                Genre: genre,
                Rating: rating,
                Year: year,

            }
        });

        console.log(response);

        dispatch({
            type: FILTER_FILMS_SUCCESS,
            payload: response.data
        });
    } catch (e) {
        console.error(e);
        dispatch({ type: FILTER_FILMS_FAILURE });
        toast.error("Failed to filter films!");
    }
};

export const setFilters = (filters) => async (dispatch) => ({
    type: SET_FILTERS,
    payload: filters,
});

export const searchFilms = (query) => async (dispatch) => {
    dispatch({ type: SEARCH_FILMS_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/User/Search`, {
            params: {
                searchRequest: query
            }
        });
        dispatch({ type: SEARCH_FILMS_SUCCESS, payload: data })
    } catch (e) {
        console.log(e);
        dispatch({ type: SEARCH_FILMS_FAILURE });
    }
}
