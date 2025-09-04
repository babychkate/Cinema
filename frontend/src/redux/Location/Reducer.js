import { GET_ALL_LOCATIONS_FAILURE, GET_ALL_LOCATIONS_REQUEST, GET_ALL_LOCATIONS_SUCCESS, SET_SELECTED_LOCATION } from "./ActionType";

const initialState = {
    locations: [],
    selectedLocation: null,
    loading: false,
    error: null,
};

export const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_LOCATIONS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_ALL_LOCATIONS_SUCCESS:
            return { ...state, loading: false, locations: action.payload };
        case GET_ALL_LOCATIONS_FAILURE:
            return { ...state, loading: false, error: "Faild to get locations!" };
        case SET_SELECTED_LOCATION:
            return { ...state, selectedLocation: action.payload };
        default:
            return state;
    }
}