import { APPLY_SALE_FAILURE, APPLY_SALE_REQUEST, APPLY_SALE_SUCCESS, CREATE_SALE_FAILURE, CREATE_SALE_REQUEST, CREATE_SALE_SUCCESS, DELETE_SALE_FAILURE, DELETE_SALE_REQUEST, DELETE_SALE_SUCCESS, GET_SALE_LIST_FAILURE, GET_SALE_LIST_REQUEST, GET_SALE_LIST_SUCCESS, GET_TOTAL_AMOUNT, UPDATE_SALE_FAILURE, UPDATE_SALE_REQUEST, UPDATE_SALE_SUCCESS } from "./ActionType";

const initialState = {
    sales: [],
    loading: false,
    error: null,
    totals: {},
};

export const saleReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_SALE_REQUEST:
        case GET_SALE_LIST_REQUEST:
        case UPDATE_SALE_REQUEST:
        case DELETE_SALE_REQUEST:
        case APPLY_SALE_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_SALE_SUCCESS:
        case UPDATE_SALE_SUCCESS:
        case DELETE_SALE_SUCCESS:
        case APPLY_SALE_SUCCESS:
            return { ...state, loading: false };
        case GET_TOTAL_AMOUNT:
            return { ...state, loading: false, totals: action.payload };
        case GET_SALE_LIST_SUCCESS:
            return { ...state, loading: false, sales: action.payload };
        case CREATE_SALE_FAILURE:
            return { ...state, loading: false, error: "Failed to create sale!" };
        case GET_SALE_LIST_FAILURE:
            return { ...state, loading: false, error: "Failed to get sale list!" };
        case UPDATE_SALE_FAILURE:
            return { ...state, loading: false, error: "Failed to update sale!" };
        case DELETE_SALE_FAILURE:
            return { ...state, loading: false, error: "Failed to delete sale!" };
        case APPLY_SALE_FAILURE:
            return { ...state, loading: false, error: "Failed to apply sale!" };
        default:
            return state;
    }
}