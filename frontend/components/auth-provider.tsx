"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export enum UserRole {
  ADMIN = "ADMINISTRATEUR",
  PET_OWNER = "PROPRIETAIRE_ANIMAL",
  VETERINARIAN = "VETERINAIRE",
}

type User = {
  id: number;
  email: string;
  role: UserRole;
  nom: string;
  prenom: string;
};

type AuthResponse = {
  user: User;
  access_token: string;
  refresh_token?: string;
  message?: string;
  success?: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register_pet_owner: (
    nom: string,
    prenom: string,
    email: string,
    motDePasse: string,
    telephone?: string,
    adresse?: string
  ) => Promise<boolean>;
  register_vet: (
    nom: string,
    prenom: string,
    email: string,
    motDePasse: string,
    telephone?: string,
    adresse?: string,
    specialization?: string,
    numLicence?: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  refreshToken: () => Promise<boolean>;
  getStoredToken: () => string | null;
  getStoredUser: () => User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "http://localhost:3001";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export const getStoredToken = (): string | null => {
  //it prevents any server logic (local_storage) from executing on a browser environment
  if (typeof window === "undefined") return null;
  const tokenData = localStorage.getItem(TOKEN_KEY);
  if (!tokenData || tokenData === "undefined") return null;
  // Token is stored as a plain string, not JSON
  return tokenData;
};

const getStoredRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const tokenData = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!tokenData || tokenData === "undefined") return null;
  // Refresh token is also stored as a plain string
  return tokenData;
};

export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem(USER_KEY);
  if (!userData || userData === "undefined") return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
};

const storeAuthData = (authResponse: AuthResponse) => {
  localStorage.setItem(TOKEN_KEY, authResponse.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  if (authResponse.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refresh_token);
  }
};

const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  console.log(token);
  console.log(getStoredUser);

  const config: RequestInit = {
    ...options, //specify method
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await refreshTokenRequest();
      if (refreshed) {
        // Retry original request with new token
        const newToken = getStoredToken();
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return fetch(`${API_BASE_URL}${endpoint}`, config);
      } else {
        // Refresh failed, clear auth data
        clearAuthData();
        throw new Error("Session expired");
      }
    }
    throw new Error(`API Error: ${response.status}`);
  }

  return response;
};

const refreshTokenRequest = async (): Promise<boolean> => {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) return false;

    const authResponse: AuthResponse = await response.json();
    storeAuthData(authResponse);
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, motDePasse: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, motDePasse }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const authResponse: AuthResponse = await response.json();
      storeAuthData(authResponse);
      setUser(authResponse.user);
      setToken(authResponse.access_token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register_pet_owner = async (
    nom: string,
    prenom: string,
    email: string,
    motDePasse: string,
    telephone?: string,
    adresse?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          motDePasse,
          telephone,
          adresse,
          role: UserRole.PET_OWNER,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const registrationResponse: { success: boolean } = await response.json();

      return registrationResponse.success;
    } catch (error) {
      console.error("Pet owner registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register_vet = async (
    nom: string,
    prenom: string,
    email: string,
    motDePasse: string,
    telephone?: string,
    adresse?: string,
    specialization?: string,
    numLicence?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          motDePasse,
          telephone,
          adresse,
          specialization,
          numLicence,
          role: UserRole.VETERINARIAN,
        }),
      });

      if (!response.ok) {
        throw new Error("Veterinarian registration failed");
      }

      const registrationResponse: { success: boolean } = await response.json();

      return registrationResponse.success;
    } catch (error) {
      console.error("Veterinarian registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const success = await refreshTokenRequest();
      if (success) {
        const newUser = getStoredUser();
        const newToken = getStoredToken();
        setUser(newUser);
        setToken(newToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  const logout = () => {
    // Clear all auth data
    clearAuthData();
    setUser(null);
    setToken(null);

    // Optionally call logout endpoint
    if (token) {
      fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).catch(console.error); // Don't block logout if API call fails
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register_pet_owner,
        register_vet,
        logout,
        isLoading,
        refreshToken,
        getStoredToken,
  getStoredUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Utility hook for making authenticated API requests
export function useApiRequest() {
  const { logout } = useAuth();

  const request = async (endpoint: string, options: RequestInit = {}) => {
    try {
      return await apiRequest(endpoint, options);
    } catch (error) {
      if (error instanceof Error && error.message === "Session expired") {
        logout();
      }
      throw error;
    }
  };

  return { request };
}
