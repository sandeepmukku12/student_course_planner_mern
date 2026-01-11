import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/users/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // const login = async (email, password) => {
  //   const res = await api.post("/auth/login", { email, password });
  //   localStorage.setItem("token", res.data.token);
  //   localStorage.setItem("userId", res.data.user.id);
  //   setUser(res.data.user);
  // };

  // const signup = async (name, email, password) => {
  //   const res = await api.post("/auth/signup", { name, email, password });
  //   localStorage.setItem("token", res.data.token);
  //   localStorage.setItem("userId", res.data.user.id);
  //   setUser(res.data.user);
  // };

  // AuthContext.jsx - Updated Functions

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);

    // IMPORTANT: Instead of just trusting the login response user object,
    // fetch the fresh /me profile to ensure data consistency
    // (enrolledCourses array must be present)
    const profileRes = await api.get("/users/me");
    setUser(profileRes.data);
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("token", res.data.token);

    // Same as login: get the full profile immediately
    const profileRes = await api.get("/users/me");
    setUser(profileRes.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("lastSelectedTab");
    localStorage.removeItem("studyGroupsTab");
    setUser(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
