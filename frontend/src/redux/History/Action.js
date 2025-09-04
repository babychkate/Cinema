import { toast } from "react-toastify";
import { CLEAR_USER_HISTORY_FAILURE, CLEAR_USER_HISTORY_REQUEST, CLEAR_USER_HISTORY_SUCCESS, FILM_HISTORY_FAILURE, FILM_HISTORY_REQUEST, FILM_HISTORY_SUCCESS, GET_USER_FILM_HISTORY_FAILURE, GET_USER_FILM_HISTORY_REQUEST, GET_USER_FILM_HISTORY_SUCCESS, GET_USER_TICKET_HISTORY_FAILURE, GET_USER_TICKET_HISTORY_REQUEST, GET_USER_TICKET_HISTORY_SUCCESS } from "./ActionType"
import axios from "axios";
import { baseURL } from "@/config/constants";

export const saveFilmToHistory = (id) => async (dispatch) => {
    dispatch({ type: FILM_HISTORY_REQUEST });

    try {
        const { data } = await axios.post(`${baseURL}/api/History/HistoryOfFilms/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: FILM_HISTORY_SUCCESS, payload: data });
    } catch (e) {
        console.error(e);
        dispatch({ type: FILM_HISTORY_FAILURE });
        toast.error("Failed to save film to history!");
    }
}

export const getUserFilmHistory = () => async (dispatch) => {
    dispatch({ type: GET_USER_FILM_HISTORY_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/History/ListOfHistory`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: GET_USER_FILM_HISTORY_SUCCESS, payload: data });
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_USER_FILM_HISTORY_FAILURE });
    }
}

export const getUserTicketHistory = () => async (dispatch) => {
    dispatch({ type: GET_USER_TICKET_HISTORY_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/History/get_user_histories`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        dispatch({ type: GET_USER_TICKET_HISTORY_SUCCESS, payload: data });
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_USER_TICKET_HISTORY_FAILURE });
    }
}

export const clearUserTicketHistory = () => async (dispatch) => {
    dispatch({ type: CLEAR_USER_HISTORY_REQUEST });

    try {
        const response = await axios.delete(`${baseURL}/api/History/clear_user_history`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log(response);
        dispatch({ type: CLEAR_USER_HISTORY_SUCCESS });
    } catch (e) {
        console.log(e);
        toast.error("Failed to clear ticket history!");
        dispatch({ type: CLEAR_USER_HISTORY_FAILURE });
    }
}