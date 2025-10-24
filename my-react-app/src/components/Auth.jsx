import { useState } from 'react';
import { Sparkles, Mail, Lock, Building2, AlertCircle } from 'lucide-react';
// import { authAPI } from '../services/api';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignup ? authAPI.signup : authAPI.login;
      const response = await endpoint({
        email,
        password,
        businessName: isSignup ? businessName : undefined
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      } else {
        setError(response.data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 50%, #FAF5FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: '#FFFFFF',
      borderRadius: '24px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
      padding: '48px 40px',
      width: '100%',
      maxWidth: '480px',
      border: '1px solid #F3F4F6'
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
    inputFocus: {
      borderColor: '#4F46E5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
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
    divider: {
      textAlign: 'center',
      margin: '24px 0',
      color: '#9CA3AF',
      fontSize: '14px',
      position: 'relative'
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      background: '#E5E7EB',
      zIndex: 0
    },
    dividerText: {
      position: 'relative',
      display: 'inline-block',
      padding: '0 16px',
      background: '#FFFFFF',
      zIndex: 1
    },
    switchText: {
      textAlign: 'center',
      marginTop: '24px',
      color: '#6B7280',
      fontSize: '15px'
    },
    switchButton: {
      color: '#4F46E5',
      fontWeight: '600',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      marginLeft: '4px'
    },
    trialBadge: {
      textAlign: 'center',
      marginTop: '20px',
      padding: '12px',
      background: 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)',
      borderRadius: '12px',
      fontSize: '14px',
      color: '#4F46E5',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '13px',
      color: '#6B7280'
    },
    checkIcon: {
      width: '16px',
      height: '16px',
      color: '#10B981',
      flexShrink: 0
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
        <h2 style={styles.title}>
          {isSignup ? 'Start Your Free Trial' : 'Welcome Back'}
        </h2>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignup && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <Building2 style={{ width: '16px', height: '16px' }} />
                Business Name
              </label>
              <div style={styles.inputWrapper}>
                <Building2 style={{ ...styles.icon, width: '20px', height: '20px' }} />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g., Cafe Delight"
                  style={styles.input}
                  required={isSignup}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Mail style={{ width: '16px', height: '16px' }} />
              Email Address
            </label>
            <div style={styles.inputWrapper}>
              <Mail style={{ ...styles.icon, width: '20px', height: '20px' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                required
                disabled={loading}
                minLength={6}
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
                {isSignup ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Switch Auth Mode */}
        <p style={styles.switchText}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            style={styles.switchButton}
            type="button"
          >
            {isSignup ? 'Sign In' : 'Start Free Trial'}
          </button>
        </p>

        {/* Trial Badge */}
        {isSignup && (
          <div style={styles.trialBadge}>
            <Sparkles style={{ width: '18px', height: '18px' }} />
            <span>7-day free trial • No credit card required</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;