import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import client from "../lib/shopify";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
    "shop/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching products from Shopify...");
            const products = await client.product.fetchAll();
            console.log("Fetched products raw:", products);
            // Manually map crucial fields to plain objects to ensure Redux compatibility
            return products.map(p => ({
                id: p.id,
                title: p.title,
                handle: p.handle,
                description: p.description,
                images: p.images ? p.images.map(img => ({ src: img.src })) : [],
                variants: p.variants ? p.variants.map(v => ({
                    id: v.id,
                    title: v.title,
                    image: v.image ? { src: v.image.src } : null,
                    price: {
                        amount: String(v.price?.amount || v.price),
                        currencyCode: v.price?.currencyCode || 'USD'
                    }
                })) : []
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to create a checkout
export const createCheckout = createAsyncThunk(
    "shop/createCheckout",
    async (_, { rejectWithValue }) => {
        try {
            const checkout = await client.checkout.create();
            localStorage.setItem("checkout_id", checkout.id);
            return JSON.parse(JSON.stringify(checkout));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch an existing checkout
export const fetchCheckout = createAsyncThunk(
    "shop/fetchCheckout",
    async (checkoutId, { rejectWithValue }) => {
        try {
            const checkout = await client.checkout.fetch(checkoutId);
            return JSON.parse(JSON.stringify(checkout));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to add items to checkout
export const addItemToCheckout = createAsyncThunk(
    "shop/addItemToCheckout",
    async ({ checkoutId, lineItemsToAdd }, { rejectWithValue }) => {
        try {
            const checkout = await client.checkout.addLineItems(
                checkoutId,
                lineItemsToAdd
            );
            return JSON.parse(JSON.stringify(checkout));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to remove items from checkout
export const removeLineItem = createAsyncThunk(
    "shop/removeLineItem",
    async ({ checkoutId, lineItemIdsToRemove }, { rejectWithValue }) => {
        try {
            const checkout = await client.checkout.removeLineItems(
                checkoutId,
                lineItemIdsToRemove
            );
            return JSON.parse(JSON.stringify(checkout));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to update items in checkout
export const updateLineItem = createAsyncThunk(
    "shop/updateLineItem",
    async ({ checkoutId, lineItemsToUpdate }, { rejectWithValue }) => {
        try {
            const checkout = await client.checkout.updateLineItems(
                checkoutId,
                lineItemsToUpdate
            );
            return JSON.parse(JSON.stringify(checkout));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch collections with products
export const fetchCollections = createAsyncThunk(
    "shop/fetchCollections",
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching collections from Shopify...");
            const collections = await client.collection.fetchAllWithProducts();
            console.log("Fetched collections raw:", collections);

            // Map to plain objects
            return collections.map(c => ({
                id: c.id,
                title: c.title,
                handle: c.handle,
                description: c.description,
                image: c.image ? { src: c.image.src } : null,
                products: c.products ? c.products.map(p => ({
                    id: p.id,
                    title: p.title,
                    handle: p.handle,
                    description: p.description,
                    images: p.images ? p.images.map(img => ({ src: img.src })) : [],
                    variants: p.variants ? p.variants.map(v => ({
                        id: v.id,
                        title: v.title,
                        image: v.image ? { src: v.image.src } : null,
                        price: {
                            amount: String(v.price?.amount || v.price),
                            currencyCode: v.price?.currencyCode || 'USD'
                        }
                    })) : []
                })) : []
            }));
        } catch (error) {
            console.error("Error fetching collections:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch a single product by handle
export const fetchProductByHandle = createAsyncThunk(
    "shop/fetchProductByHandle",
    async (handle, { rejectWithValue }) => {
        try {
            console.log(`Fetching product with handle ${handle} from Shopify...`);
            const product = await client.product.fetchByHandle(handle);
            console.log("Fetched product raw:", product);

            // Map to plain object
            return {
                id: product.id,
                title: product.title,
                handle: product.handle,
                description: product.description,
                images: product.images ? product.images.map(img => ({ src: img.src })) : [],
                variants: product.variants ? product.variants.map(v => ({
                    id: v.id,
                    title: v.title,
                    image: v.image ? { src: v.image.src } : null,
                    price: {
                        amount: String(v.price?.amount || v.price),
                        currencyCode: v.price?.currencyCode || 'USD'
                    }
                })) : []
            };
        } catch (error) {
            console.error("Error fetching product by handle:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
    "shop/fetchProductById",
    async (productId, { rejectWithValue }) => {
        try {
            console.log(`Fetching product ${productId} from Shopify...`);
            const product = await client.product.fetch(productId);
            console.log("Fetched product raw:", product);

            // Map to plain object
            return {
                id: product.id,
                title: product.title,
                handle: product.handle,
                description: product.description,
                images: product.images ? product.images.map(img => ({ src: img.src })) : [],
                variants: product.variants ? product.variants.map(v => ({
                    id: v.id,
                    title: v.title,
                    image: v.image ? { src: v.image.src } : null,
                    price: {
                        amount: String(v.price?.amount || v.price),
                        currencyCode: v.price?.currencyCode || 'USD'
                    }
                })) : []
            };
        } catch (error) {
            console.error("Error fetching product by ID:", error);
            return rejectWithValue(error.message);
        }
    }
);

const shopSlice = createSlice({
    name: "shop",
    initialState: {
        products: [],
        collections: [],
        selectedProduct: null,
        checkout: {},
        isCartOpen: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        openCart: (state) => {
            state.isCartOpen = true;
        },
        closeCart: (state) => {
            state.isCartOpen = false;
        },
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Products
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Collections
            .addCase(fetchCollections.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCollections.fulfilled, (state, action) => {
                state.isLoading = false;
                state.collections = action.payload;
            })
            .addCase(fetchCollections.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Checkout
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.checkout = action.payload || {};
            })
            // Fetch Checkout
            .addCase(fetchCheckout.fulfilled, (state, action) => {
                state.checkout = action.payload || {};
            })
            // Add Item to Checkout
            .addCase(addItemToCheckout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addItemToCheckout.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checkout = action.payload || {};
                state.isCartOpen = true;
            })
            .addCase(addItemToCheckout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Remove Item from Checkout
            .addCase(removeLineItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeLineItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checkout = action.payload || {};
            })
            .addCase(removeLineItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Item in Checkout
            .addCase(updateLineItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateLineItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.checkout = action.payload || {};
            })
            .addCase(updateLineItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Product By Handle
            .addCase(fetchProductByHandle.pending, (state) => {
                state.isLoading = true;
                state.selectedProduct = null;
            })
            .addCase(fetchProductByHandle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductByHandle.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Product By ID
            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true;
                state.selectedProduct = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { openCart, closeCart, toggleCart } = shopSlice.actions;

export default shopSlice.reducer;
