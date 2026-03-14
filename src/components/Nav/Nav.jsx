import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/authContext";
import { useUser } from "../../context/userContext/userContext";
import style from "./Nav.module.css";

export default function Nav() {
  const { user } = useUser();
  const { logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav("/");
  }

  return (
    <nav className={style.nav}>
      {user ? (
        <>
          <Link to={"/dash"}>
            <h3>Dashboard</h3>
          </Link>
          <Link to={"/analytics"}>
            <h3>Analytics</h3>
          </Link>
          <a href="">
            <h3 onClick={handleLogout}>Logout</h3>
          </a>
        </>
      ) : (
        <>
          <Link to={"/"}>
            <h3>Login/SignUp</h3>
          </Link>
        </>
      )}
    </nav>
  );
}
