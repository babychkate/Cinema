import axios from "axios";
import { GET_ALL_LOCATIONS_FAILURE, GET_ALL_LOCATIONS_REQUEST, GET_ALL_LOCATIONS_SUCCESS, SET_SELECTED_LOCATION } from "./ActionType"
import { baseURL } from "@/config/constants";
import { toast } from "react-toastify";

export const getLocationList = (showToast) => async (dispatch) => {
    dispatch({ type: GET_ALL_LOCATIONS_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/GeneralOperations/get_all_locations`);
        dispatch({ type: GET_ALL_LOCATIONS_SUCCESS, payload: data });
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_ALL_LOCATIONS_FAILURE });
        if (showToast) {
            toast.error("Faild to get locations!");
        }
    }
}

export const setSelectedLocation = (location) => ({
    type: SET_SELECTED_LOCATION,
    payload: location,
});
