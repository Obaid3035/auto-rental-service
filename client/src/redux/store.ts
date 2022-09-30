import { configureStore } from "@reduxjs/toolkit";
import generalReducer from "./slice/generalSlice";
import { apiSlice } from "./apiSlice";

export const store = configureStore({
    reducer: {
        general: generalReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware);
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
