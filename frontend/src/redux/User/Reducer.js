import {
    GET_USER_LIST_FAILURE,
    GET_USER_LIST_REQUEST,
    GET_USER_LIST_SUCCESS,
    UPDATE_USER_PROFILE_FAILURE,
    UPDATE_USER_PROFILE_REQUEST,
    UPDATE_USER_PROFILE_SUCCESS,
    BLOCK_USER_REQUEST,
    BLOCK_USER_SUCCESS,
    BLOCK_USER_FAILURE,
    FILTER_FILMS_REQUEST,
    FILTER_FILMS_SUCCESS,
    FILTER_FILMS_FAILURE,
    SET_FILTERS,
    SEARCH_FILMS_REQUEST,
    SEARCH_FILMS_SUCCESS,
    SEARCH_FILMS_FAILURE
} from "./ActionType";

const initialState = {
    user: null,
    users: [],
    films: [],
    filters: {
        selectedGenre: null,
        selectedYear: null,
        selectedAgeRating: null,
        movieRating: null,
        duration: null,
    },
    filteredFilms: [],
    loading: false,
    error: null,
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_USER_PROFILE_REQUEST:
        case GET_USER_LIST_REQUEST:
        case BLOCK_USER_REQUEST:
        case FILTER_FILMS_REQUEST:
        case SEARCH_FILMS_REQUEST:
            return { ...state, loading: true, error: null };

        case UPDATE_USER_PROFILE_SUCCESS:
            return { ...state, loading: false, user: action.payload };

        case GET_USER_LIST_SUCCESS:
            return { ...state, loading: false, users: action.payload };

        case BLOCK_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.filter(user => user.UserName !== action.payload)
            };

        case FILTER_FILMS_SUCCESS:
            return { ...state, loading: false, films: action.payload };

        case SEARCH_FILMS_SUCCESS:
            return { ...state, loading: false, filteredFilms: action.payload };

        case UPDATE_USER_PROFILE_FAILURE:
            return { ...state, loading: false, error: "Update profile failed!" };

        case GET_USER_LIST_FAILURE:
            return { ...state, loading: false, error: "Get list of users failed!" };

        case BLOCK_USER_FAILURE:
            return { ...state, loading: false, error: "Failed to block user!" };

        case FILTER_FILMS_FAILURE:
            return { ...state, loading: false, error: "Failed to filter film!" };

        case SET_FILTERS:
            return { ...state, filters: { ...state.filters, ...action.payload } };

        case SEARCH_FILMS_FAILURE:
            return { ...state, error: "Failed to search films!" };

        default:
            return state;
    }
};
