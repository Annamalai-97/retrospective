import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step: 1,
    zoneName: "",
    description: "",
    type: "",
    titles: [],  
};

const multiStepSlice = createSlice({
    name: "multiStepModal",
    initialState,
    reducers: {
        nextStep: (state) => { state.step += 1; },
        prevStep: (state) => { state.step -= 1; },
        setZoneName: (state, action) => { state.zoneName = action.payload; },
        setDescription: (state, action) => { state.description = action.payload; },
        setType: (state, action) => { state.type = action.payload; },
        setTitles: (state, action) => { state.titles = action.payload; }, 
        resetModal: () => initialState,
        setBoardData: (state, action) => {
            state.zoneName = action.payload.boardName || "";
            state.description = action.payload.description || "";
            state.type = action.payload.type || "";
            state.titles = action.payload.titles || []; 
        },
    },
});

export const { 
    nextStep, prevStep, setZoneName, setTitles, setDescription, 
    resetModal, setBoardData, setType 
} = multiStepSlice.actions;

export default multiStepSlice.reducer;
