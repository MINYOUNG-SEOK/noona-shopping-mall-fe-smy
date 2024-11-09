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
      return productId;
    } catch (error) {
      return rejectWithValue(productId); // 실패 시 롤백을 위해 productId 반환
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
      // 위시리스트 가져오기
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
      .addCase(toggleWish.pending, (state, action) => {
        const productId = action.meta.arg;
        const index = state.wishList.findIndex(
          (item) => item._id === productId
        );

        // UI에서 즉각 반영
        if (index > -1) {
          state.wishList.splice(index, 1); // 이미 있는 경우 제거
        } else {
          state.wishList.push({ _id: productId }); // 없는 경우 추가
        }
      })
      .addCase(toggleWish.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(toggleWish.rejected, (state, action) => {
        const productId = action.payload;
        const index = state.wishList.findIndex(
          (item) => item._id === productId
        );

        // 실패 시 원래 상태로 복구
        if (index > -1) {
          state.wishList.splice(index, 1); // 추가한 항목 롤백
        } else {
          state.wishList.push({ _id: productId }); // 삭제한 항목 복구
        }
      });
  },
});

export default wishSlice.reducer;
