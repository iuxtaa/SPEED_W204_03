import React, { useState, useEffect } from 'react';
import styles from '../styles/rejected.module.css';

interface Article {
  id: number;
  title: string;
  status: string;  // Status should be provided by the backend (e.g., 'Rejected')
  feedback?: string; // Optional field to hold feedback given by moderators
}

const RejectedArticle: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');

  // Fetch rejected articles from the backend
  useEffect(() => {
    const fetchRejectedArticles = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/articles/rejected-articles');
        if (response.ok) {
          const data = await response.json();
          setArticles(data); // Assume the response includes the status and feedback fields
        } else {
          setError('Failed to fetch rejected articles.');
        }
      } catch (error) {
        console.error('Error fetching rejected articles:', error);
        setError('Error fetching rejected articles.');
      }
    };

    fetchRejectedArticles();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Rejected Articles Review</h1>
      {error && <p className={styles.error}>{error}</p>}
      {articles.length === 0 ? (
        <p className={styles.noArticles}>No rejected articles to review.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>
                  <span
                    className={
                      article.status === 'Rejected'
                        ? styles.rejectedStatus
                        : styles.otherStatus
                    }
                  >
                    {article.status}
                  </span>
                </td>
                <td>
                  {article.feedback ? (
                    <span>{article.feedback}</span>
                  ) : (
                    <span className={styles.noFeedback}>No feedback provided</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RejectedArticle;
