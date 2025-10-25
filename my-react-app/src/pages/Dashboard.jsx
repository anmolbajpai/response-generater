import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Send, Check, Edit2, Sparkles, TrendingUp, Clock, Plus, X, LogOut } from 'lucide-react';
// import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatingReply, setGeneratingReply] = useState(false);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    responded: 0,
    avgRating: 0,
    pending: 0
  });

  // New Review Form State
  const [newReview, setNewReview] = useState({
    authorName: '',
    rating: 5,
    reviewText: ''
  });

  // const navigate = useNavigate();

  // Fetch user data
  const fetchUserData = async () => {
    if (!token) {
      // navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          fetchReviews();
        } else {
          throw new Error("Verification failed");
        }
      } else {
        throw new Error("Unauthorized");
      }
    } catch (err) {
      console.error(err);
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        calculateStats(data.reviews || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    }
  };

  // Calculate stats from reviews
  const calculateStats = (reviewsList) => {
    const pending = reviewsList.filter(r => r.status === 'pending').length;
    const responded = reviewsList.filter(r => r.status === 'responded').length;
    const avgRating = reviewsList.length > 0 
      ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
      : 0;
    
    setStats({
      totalReviews: reviewsList.length,
      responded,
      avgRating,
      pending
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    // navigate("/login");
  };

  // Add new review
  const handleAddReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Review added successfully!");
        setShowAddModal(false);
        setNewReview({ authorName: '', rating: 5, reviewText: '' });
        fetchReviews();
      } else {
        throw new Error("Failed to add review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add review");
    } finally {
      setLoading(false);
    }
  };

  // Generate AI reply
  const handleGenerateReply = async (reviewId) => {
    setGeneratingReply(true);
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}/generate-reply`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        const updatedReview = { ...selectedReview, aiReply: data.aiReply };
        setSelectedReview(updatedReview);
        toast.success("AI reply generated!");
      } else {
        throw new Error("Failed to generate reply");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate AI reply");
    } finally {
      setGeneratingReply(false);
    }
  };

  // Approve and send reply
  const handleApprove = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ reply: selectedReview.aiReply })
      });

      if (res.ok) {
        toast.success("Reply sent successfully!");
        setSelectedReview(null);
        fetchReviews();
      } else {
        throw new Error("Failed to send reply");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };

  const handleEdit = (review) => {
    setIsEditing(true);
    setEditedReply(review.aiReply);
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reviews/${reviewId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ reply: editedReply })
      });

      if (res.ok) {
        toast.success("Reply updated and sent!");
        setIsEditing(false);
        setSelectedReview(null);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update reply");
    }
  };

  const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          style={{
            width: '16px',
            height: '16px',
            fill: i < rating ? '#FBBF24' : 'transparent',
            color: i < rating ? '#FBBF24' : '#D1D5DB'
          }}
        />
      ))}
    </div>
  );

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 50%, #FAF5FF 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoIcon: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      padding: '8px',
      borderRadius: '12px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      marginTop: '2px'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    userDetails: {
      textAlign: 'right'
    },
    userName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827'
    },
    userLocation: {
      fontSize: '12px',
      color: '#6B7280'
    },
    avatar: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontWeight: '600'
    },
    logoutBtn: {
      padding: '8px 16px',
      background: '#EF4444',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      fontWeight: '500'
    },
    mainContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 24px'
    },
    addButton: {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
      zIndex: 1000
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    },
    modalContent: {
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6B7280',
      padding: '4px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      fontSize: '14px',
      resize: 'vertical',
      minHeight: '120px',
      outline: 'none',
      fontFamily: 'inherit'
    },
    ratingSelector: {
      display: 'flex',
      gap: '8px',
      marginTop: '8px'
    },
    ratingBtn: {
      width: '40px',
      height: '40px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      background: '#FFFFFF',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      color: '#6B7280'
    },
    ratingBtnActive: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      color: '#FFFFFF',
      border: 'none'
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '8px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #F3F4F6'
    },
    statCardTop: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },
    statIcon: {
      padding: '12px',
      borderRadius: '12px'
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#111827'
    },
    statLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#6B7280'
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '24px'
    },
    panel: {
      background: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #F3F4F6',
      padding: '24px'
    },
    panelHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px'
    },
    panelTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#111827'
    },
    badge: {
      padding: '6px 12px',
      background: '#FFF7ED',
      color: '#C2410C',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '500'
    },
    reviewsList: {
      maxHeight: '600px',
      overflowY: 'auto'
    },
    reviewCard: {
      padding: '16px',
      borderRadius: '12px',
      border: '2px solid',
      marginBottom: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    reviewCardPending: {
      borderColor: '#C7D2FE',
      background: '#EEF2FF'
    },
    reviewCardResponded: {
      borderColor: '#F3F4F6',
      background: '#F9FAFB'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 24px',
      color: '#6B7280'
    },
    generateBtn: {
      padding: '10px 16px',
      background: '#10B981',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTop: '4px solid #4F46E5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6B7280' }}>Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Sparkles style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
            </div>
            <div>
              <h1 style={styles.logoText}>ReviewAI</h1>
              <p style={styles.subtitle}>Smart Review Management</p>
            </div>
          </div>
          <div style={styles.userInfo}>
            <div style={styles.userDetails}>
              <p style={styles.userName}>{user?.businessName || 'User'}</p>
              <p style={styles.userLocation}>{user?.email}</p>
            </div>
            <div style={styles.avatar}>
              {user?.businessName?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              <LogOut style={{ width: '16px', height: '16px' }} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statCardTop}>
              <div style={{...styles.statIcon, background: '#DBEAFE'}}>
                <TrendingUp style={{ width: '20px', height: '20px', color: '#2563EB' }} />
              </div>
              <span style={styles.statValue}>{stats.totalReviews}</span>
            </div>
            <p style={styles.statLabel}>Total Reviews</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardTop}>
              <div style={{...styles.statIcon, background: '#DCFCE7'}}>
                <Check style={{ width: '20px', height: '20px', color: '#16A34A' }} />
              </div>
              <span style={styles.statValue}>{stats.responded}</span>
            </div>
            <p style={styles.statLabel}>Responded</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardTop}>
              <div style={{...styles.statIcon, background: '#FEF3C7'}}>
                <Star style={{ width: '20px', height: '20px', color: '#CA8A04', fill: '#CA8A04' }} />
              </div>
              <span style={styles.statValue}>{stats.avgRating}</span>
            </div>
            <p style={styles.statLabel}>Avg Rating</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statCardTop}>
              <div style={{...styles.statIcon, background: '#FFEDD5'}}>
                <Clock style={{ width: '20px', height: '20px', color: '#EA580C' }} />
              </div>
              <span style={styles.statValue}>{stats.pending}</span>
            </div>
            <p style={styles.statLabel}>Pending</p>
          </div>
        </div>

        {/* Content Grid */}
        <div style={styles.contentGrid}>
          {/* Reviews List */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Your Reviews</h2>
              <span style={styles.badge}>{stats.pending} Pending</span>
            </div>

            <div style={styles.reviewsList}>
              {reviews.length === 0 ? (
                <div style={styles.emptyState}>
                  <Sparkles style={{ width: '48px', height: '48px', color: '#9CA3AF', margin: '0 auto 16px' }} />
                  <p>No reviews yet. Click the + button to add your first review!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    onClick={() => review.status === 'pending' && setSelectedReview(review)}
                    style={{
                      ...styles.reviewCard,
                      ...(review.status === 'pending' ? styles.reviewCardPending : styles.reviewCardResponded),
                      ...(selectedReview?.id === review.id ? { boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.3)' } : {})
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '600', fontSize: '14px' }}>
                        {review.authorName?.substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <h3 style={{ fontWeight: '600', color: '#111827' }}>{review.authorName}</h3>
                          {review.status === 'responded' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#059669', background: '#ECFDF5', padding: '4px 8px', borderRadius: '12px' }}>
                              <Check style={{ width: '12px', height: '12px' }} />
                              Replied
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <StarRating rating={review.rating} />
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{review.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Reply Panel */}
          <div style={styles.panel}>
            {selectedReview ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)', padding: '8px', borderRadius: '8px' }}>
                    <Sparkles style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                  </div>
                  <h2 style={styles.panelTitle}>AI Generated Reply</h2>
                </div>

                {!selectedReview.aiReply && (
                  <button
                    style={styles.generateBtn}
                    onClick={() => handleGenerateReply(selectedReview.id)}
                    disabled={generatingReply}
                  >
                    {generatingReply ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid #FFFFFF', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles style={{ width: '16px', height: '16px' }} />
                        Generate AI Reply
                      </>
                    )}
                  </button>
                )}

                <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '600', fontSize: '12px' }}>
                      {selectedReview.authorName?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>{selectedReview.authorName}</p>
                      <StarRating rating={selectedReview.rating} />
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{selectedReview.reviewText}</p>
                </div>

                {selectedReview.aiReply && (
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>Your Reply</label>
                    {isEditing ? (
                      <textarea
                        value={editedReply}
                        onChange={(e) => setEditedReply(e.target.value)}
                        style={styles.textarea}
                        rows="6"
                      />
                    ) : (
                      <div style={{ padding: '16px', background: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)', borderRadius: '12px', border: '2px solid #C7D2FE' }}>
                        <p style={{ color: '#1F2937', lineHeight: '1.6', fontSize: '14px' }}>{selectedReview.aiReply}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedReview.aiReply && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(selectedReview.id)}
                          style={{ flex: 1, background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          <Send style={{ width: '16px', height: '16px' }} />
                          Send Reply
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          style={{ padding: '12px 24px', border: '2px solid #C7D2FE', color: '#4F46E5', borderRadius: '12px', fontWeight: '600', background: 'transparent', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApprove(selectedReview.id)}
                          style={{ flex: 1, background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          <Check style={{ width: '20px', height: '20px' }} />
                          Approve & Send
                        </button>
                        <button
                          onClick={() => handleEdit(selectedReview)}
                          style={{ padding: '12px 24px', border: '2px solid #C7D2FE', color: '#4F46E5', borderRadius: '12px', fontWeight: '600', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                          <Edit2 style={{ width: '16px', height: '16px' }} />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)', padding: '24px', borderRadius: '50%', width: '96px', height: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Sparkles style={{ width: '48px', height: '48px', color: '#4F46E5' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Select a Review</h3>
                <p style={{ color: '#6B7280', lineHeight: '1.6' }}>
                  Click on a pending review to see the AI-generated reply and approve it instantly
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      <button
        style={styles.addButton}
        onClick={() => setShowAddModal(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(79, 70, 229, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.4)';
        }}
      >
        <Plus style={{ width: '28px', height: '28px' }} />
      </button>

      {/* Add Review Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Review</h2>
              <button style={styles.closeBtn} onClick={() => setShowAddModal(false)}>
                <X style={{ width: '24px', height: '24px' }} />
              </button>
            </div>

            <form onSubmit={handleAddReview}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Customer Name</label>
                <input
                  type="text"
                  value={newReview.authorName}
                  onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
                  placeholder="e.g., Priya Sharma"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Rating</label>
                <div style={styles.ratingSelector}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      style={{
                        ...styles.ratingBtn,
                        ...(newReview.rating === rating ? styles.ratingBtnActive : {})
                      }}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Review Text</label>
                <textarea
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  placeholder="Enter the customer's review..."
                  style={styles.textarea}
                  required
                />
              </div>

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Adding...' : 'Add Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;