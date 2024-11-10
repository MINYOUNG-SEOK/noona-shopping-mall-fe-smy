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
  async (productId, { getState, dispatch }) => {
    try {
      const { wishes } = getState();
      const isWished = wishes.wishList.some((item) => item._id === productId);

      if (isWished) {
        await api.delete(`/wish/${productId}`);
        dispatch(showToastMessage("위시리스트에서 제거되었습니다."));
        return { productId, action: "remove" };
      } else {
        await api.post(`/wish/${productId}`);
        dispatch(showToastMessage("위시리스트에 추가되었습니다."));
        return { productId, action: "add" };
      }
    } catch (error) {
      throw error;
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
        const { productId, action: wishAction } = action.payload;

        if (wishAction === "add") {
          if (!state.wishList.some((item) => item._id === productId)) {
            state.wishList.push({ _id: productId });
          }
        } else {
          state.wishList = state.wishList.filter(
            (item) => item._id !== productId
          );
        }

        state.error = null;
      });
  },
});

export default wishSlice.reducer;
