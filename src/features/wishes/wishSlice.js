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
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/wish/${productId}`);
      return { productId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 상품의 위시리스트 상태 확인
export const checkWishStatus = createAsyncThunk(
  "wishes/checkWishStatus",
  async (productId) => {
    const response = await api.get(`/wish/${productId}/status`);
    return response.data;
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
        const { productId, isWished, product } = action.payload;
        if (isWished) {
          state.wishList.push(product);
        } else {
          state.wishList = state.wishList.filter(
            (item) => item._id !== productId
          );
        }
      });
  },
});

export default wishSlice.reducer;
