import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/product", { params: { ...query } });
      if (response.status !== 200) throw new Error(response.error);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error fetching products."
      );
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error fetching product detail."
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/product", formData);
      dispatch(getProductList());
      dispatch(
        showToastMessage({
          message: "상품이 생성되었습니다.",
          status: "success",
        })
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.includes("E11000")
        ? "An error occurred."
        : error.response?.data?.error || "SKU already exists.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/product/${id}/delete`);
      dispatch(
        showToastMessage({
          message: "Product deleted successfully.",
          type: "success",
        })
      );
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "Error deleting product."
      );
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/product/${id}`, formData);
      dispatch(
        showToastMessage({
          message: "Product updated successfully.",
          type: "success",
        })
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.includes("E11000")
        ? "An error occurred."
        : error.response?.data?.error || "SKU already exists.";
      return rejectWithValue(errorMessage);
    }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    totalItemNum: 0,
    success: false,
    currentCategory: null,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 상품 생성
      .addCase(createProduct.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.success = true;
        // 생성된 상품을 리스트에 추가
        state.productList = [...state.productList, action.payload];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // 상품 리스트
      .addCase(getProductList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        console.log("Product List Data:", action.payload); // 데이터 구조 확인
        state.loading = false;
        state.productList = action.payload.data;
        state.totalPageNum = Math.ceil(action.payload.totalItemNum / 5);
        state.totalItemNum = action.payload.totalItemNum;
        state.error = "";
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.productList = [];
      })
      // 상품 상세
      .addCase(getProductDetail.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getProductDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload.data;
      })
      .addCase(getProductDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 상품 삭제
      .addCase(deleteProduct.pending, (state, action) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.productList = state.productList.filter(
          (product) => product.id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //상품 수정
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const {
  setSelectedProduct,
  setFilteredList,
  clearError,
  setCurrentCategory,
} = productSlice.actions;

export default productSlice.reducer;
