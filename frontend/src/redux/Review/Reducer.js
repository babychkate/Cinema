import { DELETE_REVIEW_FAILURE, DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, GET_ALL_REVIEWS_FAILURE, GET_ALL_REVIEWS_REQUEST, GET_ALL_REVIEWS_SUCCESS, GET_REVIEWS_BY_FILM_ID_FAILURE, GET_REVIEWS_BY_FILM_ID_REQUEST, GET_REVIEWS_BY_FILM_ID_SUCCESS, SEND_REVIEW_FAILURE, SEND_REVIEW_REQUEST, SEND_REVIEW_SUCCESS } from "./ActionType";

const initialState = {
    review: null,
    reviews: [],
    loading: false,
    error: null,
};

export const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_REVIEW_REQUEST:
        case GET_REVIEWS_BY_FILM_ID_REQUEST:
        case DELETE_REVIEW_REQUEST:
        case GET_ALL_REVIEWS_REQUEST:
            return { ...state, loading: true, error: null };
        case SEND_REVIEW_SUCCESS:
            return { ...state, loading: false, review: action.payload };
        case GET_REVIEWS_BY_FILM_ID_SUCCESS:
        case GET_ALL_REVIEWS_SUCCESS:
            return { ...state, loading: false, reviews: action.payload };
        case DELETE_REVIEW_SUCCESS:
            return { ...state, loading: false };
        case SEND_REVIEW_FAILURE:
            return { ...state, loading: false, error: "Failed to send review!" };
        case GET_REVIEWS_BY_FILM_ID_FAILURE:
            return { ...state, loading: false, error: "Failed to get reviews list by film!" };
        case DELETE_REVIEW_FAILURE:
            return { ...state, loading: false, error: "Failed to delete review!" };
        case GET_ALL_REVIEWS_FAILURE:
            return { ...state, loading: false, error: "Failed to get reviews list!" };
        default:
            return state;
    }
}