import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Moderator.module.css';

type Article = {
  _id: string;
  title: string;
  author: string;
  journalName: string;
  publicationYear: number;
  doi: string;
  email: string;
  status: string; 
  feedback?: string; 
};

const ModeratorPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');
  const [feedback, setFeedback] = useState<string>(''); // State for feedback input
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null); // State for selected article
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false); // State to toggle feedback form visibility

  useEffect(() => {
    // Fetch unmoderated articles from the backend
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/articles/unmoderated-articles');
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          setError('Failed to fetch articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles');
      }
    };

    fetchArticles();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8082/api/articles/${id}/accept`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setArticles(articles.filter((article) => article._id !== id));
      } else {
        setError('Failed to accept article');
      }
    } catch (error) {
      console.error('Error accepting article:', error);
      setError('Failed to accept article');
    }
  };

  const handleReject = async () => {
    if (!selectedArticle) return;
    if (!feedback) {
      alert('Please provide feedback for the rejection.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8082/api/articles/${selectedArticle._id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }), // Include feedback in the request body
      });

      if (response.ok) {
        // Remove the rejected article from the list and reset the feedback form
        setArticles(articles.filter((article) => article._id !== selectedArticle._id));
        setFeedback('');
        setSelectedArticle(null);
        setShowFeedbackForm(false);
        alert('Article rejected with feedback!');
      } else {
        setError('Failed to reject article');
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
      setError('Failed to reject article');
    }
  };

  const openFeedbackForm = (article: Article) => {
    setSelectedArticle(article);
    setShowFeedbackForm(true);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Moderator Dashboard</title>
      </Head>
      <h1 className={styles.heading}>Moderator Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}
      {articles.length === 0 ? (
        <p className={styles.noArticles}>No articles pending approval.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Journal</th>
              <th>Year</th>
              <th>DOI</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.author}</td>
                <td>{article.journalName}</td>
                <td>{article.publicationYear}</td>
                <td>{article.doi}</td>
                <td>{article.email}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.acceptButton}
                    onClick={() => handleApprove(article._id)}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => openFeedbackForm(article)} // Open the feedback form on reject
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {}
      {showFeedbackForm && (
        <div className={styles.feedbackModal}>
          <div className={styles.feedbackContent}>
            <h2>Provide Feedback for Rejection</h2>
            <textarea
              className={styles.feedbackInput}
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className={styles.feedbackActions}>
              <button className={styles.submitButton} onClick={handleReject}>
                Submit Feedback & Reject
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setShowFeedbackForm(false);
                  setFeedback('');
                  setSelectedArticle(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeratorPage;
