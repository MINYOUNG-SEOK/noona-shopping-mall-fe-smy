import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart, getCartList } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 로그인 성공시 토큰 저장 1. session storage 2. session storage
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
      }

      dispatch(getCartList());

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Please check your email or password.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { dispatch, rejectWithValue }) => {
    // dispatch 추가
    try {
      const response = await api.post("/auth/google", { token });

      // 토큰 저장 로직 추가
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
      }

      // 로그인 성공 후 장바구니 정보 가져오기
      dispatch(getCartList());

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google 로그인 실패"
      );
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");

      dispatch(getCartList());

      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });

      // 성공
      // 1. 성공 토스트 메세지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다.",
          status: "success",
        })
      );
      // 2. 로그인 페이지로 리다이렉트
      navigate("/login");

      return response.data.data;
    } catch (error) {
      // 실패
      // 1. 실패 토스트 메세지 보여주기
      dispatch(
        showToastMessage({
          message: error.response?.data?.message || "회원가입을 실패했습니다.",
          status: "error",
        })
      );
      // 2. 에러 값을 저장한다
      return rejectWithValue(error.response?.data || "회원가입 실패");
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (_, { dispatch }) => {
    try {
      // 로컬 스토리지의 토큰 제거
      sessionStorage.removeItem("token");

      dispatch(initialCart());

      dispatch(
        showToastMessage({
          message: "로그아웃 되었습니다.",
          status: "success",
        })
      );

      return null;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register 리듀서
      .addCase(registerUser.pending, (state) => {
        console.log("Register pending...");
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("Register fulfilled:", action.payload);
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log("Register rejected:", action.payload);
        state.loading = false;
        state.registrationError = action.payload;
      })
      // Login 리듀서
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      // Token Login 리듀서
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // Logout 리듀서
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.cartList = [];
        state.user = null;
        state.loading = false;
        state.loginError = null;
        state.registrationError = null;
        state.success = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginWithGoogle.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
        state.success = true;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
