import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // T-shirt customization
  designId: `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  selectedType: localStorage.getItem("selectedType") || "crew-neck",
  tshirtColor: localStorage.getItem("tshirtColor") || "#FFFFFF",
  selectedView: "front",
  selectedSize: "M",
  originalFrontUrl: null,
  originalBackUrl: null,
};

export const tshirtSlice = createSlice({
  name: "designer",
  initialState,
  reducers: {
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
      localStorage.setItem("selectedType", action.payload);
    },
    setTshirtColor: (state, action) => {
      state.tshirtColor = action.payload;
      localStorage.setItem("tshirtColor", action.payload);
    },
    setSelectedView: (state, action) => {
      state.selectedView = action.payload;
    },
    setOriginalFrontUrl: (state, action) => {
      state.originalFrontUrl = action.payload;
    },
    setOriginalBackUrl: (state, action) => {
      state.originalBackUrl = action.payload;
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
  },
});

export const { setSelectedType, setTshirtColor, setSelectedView, setOriginalFrontUrl, setOriginalBackUrl, setSelectedSize } =
  tshirtSlice.actions;

export default tshirtSlice.reducer;
