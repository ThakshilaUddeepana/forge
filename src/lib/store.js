import { configureStore } from "@reduxjs/toolkit";
import tshirtReducer from "../features/tshirtSlice";

import shopReducer from "../features/shopSlice";
import themeReducer from "../features/themeSlice";

export const store = configureStore({
  reducer: {
    tshirt: tshirtReducer,
    shop: shopReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serialization checks
        ignoredPaths: ['shop.products'],
        // Ignore these action types
        ignoredActions: ['shop/fetchProducts/fulfilled'],
      },
    }),
});

export default store;
