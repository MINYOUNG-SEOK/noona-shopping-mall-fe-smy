import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "장바구니에 추가되었습니다.",
          status: "success",
        })
      );
      return response.data.cartItemQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "이미 장바구니에 있는 아이템입니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "장바구니 목록을 불러오는데 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch, getState }) => {
    const previousCartList = getState().cart.cartList;
    const updatedCartList = previousCartList.filter((item) => item._id !== id);

    dispatch(setOptimisticCartList(updatedCartList));

    try {
      const response = await api.delete(`/cart/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "상품이 삭제되었습니다.",
          status: "success",
        })
      );

      return id;
    } catch (error) {
      // 요청 실패 시 상태 복구
      dispatch(setOptimisticCartList(previousCartList));

      dispatch(
        showToastMessage({
          message: "상품 삭제에 실패했습니다.",
          status: "error",
        })
      );

      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { dispatch, getState }) => {
    // 현재 카트 상태 저장
    const previousCartList = getState().cart.cartList;

    // Optimistic Update: 즉시 UI 업데이트
    dispatch(updateCartItemQty({ id, value }));

    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      return response.data;
    } catch (error) {
      // 에러 발생시 이전 상태로 복구
      dispatch(setOptimisticCartList(previousCartList));

      dispatch(
        showToastMessage({
          message: error.error || "수량 변경에 실패했습니다.",
          status: "error",
        })
      );

      throw error;
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      return response.data.data.length;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItemCount: (state, action) => {
      state.cartItemCount = action.payload;
    },
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    updateCartItemQty: (state, action) => {
      const { id, value } = action.payload;
      const item = state.cartList.find((item) => item._id === id);
      if (item) {
        item.qty = value;
      }
    },

    setOptimisticCartList: (state, action) => {
      state.cartList = action.payload;
      state.cartItemCount = action.payload.length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 장바구니 목록
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.cartItemCount = action.payload.length;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 장바구니 삭제
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = state.cartList.filter(
          (item) => item._id !== action.payload
        );
        state.cartItemCount = state.cartList.length;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 장바구니 수량 업데이트
      .addCase(updateQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const {
  initialCart,
  updateCartItemQty,
  setOptimisticCartList,
  setCartItemCount,
} = cartSlice.actions;
