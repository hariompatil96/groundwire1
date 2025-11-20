import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    forms: []
};



export const formSlice = createSlice({
    name: "form",
    initialState,
    reducers: {
        updateForm: (state, action) => {
            state.form = action.payload;
        },
    },
})

export const { updateForm } = formSlice.actions;

export default formSlice.reducer;