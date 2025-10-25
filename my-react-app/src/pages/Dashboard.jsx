import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, Send, Check, Edit2, Sparkles, TrendingUp, Clock, Plus, X, LogOut } from 'lucide-react';
// import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedReply, setEditedReply] = useState('');
  // const [token, setToken] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(""); 
  const [username, setUsername] = useState("");
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
      totalReviews: mockReviews.length,
      responded,
      avgRating,
      pending
    });
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

  const handleSaveEdit = (reviewId) => {
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, aiReply: editedReply, status: 'responded' } : r
    ));
    setIsEditing(false);
    setSelectedReview(null);
    
    setStats(prev => ({
      ...prev,
      responded: prev.responded + 1,
      pending: prev.pending - 1
    }));
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
  const navigate = useNavigate();

  const navigateToSignup = () => {
    navigate("/login");
  };

  const getUsername = async () => {
    
    // Logic to get the username
    try {
      const res = await fetch("http://localhost:8888/auth/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        setLoading(false);
      } else {
        setLoading(false);
        setErrMsg(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      // setToken(null);
      setLoading(false);
      setErrMsg("Server error");
      toast.error("server error");
    }
  }

  useEffect(() => {
      getUsername();
  }, []);

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
    mainContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '32px 24px'
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
      border: '1px solid #F3F4F6',
      transition: 'box-shadow 0.3s ease'
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
    reviewCardSelected: {
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.3)'
    },
    reviewHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '12px'
    },
    reviewAvatar: {
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: '14px'
    },
    reviewMeta: {
      flex: 1
    },
    reviewAuthor: {
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px'
    },
    reviewRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px'
    },
    reviewDate: {
      fontSize: '12px',
      color: '#6B7280'
    },
    reviewText: {
      fontSize: '14px',
      color: '#374151',
      lineHeight: '1.6'
    },
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      color: '#059669',
      background: '#ECFDF5',
      padding: '4px 8px',
      borderRadius: '12px'
    },
    aiPanelHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '24px'
    },
    aiIcon: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      padding: '8px',
      borderRadius: '8px'
    },
    originalReview: {
      padding: '16px',
      background: '#F9FAFB',
      borderRadius: '12px',
      border: '1px solid #E5E7EB',
      marginBottom: '24px'
    },
    originalReviewHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px'
    },
    originalReviewAvatar: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: '12px'
    },
    originalReviewAuthor: {
      fontWeight: '600',
      color: '#111827',
      fontSize: '14px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '12px'
    },
    textarea: {
      width: '100%',
      padding: '16px',
      border: '2px solid #C7D2FE',
      borderRadius: '12px',
      fontSize: '14px',
      resize: 'none',
      fontFamily: 'inherit',
      lineHeight: '1.6',
      outline: 'none'
    },
    aiReplyBox: {
      padding: '16px',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)',
      borderRadius: '12px',
      border: '2px solid #C7D2FE'
    },
    aiReplyText: {
      color: '#1F2937',
      lineHeight: '1.6',
      fontSize: '14px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    buttonPrimary: {
      flex: 1,
      background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'opacity 0.3s ease',
      boxShadow: '0 4px 6px rgba(79, 70, 229, 0.3)'
    },
    buttonSecondary: {
      padding: '12px 24px',
      border: '2px solid #C7D2FE',
      color: '#4F46E5',
      borderRadius: '12px',
      fontWeight: '600',
      background: 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background 0.3s ease'
    },
    sentimentBadge: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '14px',
      marginTop: '16px'
    },
    sentimentPositive: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#059669',
      background: '#ECFDF5',
      padding: '8px 12px',
      borderRadius: '20px'
    },
    sentimentNegative: {
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
              <p style={styles.userName}>Cafe Delight</p>
              <p style={styles.userLocation}>Connaught Place, Delhi</p>
            </div>
            <div style={styles.avatar}>CD</div>
          </div>
          {token ? (
              <h3>{username}</h3>
            ) : (
              <button onClick={navigateToSignup}>Signup / Login</button>
            )}
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

        {/* Main Content */}
        <div style={styles.contentGrid}>
          {/* Reviews List */}
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Recent Reviews</h2>
              <span style={styles.badge}>{stats.pending} Pending</span>
            </div>

            <div style={styles.reviewsList}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  onClick={() => review.status === 'pending' && setSelectedReview(review)}
                  style={{
                    ...styles.reviewCard,
                    ...(review.status === 'pending' ? styles.reviewCardPending : styles.reviewCardResponded),
                    ...(selectedReview?.id === review.id ? styles.reviewCardSelected : {})
                  }}
                  onMouseEnter={(e) => {
                    if (review.status === 'pending') {
                      e.currentTarget.style.borderColor = '#A5B4FC';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (review.status === 'pending' && selectedReview?.id !== review.id) {
                      e.currentTarget.style.borderColor = '#C7D2FE';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewAvatar}>{review.avatar}</div>
                    <div style={styles.reviewMeta}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={styles.reviewAuthor}>{review.author}</h3>
                        {review.status === 'responded' && (
                          <span style={styles.statusBadge}>
                            <Check style={{ width: '12px', height: '12px' }} />
                            Replied
                          </span>
                        )}
                      </div>
                      <div style={styles.reviewRating}>
                        <StarRating rating={review.rating} />
                        <span style={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p style={styles.reviewText}>{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Reply Panel */}
          <div style={styles.panel}>
            {selectedReview ? (
              <div>
                <div style={styles.aiPanelHeader}>
                  <div style={styles.aiIcon}>
                    <Sparkles style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                  </div>
                  <h2 style={styles.panelTitle}>AI Generated Reply</h2>
                </div>

                {/* Original Review */}
                <div style={styles.originalReview}>
                  <div style={styles.originalReviewHeader}>
                    <div style={styles.originalReviewAvatar}>{selectedReview.avatar}</div>
                    <div>
                      <p style={styles.originalReviewAuthor}>{selectedReview.author}</p>
                      <StarRating rating={selectedReview.rating} />
                    </div>
                  </div>
                  <p style={styles.reviewText}>{selectedReview.text}</p>
                </div>

                {/* AI Reply */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={styles.label}>Your Reply</label>
                  {isEditing ? (
                    <textarea
                      value={editedReply}
                      onChange={(e) => setEditedReply(e.target.value)}
                      style={styles.textarea}
                      rows="6"
                      onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.target.style.borderColor = '#C7D2FE'}
                    />
                  ) : (
                    <div style={styles.aiReplyBox}>
                      <p style={styles.aiReplyText}>{selectedReview.aiReply}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={styles.buttonGroup}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(selectedReview.id)}
                        style={styles.buttonPrimary}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Send style={{ width: '16px', height: '16px' }} />
                        Send Reply
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        style={styles.buttonSecondary}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(selectedReview.id)}
                        style={styles.buttonPrimary}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Check style={{ width: '20px', height: '20px' }} />
                        Approve & Send
                      </button>
                      <button
                        onClick={() => handleEdit(selectedReview)}
                        style={styles.buttonSecondary}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#EEF2FF'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Edit2 style={{ width: '16px', height: '16px' }} />
                        Edit
                      </button>
                    </>
                  )}
                </div>

                {/* Sentiment Badge */}
                <div style={styles.sentimentBadge}>
                  {selectedReview.sentiment === 'positive' ? (
                    <span style={styles.sentimentPositive}>
                      <ThumbsUp style={{ width: '16px', height: '16px' }} />
                      Positive Review
                    </span>
                  ) : (
                    <span style={styles.sentimentNegative}>
                      <ThumbsDown style={{ width: '16px', height: '16px' }} />
                      Needs Attention
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>
                  <Sparkles style={{ width: '48px', height: '48px', color: '#4F46E5' }} />
                </div>
                <h3 style={styles.emptyTitle}>Select a Review</h3>
                <p style={styles.emptyText}>
                  Click on a pending review to see the AI-generated reply and approve it instantly
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;

