// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import Dashboard from "./Dashboard.jsx";
// import Signup from "./Signup.jsx";
// import { toast } from "react-hot-toast";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errMsg, setErrMsg] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrMsg("");

//     const formData = { email, password };
//         console.log("Request body:", JSON.stringify(formData));

//     try {
//       const res = await fetch("http://localhost:8888/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
        
//       });

//       console.log("Request body:", JSON.stringify(formData));

//       if (res.ok) {
//         setLoading(false);
//         toast.success("User login successfully 🎉");
//         // Clear inputs
//         setEmail("");
//         setPassword("");
//         const data = await res.json();
//         data && localStorage.setItem("token", data.token);
//         console.log("Login response data:", data);
//         alert(data.message || "pta ni");
//         // Navigate to login page
//         navigate("/");
//       } else {
//         const error = await res.json();
//         setLoading(false);
//         setErrMsg(error.message || "Something went wrong");
//         toast.error(error.message || "Something went wrong ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//       setErrMsg("Server error");
//       toast.error("server error");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Login Page</h2>
//       <form onSubmit={handleLogin} style={styles.form}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           style={styles.input}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           style={styles.input}
//           required
//         />
//         <button type="submit" style={styles.button}>Login</button>
//       </form>
//       <p>
//         Don’t have an account?{" "}
//         <Link to="/signup" style={{ color: "blue" }}>Sign up</Link>
//       </p>
//     </div>
//   );
// }

// const styles = {
//   container: { maxWidth: "400px", margin: "auto", padding: "20px" },
//   form: { display: "flex", flexDirection: "column", gap: "10px" },
//   input: { padding: "10px", fontSize: "16px" },
//   button: { padding: "10px", background: "#007bff", color: "white", border: "none", cursor: "pointer" },
// };



import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import Signup from "./Signup.jsx";
import { toast } from "react-hot-toast";
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';

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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #18191cff 0%, #0a0a0aff 50%, #070707ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: '#060606ff',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
      padding: '48px 40px',
      width: '100%',
      maxWidth: '480px',
      border: '1px solid #080808ff'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '32px'
    },
    logoIcon: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      padding: '16px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)'
    },
    logoText: {
      fontSize: '32px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '32px',
      color: '#111827'
    },
    errorBox: {
      background: '#FEF2F2',
      border: '1px solid #FEE2E2',
      color: '#DC2626',
      padding: '12px 16px',
      borderRadius: '12px',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    icon: {
      position: 'absolute',
      left: '16px',
      color: '#9CA3AF',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 48px',
      border: '2px solid #E5E7EB',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      backgroundColor: '#FFFFFF'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTop: '3px solid #FFFFFF',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    },
    switchText: {
      textAlign: 'center',
      marginTop: '24px',
      color: '#6B7280',
      fontSize: '15px'
    },
    link: {
      color: '#4F46E5',
      fontWeight: '600',
      textDecoration: 'none',
      marginLeft: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #4F46E5 !important;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
        }
      `}</style>

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>
            <Sparkles style={{ width: '32px', height: '32px', color: '#FFFFFF' }} />
          </div>
          <h1 style={styles.logoText}>ReviewAI</h1>
        </div>

        {/* Title */}
        <h2 style={styles.title}>Welcome Back</h2>

        {/* Error Message */}
        {errMsg && (
          <div style={styles.errorBox}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{errMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Mail style={{ width: '16px', height: '16px' }} />
              Email Address
            </label>
            <div style={styles.inputWrapper}>
              <Mail style={{ ...styles.icon, width: '20px', height: '20px' }} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Lock style={{ width: '16px', height: '16px' }} />
              Password
            </label>
            <div style={styles.inputWrapper}>
              <Lock style={{ ...styles.icon, width: '20px', height: '20px' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
            }}
          >
            {loading ? (
              <>
                <div style={styles.spinner} />
                Processing...
              </>
            ) : (
              <>
                <Sparkles style={{ width: '20px', height: '20px' }} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Switch to Signup */}
        <p style={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}