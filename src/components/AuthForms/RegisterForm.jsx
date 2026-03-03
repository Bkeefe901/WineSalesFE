import { useState } from "react";
import { useAuth } from "../../context/authContext/authContext";
import { useNavigate } from "react-router-dom";
import style from "./Forms.module.css";

export default function RegisterForm({ setNewUser }) {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [strength, setStrength] = useState(null); // state for password strength
  const [strengthStyle, setStrengthStyle] = useState(""); // state to style div color based on password strength
  const regexStr = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
  const regexWeak = /^(?=.*[a-zA-Z])(?=.*\d).*$/;
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    password2: "",
  });

  // Message variables for password strength
  const strong = "Password is strong";
  const medium = "Password Strength is medium, it contains letters and numbers";
  const weak = "Password is weak";

  function handleChange(e) {
    // Conditionals for password strength
    if (e.target.name == "password") {
      if (regexStr.test(e.target.value) && e.target.value.length >= 6) {
        setStrength(strong);
        setStrengthStyle("green");
      } else if (regexWeak.test(e.target.value) && e.target.value.length >= 6) {
        setStrength(medium);
        setStrengthStyle("yellow");
      } else {
        setStrength(weak);
        setStrengthStyle("red");
      }
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.password !== formData.password2) {
        alert("Passwords do not match");
        throw new Error("Password Dont Match");
      }
      await signUp(formData);
      nav("/dash");
    } catch (err) {
      console.error(err.message);
    }
  }

  // Handler to toggle to login form
  const handleClick = () => {
    setNewUser(false);
  };

  return (
    <>
      <div className={style.forms}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Username"
            />{" "}
          </label>
          <label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
          </label>
          <label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              minLength="6"
            />{" "}
          </label>
          <input
            type="password"
            name="password2"
            className={style.password2}
            value={formData.password2}
            onChange={handleChange}
            placeholder="Confirm Password"
            minLength="6"
          />
          <input type="submit" value="Sign Up" style={{ lineHeight: "10px" }} />
        </form>
        <p>
          Already have an account?{" "}
          <button onClick={handleClick}>Sign In</button>
        </p>
      </div>
      <div
        style={{
          backgroundColor: strengthStyle,
          color: "black",
          width: "400px",
          margin: "auto",
        }}
      >
        <h3>{strength}</h3>
      </div>
    </>
  );
}
