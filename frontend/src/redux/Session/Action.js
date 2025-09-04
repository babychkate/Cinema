import { toast } from "react-toastify";
import { CREATE_SESSION_FAILURE, CREATE_SESSION_REQUEST, CREATE_SESSION_SUCCESS, DELETE_SESSION_FAILURE, DELETE_SESSION_REQUEST, DELETE_SESSION_SUCCESS, GET_SESSION_LIST_FAILURE, GET_SESSION_LIST_REQUEST, GET_SESSION_LIST_SUCCESS, UPDATE_SESSION_FAILURE, UPDATE_SESSION_REQUEST, UPDATE_SESSION_SUCCESS } from "./ActionType"
import axios from "axios";
import { baseURL } from "@/config/constants";

export const createSession = (data) => async (dispatch) => {
    dispatch({ type: CREATE_SESSION_REQUEST });

    try {
        const response = await axios.post(`${baseURL}/api/Admin/CreateSession`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Session created successfully!");
        dispatch({ type: CREATE_SESSION_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: CREATE_SESSION_FAILURE });
        toast.error(e.response?.data);
    }
}

export const getSessionList = (showToast) => async (dispatch) => {
    dispatch({ type: GET_SESSION_LIST_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/Admin/ReadSessions`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: GET_SESSION_LIST_SUCCESS, payload: data });
        if (showToast) {
            toast.success("Session list getted successfully!");
        }
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_SESSION_LIST_FAILURE });
        toast.error("Failed to get session list!");
    }
}

export const updateSession = (id, patches) => async (dispatch) => {
    dispatch({ type: UPDATE_SESSION_REQUEST });

    try {
        const { data } = await axios.patch(`${baseURL}/api/Admin/UpdateSession/${id}`, patches, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success(data);
        dispatch({ type: UPDATE_SESSION_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: UPDATE_SESSION_FAILURE });
        if (showToast) {
            toast.error(e.response?.data);
        }
    }
}

export const deleteSession = (id) => async (dispatch) => {
    dispatch({ type: DELETE_SESSION_REQUEST });

    try {
        const response = await axios.delete(`${baseURL}/api/Admin/DeleteSession/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log(response);
        toast.success(response);
        dispatch({ type: DELETE_SESSION_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: DELETE_SESSION_FAILURE });
        toast.error("Failed to delete session!");
    }
}