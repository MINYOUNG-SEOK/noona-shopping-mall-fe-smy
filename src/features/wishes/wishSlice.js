import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 위시리스트 가져오기
export const getWishList = createAsyncThunk(
  "wishes/getWishList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wish");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

// 위시리스트 추가/제거
export const toggleWish = createAsyncThunk(
  "wishes/toggleWish",
  async (productId, { getState }) => {
    const { wishes } = getState();
    const isWished = wishes.wishList.some((item) => item._id === productId);

    if (isWished) {
      return { productId, action: "remove" };
    } else {
      return { productId, action: "add" };
    }
  }
);

const wishSlice = createSlice({
  name: "wishes",
  initialState: {
    wishList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishList = action.payload.data;
        state.error = null;
      })
      .addCase(getWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWish.fulfilled, (state, action) => {
        state.error = null;
      });
  },
});

export default wishSlice.reducer;
