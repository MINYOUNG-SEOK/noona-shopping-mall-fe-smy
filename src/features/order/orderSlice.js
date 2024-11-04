import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);

      dispatch(
        showToastMessage({
          message: "주문이 완료되었습니다.",
          status: "success",
        })
      );

      return response.data.orderNum;
    } catch (error) {
      // 에러 메시지 처리
      const errorMessage = error.error || "주문 처리 중 오류가 발생했습니다.";

      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        })
      );

      return rejectWithValue(errorMessage);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {}
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {}
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {}
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
