import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    totalExpense: 0
}


const generalSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setAuthorizeUser( state, action) {
            state.currentUser = action.payload
        },
        setTotalExpense( state, action) {
            state.totalExpense = action.payload
        }
    }
})

export const { setAuthorizeUser, setTotalExpense }  = generalSlice.actions;

export default generalSlice.reducer;
