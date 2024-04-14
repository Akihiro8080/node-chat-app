// reduxのstore情報を定義

import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import useReducer from "../Features/userSlice";

const reducers = combineReducers({
    user:useReducer,
});

const persistConfig = {
    key:'root',
    storage
};

const persistedReducer = persistReducer(persistConfig,reducers)

export const store = configureStore({
    reducer: persistedReducer
});

export default store;