import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Signup from "./Signup.jsx";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    const formData = { email, password };
        console.log("Request body:", JSON.stringify(formData));

    try {
      const res = await fetch("http://localhost:8888/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        
      });

      console.log("Request body:", JSON.stringify(formData));

      if (res.ok) {
        setLoading(false);
        toast.success("User login successfully 🎉");
        // Clear inputs
        setEmail("");
        setPassword("");
        const data = await res.json();
        data && localStorage.setItem("token", data.token);
        console.log("Login response data:", data);
        alert(data.message || "pta ni");
        // Navigate to login page
        navigate("/");
      } else {
        const error = await res.json();
        setLoading(false);
        setErrMsg(error.message || "Something went wrong");
        toast.error(error.message || "Something went wrong ❌");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrMsg("Server error");
      toast.error("server error");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login Page</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ color: "blue" }}>Sign up</Link>
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "auto", padding: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", fontSize: "16px" },
  button: { padding: "10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" },
};
