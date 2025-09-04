import {
    CREATE_HALL_FAILURE, CREATE_HALL_REQUEST, CREATE_HALL_SUCCESS,
    GET_ALL_HALLS_FAILURE, GET_ALL_HALLS_REQUEST, GET_ALL_HALLS_SUCCESS,
    GET_HALL_FAILURE,
    GET_HALL_REQUEST,
    GET_HALL_SUCCESS,
    SET_SELECTED_HALL
} from "./ActionType";

const initialState = {
    hall: null,
    halls: [],
    selectedHall: null,
    loading: false,
    error: null,
};

export const hallReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_HALL_REQUEST:
        case GET_ALL_HALLS_REQUEST:
        case GET_HALL_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_HALL_SUCCESS:
        case GET_HALL_SUCCESS:
            return { ...state, loading: false, hall: action.payload };
        case GET_ALL_HALLS_SUCCESS:
            return { ...state, loading: false, halls: action.payload };
        case SET_SELECTED_HALL:
            return { ...state, selectedHall: action.payload };
        case CREATE_HALL_FAILURE:
            return { ...state, loading: false, error: "Failed to create hall!" };
        case GET_ALL_HALLS_FAILURE:
            return { ...state, loading: false, error: "Failed to get hall list!" };
        case GET_HALL_FAILURE:
            return { ...state, loading: false, error: "Failed to get hall!" };
        default:
            return state;
    }
}