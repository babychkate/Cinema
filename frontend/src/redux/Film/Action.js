import { toast } from "react-toastify";
import { CREATE_FILM_FAILURE, CREATE_FILM_REQUEST, CREATE_FILM_SUCCESS, DELETE_FILM_FAILURE, DELETE_FILM_REQUEST, DELETE_FILM_SUCCESS, GET_ALL_FILMS_FAILURE, GET_ALL_FILMS_REQUEST, GET_ALL_FILMS_SUCCESS, SET_CURRENT_FILM_NUMBER, SET_SELECTED_FILM, UPDATE_FILM_FAILURE, UPDATE_FILM_REQUEST, UPDATE_FILM_SUCCESS } from "./ActionType"
import axios from "axios";
import { baseURL } from "@/config/constants";

export const createFilm = (film) => async (dispatch) => {
    dispatch({ type: CREATE_FILM_REQUEST });

    try {
        const { data } = await axios.post(`${baseURL}/api/Admin/CreateFilm`, film, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        dispatch({
            type: CREATE_FILM_SUCCESS, payload: data,
        });

        toast.success('Film created successfully!');
    } catch (e) {
        console.log(e);
        dispatch({ type: CREATE_FILM_FAILURE });
        toast.error(e.data);
    }
}

export const updateFilm = (id, patches) => async (dispatch) => {
    dispatch({ type: UPDATE_FILM_REQUEST });

    try {
        const { data } = await axios.patch(`${baseURL}/api/Admin/UpdateFilm/${id}`, patches, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });

        dispatch({
            type: UPDATE_FILM_SUCCESS,
            payload: data,
        });

        toast.success(data);
    } catch (e) {
        console.log(e);
        dispatch({ type: UPDATE_FILM_FAILURE });
        toast.error(e.response?.data || "Failed to update film");
    }
};

export const deleteFilm = (id) => async (dispatch) => {
    dispatch({ type: DELETE_FILM_REQUEST });

    try {
        const { data } = await axios.delete(`${baseURL}/api/Admin/DeleteFilm/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        dispatch({ type: DELETE_FILM_SUCCESS });
        toast.success(data);
    } catch (e) {
        dispatch({ type: DELETE_FILM_FAILURE });
        toast.error(e.response?.message);
    }
}

export const getFilmList = (showToast, filters) => async (dispatch) => {
    dispatch({ type: GET_ALL_FILMS_REQUEST });

    let data;

    try {
        if (!filters || filters.selectedGenre === "all") {
            const response = await axios.get(`${baseURL}/api/Admin/ReadFilms`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            data = response.data;
        } else {
            const response = await axios.get(`${baseURL}/api/User/Filters`, {
                params: {
                    Genre: filters.selectedGenre,
                    Rating: filters.selectedAgeRating,
                    Year: filters.selectedYear,
                }
            });
            data = response.data;
        }
        dispatch({ type: GET_ALL_FILMS_SUCCESS, payload: data });
        if (showToast) {
            toast.success("Films fetched successfully!");
        }
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_ALL_FILMS_FAILURE });
        if (showToast) {
            toast.error(e.response?.message || "Failed to fetch films");
        }
    }
};

export const setSelectedFilm = (film) => ({
    type: SET_SELECTED_FILM,
    payload: film,
});

export const setFilmNumber = (number) => ({
    type: SET_CURRENT_FILM_NUMBER,
    payload: number,
});