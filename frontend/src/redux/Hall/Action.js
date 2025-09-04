import { toast } from "react-toastify";
import { CLOSE_HALL_FAILURE, CLOSE_HALL_REQUEST, CLOSE_HALL_SUCCESS, CREATE_HALL_FAILURE, CREATE_HALL_REQUEST, DELETE_HALL_FAILURE, DELETE_HALL_REQUEST, DELETE_HALL_SUCCESS, GET_ALL_HALLS_FAILURE, GET_ALL_HALLS_REQUEST, GET_ALL_HALLS_SUCCESS, GET_HALL_FAILURE, GET_HALL_REQUEST, GET_HALL_SUCCESS, OPEN_HALL_FAILURE, OPEN_HALL_REQUEST, OPEN_HALL_SUCCESS, SET_SELECTED_HALL, UPDATE_HALL_FAILURE, UPDATE_HALL_REQUEST, UPDATE_HALL_SUCCESS } from "./ActionType";
import axios from "axios";
import { baseURL } from "@/config/constants";

export const createHall = (data) => async (dispatch, getState) => {
    dispatch({ type: CREATE_HALL_REQUEST });

    try {
        const state = getState();
        const locationId = state.location?.selectedLocation?.id;

        if (!locationId) {
            throw new Error("Location ID is missing.");
        }

        const requestData = {
            ...data,
            seats_count: String(data.count_of_seats),
            locationId
        };

        const response = await axios.post(`${baseURL}/api/Hall/create_hall`, requestData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Hall created successfully!");
    } catch (e) {
        console.error(e);
        dispatch({ type: CREATE_HALL_FAILURE });
        toast.error(e.response?.data || "Failed to create hall!");
    }
};

export const getHallList = (showToast) => async (dispatch) => {
    dispatch({ type: GET_ALL_HALLS_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/Hall/get_halls`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: GET_ALL_HALLS_SUCCESS, payload: data });
        if (showToast) {
            toast.success("Halls getted successfully!");
        }
    } catch (e) {
        console.error(e);
        dispatch({ type: GET_ALL_HALLS_FAILURE });
        if (showToast) {
            toast.error("Failed to get hall list!");
        }
    }
}

export const getHallById = (id) => async (dispatch) => {
    dispatch({ type: GET_HALL_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/Hall/get_one_hall/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: GET_HALL_SUCCESS, payload: data });
        toast.success("Hall getted successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_HALL_FAILURE });
        toast.error("Failed get hall!")
    }
}

export const updateHall = (id, pathes) => async (dispatch) => {
    dispatch({ type: UPDATE_HALL_REQUEST });

    try {
        const response = await axios.patch(`${baseURL}/api/Hall/update_hall_info/${id}`, pathes, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        dispatch({ type: UPDATE_HALL_SUCCESS, payload: response.data });
        toast.success("Hall updated successfully!");
    } catch (e) {
        console.error(e);
        dispatch({ type: UPDATE_HALL_FAILURE });
        toast.error("Failed to update hall!");
    }
}

export const deleteHall = (id) => async (dispatch) => {
    dispatch({ type: DELETE_HALL_REQUEST });

    try {
        const response = await axios.delete(`${baseURL}/api/Hall/delete_hall/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: DELETE_HALL_SUCCESS });
        toast.success("Hall deleted successfully!");
    } catch (e) {
        console.error(e);
        dispatch({ type: DELETE_HALL_FAILURE });
        toast.error("Failed to delete hall!");
    }
}

export const openHall = (id) => async (dispatch) => {
    dispatch({ type: OPEN_HALL_REQUEST });

    try {
        const response = await axios.post(`${baseURL}/api/Hall/open_hall/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Hall is openned!");
        dispatch({ type: OPEN_HALL_SUCCESS });
        console.log(response);
    } catch (e) {
        console.error(e);
        dispatch({ type: OPEN_HALL_FAILURE });
        toast.error("Failed to open hall!");
    }
}

export const closeHall = (id) => async (dispatch) => {
    dispatch({ type: CLOSE_HALL_REQUEST });

    try {
        const response = await axios.post(`${baseURL}/api/Hall/close_hall/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log(response);
        toast.success("Hall is closed!")
        dispatch({ type: CLOSE_HALL_SUCCESS });
    } catch (e) {
        console.error(e);
        dispatch({ type: CLOSE_HALL_FAILURE });
        toast.error("Failed to close hall!");
    }
}


export const setSelectedHall = (hall) => ({
    type: SET_SELECTED_HALL,
    payload: hall,
});