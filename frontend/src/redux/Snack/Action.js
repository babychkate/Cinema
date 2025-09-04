import { toast } from "react-toastify";
import { BUY_SNACK_FAILURE, BUY_SNACK_REQUEST, BUY_SNACK_SUCCESS, CREATE_SNACK_FAILURE, CREATE_SNACK_REQUEST, CREATE_SNACK_SUCCESS, DELETE_SNACK_FAILURE, DELETE_SNACK_REQUEST, DELETE_SNACK_SUCCESS, GET_SNACK_LIST_FAILURE, GET_SNACK_LIST_REQUEST, GET_SNACK_LIST_SUCCESS, UPDATE_SNACK_FAILURE, UPDATE_SNACK_REQUEST, UPDATE_SNACK_SUCCESS } from "./ActionType"
import axios from "axios";
import { baseURL } from "@/config/constants";

export const createSnack = (snack) => async (dispatch) => {
    dispatch({ type: CREATE_SNACK_REQUEST });

    try {
        const { data } = await axios.post(`${baseURL}/api/Snack/create_snack`, snack, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: CREATE_SNACK_SUCCESS, payload: data });
        toast.success("Snack created successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: CREATE_SNACK_FAILURE });
        toast.error(e.response?.message || "Failed to create snack!");
    }
}

export const getSnackList = (showToast) => async (dispatch) => {
    dispatch({ type: GET_SNACK_LIST_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/Snack/get_all_snacks`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: GET_SNACK_LIST_SUCCESS, payload: data });
        if (showToast) {
            toast.success("All snacks getted successfully!");
        }
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_SNACK_LIST_FAILURE });
        if (showToast) {
            toast.error(e.response?.message || "Failed to get snack list!");
        }
    }
}

export const deleteSnack = (id) => async (dispatch) => {
    dispatch({ type: DELETE_SNACK_REQUEST });

    try {
        const { data } = await axios.delete(`${baseURL}/api/Snack/delete_snack/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: DELETE_SNACK_SUCCESS });
        toast.success(data || "Snack deleted successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: DELETE_SNACK_FAILURE });
        toast.error(e.response?.message || "Failed to delete snack!");
    }
}

export const updateSnack = (id, patches) => async (dispatch) => {
    dispatch({ type: UPDATE_SNACK_REQUEST });

    try {
        const { data } = await axios.patch(`${baseURL}/api/Snack/update_snack/${id}`, patches, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: UPDATE_SNACK_SUCCESS });
        toast.success("Snack updated successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: UPDATE_SNACK_FAILURE });
        toast.error(e.response?.message || "Failed to update snack!");
    }
}

export const buySnacks = (snacks) => async (dispatch) => {
    dispatch({ type: BUY_SNACK_REQUEST });

    try {
        const { data } = await axios.post(`${baseURL}/api/Snack/buy_snacks`, snacks, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: BUY_SNACK_SUCCESS });
        toast.success(data || "Snack bought successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: BUY_SNACK_FAILURE });
        toast.error(e.response?.message || "Failed to update snack!");
    }
}