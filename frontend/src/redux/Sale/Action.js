import { toast } from "react-toastify";
import { 
    APPLY_SALE_FAILURE, APPLY_SALE_REQUEST, APPLY_SALE_SUCCESS, 
    CREATE_SALE_FAILURE, CREATE_SALE_REQUEST, CREATE_SALE_SUCCESS, 
    DELETE_SALE_FAILURE, DELETE_SALE_REQUEST, DELETE_SALE_SUCCESS, 
    GET_SALE_LIST_FAILURE, GET_SALE_LIST_REQUEST, GET_SALE_LIST_SUCCESS, 
    GET_TOTAL_AMOUNT, 
    UPDATE_SALE_FAILURE, UPDATE_SALE_REQUEST, UPDATE_SALE_SUCCESS 
} from "./ActionType"
import axios from "axios";
import { baseURL } from "@/config/constants";

export const createSale = (data) => async (dispatch) => {
    dispatch({ type: CREATE_SALE_REQUEST });

    try {
        const response = await axios.post(`${baseURL}/api/Admin/CreateSale`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Sale created successfully!");
        dispatch({ type: CREATE_SALE_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: CREATE_SALE_FAILURE });
        toast.error("Failed to create sale!");
    }
}

export const getSaleList = (showToast) => async (dispatch) => {
    dispatch({ type: GET_SALE_LIST_REQUEST });

    try {
        const { data } = await axios.get(`${baseURL}/api/Admin/ReadSales`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (showToast) {
            toast.success("Sale list got successfully!");
        }
        dispatch({ type: GET_SALE_LIST_SUCCESS, payload: data });
    } catch (e) {
        console.log(e);
        dispatch({ type: GET_SALE_LIST_FAILURE });
        if (showToast) {
            toast.error("Failed to get sale list!");
        }
    }
}

export const updateSale = (id, patches) => async (dispatch) => {
    dispatch({ type: UPDATE_SALE_REQUEST });

    try {
        const response = await axios.patch(`${baseURL}/api/Admin/UpdateSale/${id}`, patches, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Sale updated successfully!");
        dispatch({ type: UPDATE_SALE_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: UPDATE_SALE_FAILURE });
        toast.error("Failed to update sale!");
    }
}

export const deleteSale = (id) => async (dispatch) => {
    dispatch({ type: DELETE_SALE_REQUEST });

    try {
        const response = await axios.delete(`${baseURL}/api/Admin/DeleteSale/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success("Sale deleted successfully!");
        dispatch({ type: DELETE_SALE_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: DELETE_SALE_FAILURE });
        toast.error("Failed to delete sale!");
    }
}

export const applySummerSale = () => async (dispatch) => {
    dispatch({ type: APPLY_SALE_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/User/SummerSale`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success(response?.message || "Sale applied successfully!");
        dispatch({ type: APPLY_SALE_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: APPLY_SALE_FAILURE });
        toast.error(e.response?.data.error || "Failed to apply sale!");
    }
}

export const applyDateSale = () => async (dispatch) => {
    dispatch({ type: APPLY_SALE_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/User/DateSale`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success(response?.message || "Sale applied successfully!");
        dispatch({ type: APPLY_SALE_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: APPLY_SALE_FAILURE });
        toast.error(e.response?.data.error || "Failed to apply sale!");
    }
}

export const applyFourSale = () => async (dispatch) => {
    dispatch({ type: APPLY_SALE_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/Test/FourSale`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success(response?.data.message || "Sale applied successfully!");
        dispatch({ type: APPLY_SALE_SUCCESS });
    } catch (e) {
        console.log(e);
        dispatch({ type: APPLY_SALE_FAILURE });
        toast.error(e.response?.data.error || "Failed to apply sale!");
    }
}

export const apply100PlusReviewsSale = () => async (dispatch) => {
    dispatch({ type: APPLY_SALE_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/Test/Reviews100Sale`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log(response);
        toast.success(response?.data.message || "Sale applied successfully!");
        dispatch({ type: APPLY_SALE_SUCCESS });
        dispatch({ type: GET_TOTAL_AMOUNT, payload: response?.data });
    } catch (e) {
        console.log(e);
        dispatch({ type: APPLY_SALE_FAILURE });
        toast.error(e.response?.data.error || "Failed to apply sale!");
    }
}

export const applyStudentSale = () => async (dispatch) => {
    dispatch({ type: APPLY_SALE_REQUEST });

    try {
        const response = await axios.get(`${baseURL}/api/Test/StudentSale`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        toast.success(response?.data.message || "Sale applied successfully!");
        dispatch({ type: APPLY_SALE_SUCCESS });
        dispatch({ type: GET_TOTAL_AMOUNT, payload: response?.data });
    } catch (e) {
        console.log(e);
        dispatch({ type: APPLY_SALE_FAILURE });
        toast.error(e.response?.data.error || "Failed to apply sale!");
    }
}