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
    itemsInCart: [],
    likedLocations: JSON.parse(localStorage.getItem('likedLocations')) || [] // Инициализация из localStorage
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

      // Удаление элемента из likedLocations
      state.likedLocations = state.likedLocations.filter(item => item.location.params.meta.requestId !== action.payload);

      // Обновление localStorage после удаления
      localStorage.setItem('likedLocations', JSON.stringify(state.likedLocations));
    },
    toggleLikedLocation: (state, action) => {
      const index = state.likedLocations.findIndex(item => item.id === action.payload.id);

      if (index !== -1) {
        // Удаляем карточку из списка лайкнутых
        state.likedLocations.splice(index, 1);
      } else {
        // Добавляем карточку в список лайкнутых
        state.likedLocations.push(action.payload);
      }

      // Сохранение в localStorage
      localStorage.setItem('likedLocations', JSON.stringify(state.likedLocations));
    }
  }
});

export const { addItemToCart, deleteItemFromCart, toggleLikedLocation } = cartSlice.actions;
export default cartSlice.reducer;