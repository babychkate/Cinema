import { GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType"

const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload, isAuthenticated: true };
        case GET_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload.data, isAuthenticated: true };
        case REGISTER_FAILURE:
            return { ...state, loading: false, error: "Registration failed" };
        case LOGIN_FAILURE:
            return { ...state, loading: false, error: "Login failed" };
        case LOGOUT:
            return { ...state, user: null, isAuthenticated: false, loading: false };
        default:
            return state;
    }
};
