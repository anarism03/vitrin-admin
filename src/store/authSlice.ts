import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import AuthService from "../services/AuthService";
import type {
  AuthSession,
  AuthUser,
  LoginForm,
  LoginResponse,
} from "../types/auth.type";
import {
  clearAuthStorage,
  getStoredAuthSession,
  saveAuthUser,
  saveAuthSession,
} from "../utils/authStorage";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  userEmail: string;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
};

const unwrap = <T>(data: T | { data: T }): T => {
  if (data && typeof data === "object" && "data" in data) {
    return data.data;
  }

  return data as T;
};

const getLoginError = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Email və ya parol yanlışdır"
    );
  }

  if (error instanceof Error) return error.message;
  return "Giriş zamanı xəta baş verdi";
};

const makeSession = (response: LoginResponse, email: string): AuthSession => {
  if (!response.accessToken || !response.refreshToken) {
    throw new Error("Tokenlər backend cavabında tapılmadı");
  }

  const fallbackUser: AuthUser = { id: email, email };

  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    user: response.user ?? fallbackUser,
    userEmail: email,
  };
};

const createInitialState = (): AuthState => {
  const session = getStoredAuthSession();

  return {
    accessToken: session?.accessToken ?? null,
    refreshToken: session?.refreshToken ?? null,
    user: session?.user ?? null,
    userEmail: session?.userEmail ?? "",
    loading: false,
    error: "",
    isAuthenticated: Boolean(session?.accessToken && session.refreshToken),
  };
};

export const loginUser = createAsyncThunk<
  AuthSession,
  LoginForm,
  { rejectValue: string }
>("auth/loginUser", async (form, { rejectWithValue }) => {
  try {
    const loginData = {
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
    };

    const response = await AuthService.login(loginData);
    const session = makeSession(
      unwrap<LoginResponse>(response.data),
      loginData.email,
    );
    saveAuthSession(session);

    return session;
  } catch (error) {
    return rejectWithValue(getLoginError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: createInitialState(),
  reducers: {
    setAuthSession: (state, action: PayloadAction<AuthSession>) => {
      saveAuthSession(action.payload);
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.userEmail = action.payload.userEmail;
      state.error = "";
      state.loading = false;
      state.isAuthenticated = true;
    },
    setAuthUser: (state, action: PayloadAction<AuthUser>) => {
      saveAuthUser(action.payload);
      state.user = action.payload;
    },
    logout: (state) => {
      clearAuthStorage();
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.userEmail = "";
      state.loading = false;
      state.error = "";
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.userEmail = action.payload.userEmail;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Giriş zamanı xəta baş verdi";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setAuthSession, setAuthUser } = authSlice.actions;
export default authSlice.reducer;
