import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "./context/userContext/userContext";
import { useAuth } from "./context/authContext/authContext";
import apiService from "./utilities/apiService.mjs";

// Pages
import AuthPage from "./pages/AuthPage/AuthPage";
import Dashboard from "./pages/DashBoard/DashBoard";
import AnalyticsPage from "./pages/AnalyticsPage/AnalyticsPage";

// Components
import ProtectedRoutes from "./components/ProtectedRoutes";
import Nav from "./components/Nav/Nav";

function App() {
  const { cookies, logout } = useAuth();
  const { setUser } = useUser();

  async function getData() {
    try {
      if (cookies.token) {
        let res = await apiService.getUser(cookies.token);

        setUser(res);
      }
    } catch (err) {
      logout();
      console.error(err.message);
    }
  }

  useEffect(() => {
    getData();
  }, [cookies.token]);

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
