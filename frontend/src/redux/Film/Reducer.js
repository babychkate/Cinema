import {
    CREATE_FILM_FAILURE, CREATE_FILM_REQUEST, CREATE_FILM_SUCCESS,
    UPDATE_FILM_REQUEST, UPDATE_FILM_SUCCESS, UPDATE_FILM_FAILURE,
    DELETE_FILM_REQUEST, DELETE_FILM_SUCCESS, DELETE_FILM_FAILURE,
    GET_ALL_FILMS_REQUEST,
    GET_ALL_FILMS_SUCCESS,
    GET_ALL_FILMS_FAILURE,
    SET_SELECTED_FILM,
    SET_CURRENT_FILM_NUMBER
} from "./ActionType";

const initialState = {
    film: null,
    films: [],
    selectedFilm: null,
    currentFilmNumber: 1,
    loading: false,
    error: null,
};

export const filmReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_FILM_REQUEST:
        case UPDATE_FILM_REQUEST:
        case DELETE_FILM_REQUEST:
        case GET_ALL_FILMS_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_FILM_SUCCESS:
        case UPDATE_FILM_SUCCESS:
            return { ...state, loading: false, film: action.payload };
        case DELETE_FILM_SUCCESS:
            return { ...state, loading: false, film: null };
        case GET_ALL_FILMS_SUCCESS:
            return { ...state, loading: false, films: action.payload };
        case SET_SELECTED_FILM:
            return { ...state, selectedFilm: action.payload };
        case SET_CURRENT_FILM_NUMBER:
            return { ...state, currentFilmNumber: action.payload };
        case CREATE_FILM_FAILURE:
        case UPDATE_FILM_FAILURE:
            return { ...state, loading: false, error: "Film operation failed!" };
        case DELETE_FILM_FAILURE:
            return { ...state, loading: false, error: "Delete film failed!" };
        case GET_ALL_FILMS_FAILURE:
            return { ...state, loading: false, error: "Get film list failed!" };
        default:
            return state;
    }
};
