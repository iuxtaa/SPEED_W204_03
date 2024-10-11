import React, { useState, useEffect } from 'react';
import styles from '../styles/MySubmission.module.css'; // Create a CSS file for styling

interface Article {
  id: number;
  title: string;
  status: string;
  submissionDate: string;
  feedback?: string;
}

const MySubmission: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');

  // Fetch submitted articles by the logged-in user
  useEffect(() => {
    const fetchMySubmissions = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/articles/my-submissions');
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          setError('Failed to fetch your submitted articles.');
        }
      } catch (error) {
        console.error('Error fetching submitted articles:', error);
        setError('Error fetching your submitted articles.');
      }
    };

    fetchMySubmissions();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Submitted Articles</h1>
      {error && <p className={styles.error}>{error}</p>}
      {articles.length === 0 ? (
        <p className={styles.noArticles}>No articles submitted yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Submission Date</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.status}</td>
                <td>{article.submissionDate}</td>
                <td>{article.feedback ? article.feedback : 'No feedback provided'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MySubmission;
