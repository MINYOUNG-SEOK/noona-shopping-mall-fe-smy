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

      // DELETE 대신 POST 사용
      const response = await api.post(`/wish/${productId}`);
      const { data, isWished: newWishStatus } = response.data;

      if (newWishStatus) {
        dispatch(showToastMessage("위시리스트에 추가되었습니다."));
      } else {
        dispatch(showToastMessage("위시리스트에서 제거되었습니다."));
      }

      // 서버에서 반환된 최신 위시리스트로 상태 업데이트
      return {
        productId,
        action: newWishStatus ? "add" : "remove",
        wishList: data,
      };
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
        // 서버에서 반환된 최신 위시리스트로 상태 업데이트
        state.wishList = action.payload.wishList;
        state.error = null;
      });
  },
});

export default wishSlice.reducer;
