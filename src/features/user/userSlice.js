import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 로그인 성공시 토큰 저장
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "이메일 혹은 비밀번호를 확인해주세요.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { token });
      // 구글 로그인 성공시 토큰 저장
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
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
  async (_, { rejectWithValue }) => {
    // try {
    //   const response = await api.post("/auth/token");
    //   return response.data;
    // } catch (error) {
    //   return rejectWithValue(error.response?.data || "토큰 로그인 실패");
    // }
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

export const logout = () => (dispatch) => {
  dispatch(userSlice.actions.setLoading(true));
  try {
    localStorage.removeItem("token"); // 토큰 제거
    dispatch(userSlice.actions.logoutSuccess());
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    dispatch(userSlice.actions.setLoading(false));
  }
};

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
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        console.log("Login fulfilled:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        console.log("Login rejected:", action.payload);
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
