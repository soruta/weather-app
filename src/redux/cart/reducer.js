import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWeather = createAsyncThunk(
  'cart/fetchWeather',
  async function(data) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${data.name ? data.name : data}&cnt=7&units=metric&appid=ff5bb4c4a9717f82bb05d858d81d8eb0&lang=ru`);
    const item = await res.json();
    return item;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    itemsInCart: []
  },
  reducers: {
    addItemToCart: (state, action) => {
      if (state.itemsInCart.length >= 10) {
        state.itemsInCart.pop();
      }
      state.itemsInCart.unshift(action.payload);
    },
    deleteItemFromCart: (state, action) => {
      state.itemsInCart = state.itemsInCart.filter(item => item.params.meta.requestId !== action.payload);
    }
  }
});

export const { addItemToCart, deleteItemFromCart } = cartSlice.actions;
export default cartSlice.reducer;