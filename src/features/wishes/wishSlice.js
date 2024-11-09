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
  async (productId, { getState, dispatch, rejectWithValue }) => {
    const isWished = getState().wishes.wishList.some(
      (item) => item._id === productId
    );

    try {
      if (isWished) {
        await api.delete(`/wish/${productId}`);
      } else {
        await api.post(`/wish/${productId}`);
      }
      return { productId, isWished };
    } catch (error) {
      return rejectWithValue(productId);
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
        const { productId, isWished } = action.payload;
        const index = state.wishList.findIndex(
          (item) => item._id === productId
        );

        if (isWished && index > -1) {
          state.wishList.splice(index, 1);
        } else if (!isWished && index === -1) {
          state.wishList.push({ _id: productId });
        }
        state.error = null;
      })
      .addCase(toggleWish.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default wishSlice.reducer;
