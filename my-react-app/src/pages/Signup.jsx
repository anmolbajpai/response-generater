import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    const formData = { username, email, password };
        console.log("Request body:", JSON.stringify(formData));

    try {
      const res = await fetch("http://localhost:8888/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        
      });

      console.log("Request body:", JSON.stringify(formData));

      if (res.ok) {
        setLoading(false);
        alert("User registered successfully 🎉");
        // Clear inputs
        setUsername("");
        setEmail("");
        setPassword("");
        // Navigate to login page
        navigate("/login");
      } else {
        const error = await res.json();
        setLoading(false);
        setErrMsg(error.message || "Something went wrong");
        alert(error.message || "Something went wrong ❌");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrMsg("Server error");
      alert("gadbad ha re baba");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Signup Page</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
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

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      {errMsg && <p style={{ color: "red" }}>{errMsg}</p>}

      <p>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "blue" }}>Login</Link>
      </p>
    </div>
  );
}

const styles = {
  container: { maxWidth: "400px", margin: "auto", padding: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", fontSize: "16px" },
  button: { padding: "10px", background: "#28a745", color: "white", border: "none", cursor: "pointer" },
};
