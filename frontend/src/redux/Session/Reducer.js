import {
    CREATE_SESSION_FAILURE,
    CREATE_SESSION_REQUEST,
    CREATE_SESSION_SUCCESS,
    GET_SESSION_LIST_FAILURE,
    GET_SESSION_LIST_REQUEST,
    GET_SESSION_LIST_SUCCESS,
    UPDATE_SESSION_FAILURE,
    UPDATE_SESSION_REQUEST,
    UPDATE_SESSION_SUCCESS
} from "./ActionType";

const initialState = {
    sessions: [],
    loading: false,
    error: null,
};

export const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SESSION_REQUEST:
        case GET_SESSION_LIST_REQUEST:
        case UPDATE_SESSION_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_SESSION_SUCCESS:
            return { ...state, loading: false };
        case GET_SESSION_LIST_SUCCESS:
            return { ...state, loading: false, sessions: action.payload };
        case UPDATE_SESSION_SUCCESS:
            return {  ...state, loading: false };
        case CREATE_SESSION_FAILURE:
            return { ...state, loading: false, error: "Failed to create session!" };
        case GET_SESSION_LIST_FAILURE:
            return { ...state, loading: false, error: "Failed to get sessions!" };
        case UPDATE_SESSION_FAILURE:
            return { ...state, loading: false, error: "Failed to update session!" };
        default:
            return state;
    }
}