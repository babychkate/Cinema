import { toast } from "react-toastify";
import { DELETE_REVIEW_FAILURE, DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, GET_ALL_REVIEWS_FAILURE, GET_ALL_REVIEWS_REQUEST, GET_ALL_REVIEWS_SUCCESS, GET_REVIEWS_BY_FILM_ID_FAILURE, GET_REVIEWS_BY_FILM_ID_REQUEST, GET_REVIEWS_BY_FILM_ID_SUCCESS, SEND_REVIEW_FAILURE, SEND_REVIEW_REQUEST, SEND_REVIEW_SUCCESS } from "./ActionType"
import axios from "axios";
import { baseURL } from "@/config/constants";

export const sendReview = (review, id) => async (dispatch) => {
    dispatch({ type: SEND_REVIEW_REQUEST });

    try {
        const { data } = await axios.post(`${baseURL}/api/Review/create_review`, review, {
            params: {
                Filmid: id,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: SEND_REVIEW_SUCCESS, payload: data });
        toast.success("Review sended successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: SEND_REVIEW_FAILURE });
        toast.error(e.response?.message || "Failed to send review!");
    }
}

export const getReviewsByFilmId = (id, showToast) => async (dispatch) => {
    dispatch({ type: GET_REVIEWS_BY_FILM_ID_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/Review/get_reviews_by_film_id/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (showToast) {
            toast.success("Film reviews got successfully!");
        }
        dispatch({ type: GET_REVIEWS_BY_FILM_ID_SUCCESS, payload: data });
    } catch (e) {
        console.log(e);
        if (showToast) {
            toast.error("Failed to get film reviews!");
        }
        dispatch({ type: GET_REVIEWS_BY_FILM_ID_FAILURE });
    }
}

export const deleteReview = (id) => async (dispatch) => {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    try {
        const response = await axios.delete(`${baseURL}/api/Review/delete_review/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response);
        dispatch({ type: DELETE_REVIEW_SUCCESS });
        toast.success("Review deleted successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: DELETE_REVIEW_FAILURE });
        toast.error("Failed to delete review!");
    }
}

export const getReviewList = (showToast) => async (dispatch) => {
    dispatch({ type: GET_ALL_REVIEWS_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/Review/get_all_reviews`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(data);
        dispatch({ type: GET_ALL_REVIEWS_SUCCESS, payload: data });
        if (showToast) {
            toast.success("All reviews got successfully!");
        }
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_ALL_REVIEWS_FAILURE });
        if (showToast) {
            toast.error("Failed to get review list!");
        }
    }
}

export const deleteReviewByAdmin = (id) => async (dispatch) => {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    try {
        const response = await axios.delete(`${baseURL}/api/Review/delete_review_by_admin/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: DELETE_REVIEW_SUCCESS });
        toast.success("Review deleted successfully!");
    } catch (e) {
        console.log(e);
        dispatch({ type: DELETE_REVIEW_FAILURE });
        toast.error("Failed to delete review!");
    }
}