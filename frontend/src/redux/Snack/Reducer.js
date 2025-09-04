import { BUY_SNACK_FAILURE, BUY_SNACK_REQUEST, BUY_SNACK_SUCCESS, CREATE_SNACK_FAILURE, CREATE_SNACK_REQUEST, CREATE_SNACK_SUCCESS, DELETE_SNACK_FAILURE, DELETE_SNACK_REQUEST, DELETE_SNACK_SUCCESS, GET_SNACK_LIST_FAILURE, GET_SNACK_LIST_REQUEST, GET_SNACK_LIST_SUCCESS, UPDATE_SNACK_FAILURE, UPDATE_SNACK_REQUEST, UPDATE_SNACK_SUCCESS } from "./ActionType";

const initialState = {
    snack: null,
    snacks: [],
    loading: false,
    error: null,
};

export const snackReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SNACK_REQUEST:
        case GET_SNACK_LIST_REQUEST:
        case DELETE_SNACK_REQUEST:
        case UPDATE_SNACK_REQUEST:
        case BUY_SNACK_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_SNACK_SUCCESS:
            return { ...state, loading: false, snack: action.payload };
        case GET_SNACK_LIST_SUCCESS:
            return { ...state, loading: false, snacks: action.payload };
        case DELETE_SNACK_SUCCESS:
        case UPDATE_SNACK_SUCCESS:
        case BUY_SNACK_SUCCESS:
            return { ...state, loading: false };
        case CREATE_SNACK_FAILURE:
            return { ...state, loading: false, error: "Failed to create snack!" };
        case GET_SNACK_LIST_FAILURE:
            return { ...state, loading: false, error: "Failed to get snack list!" };
        case DELETE_SNACK_FAILURE:
            return { ...state, loading: false, error: "Failed to delete snack!" };
        case UPDATE_SNACK_FAILURE:
            return { ...state, loading: false, error: "Failed to update snack!" };
        case BUY_SNACK_FAILURE:
            return { ...state, loading: false, error: "Failed to buy snacks!" };
        default:
            return state;
    }
}