import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/authContext";
import { useUser } from "../../context/userContext/userContext";
import style from "./Nav.module.css";

export default function Nav() {
  const { user } = useUser();
  const { logout } = useAuth();
  const nav = useNavigate();

  function getNavLinkClass({ isActive }) {
    return isActive ? style['active-nav'] : style['inactive-nav'];
  }


  function handleLogout() {
    logout();
    nav("/");
  }

  return (
    <nav className={style.nav}>
      {user ? (
        <>
          <NavLink to={"/dash"} className={getNavLinkClass}>
            <h3>Dashboard</h3>
          </NavLink>
          <NavLink to={"/analytics"} className={getNavLinkClass}>
            <h3>Analytics</h3>
          </NavLink>
          <a href="">
            <h3 onClick={handleLogout}>Logout</h3>
          </a>
        </>
      ) : (
        <>
          <NavLink to={"/"} className={getNavLinkClass}>
            <h3>Login/SignUp</h3>
          </NavLink>
        </>
      )}
    </nav>
  );
}
