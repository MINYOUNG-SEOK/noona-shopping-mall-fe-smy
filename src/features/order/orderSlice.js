import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty, setCartItemCount } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  orderList: [],
  selectedOrder: null,
  error: null,
  loading: false,
  totalPageNum: 1,
  totalItemNum: 0,
};

// 주문 생성
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);

      // 남은 장바구니 개수로 업데이트
      dispatch(setCartItemCount(response.data.cartItemCount));

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

// 주문 목록
export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/my-orders");
      console.log("내 주문 목록 응답:", response.data);
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "주문 목록을 불러오는데 실패했습니다."
      );
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(query).toString();
      const response = await api.get(`order/admin/orders?${queryString}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to get orders"
      );
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`order/admin/orders/${id}`, { status });

      dispatch(
        showToastMessage({
          message: "주문 상태가 성공적으로 업데이트되었습니다.",
          status: "success",
        })
      );

      return response.data.order;
    } catch (error) {
      dispatch(
        showToastMessage({
          message:
            error.response?.data?.error || "주문 상태 업데이트에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data?.error);
    }
  }
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
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderList = [];
      })
      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderList = action.payload.orders;
        state.totalPageNum = action.payload.totalPageNum;
        state.totalItemNum = action.payload.totalOrders;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderList = [];
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        // 업데이트된 주문으로 목록 갱신
        const updatedOrder = action.payload;
        state.orderList = state.orderList.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
