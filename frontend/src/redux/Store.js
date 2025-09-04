import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import { userReducer } from "./User/Reducer";
import { filmReducer } from "./Film/Reducer";
import { ticketReducer } from "./Ticket/Reducer";
import { hallReducer } from "./Hall/Reducer";
import { locationReducer } from "./Location/Reducer";
import { sessionReducer } from "./Session/Reducer";
import { snackReducer } from "./Snack/Reducer";
import { saleReducer } from "./Sale/Reducer";
import { historyReducer } from "./History/Reducer";
import { reviewReducer } from "./Review/Reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    userReducer: userReducer,
    film: filmReducer,
    ticket: ticketReducer,
    hall: hallReducer,
    location: locationReducer,
    session: sessionReducer,
    snack: snackReducer,
    sale: saleReducer,
    history: historyReducer,
    review: reviewReducer,
});
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))