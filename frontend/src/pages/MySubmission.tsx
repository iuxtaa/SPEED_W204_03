import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/MySubmission.module.css';

interface Article {
  id: number;
  title: string;
  status: string;
  submissionDate: string;
  feedback?: string;
}

const MySubmission: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

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
      } finally {
        setLoading(false);
      }
    };

    fetchMySubmissions();
  }, []);

  const handleResubmit = (article: Article) => {
    // Navigate to the submission form with the article ID in the URL
    router.push(`/submit/${article.id}`);
  };

  if (loading) {
    return <p className={styles.loading}>Loading your submissions...</p>;
  }

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.status}</td>
                <td>{new Date(article.submissionDate).toLocaleDateString()}</td>
                <td>{article.feedback || 'No feedback provided'}</td>
                <td>
                  {article.status === 'Rejected' ? (
                    <button
                      className={styles.resubmitButton}
                      onClick={() => handleResubmit(article)}
                    >
                      Submit Again
                    </button>
                  ) : (
                    <span>-</span>
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

export default MySubmission;


