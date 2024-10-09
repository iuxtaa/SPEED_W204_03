import React, { useState, useEffect } from 'react';
import styles from '../styles/rejected.module.css';

interface Article {
  id: number;
  title: string;
  authors: string; // Add authors field
  source: string; // Add source field
  publicationYear: number; // Add publication year field
  doi: string; // Add DOI field
  feedback?: string; // Optional field to hold feedback given by moderators
  status: string; // Status field for article state
}


const RejectedArticle: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

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

  // Filter articles based on search query
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Rejected Articles Review</h1>
      <div className={styles.searchContainer}>
        <span className={styles.searchHeader}>Insert Search Query Filter; Design to be decided</span>
        <input
          className={styles.searchBox}
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {filteredArticles.length === 0 ? (
        <p className={styles.noArticles}>No rejected articles to review.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Source</th>
              <th>Publication Year</th>
              <th>DOI</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.authors || 'N/A'}</td>
                <td>{article.source || 'N/A'}</td>
                <td>{article.publicationYear || 'N/A'}</td>
                <td>{article.doi || 'N/A'}</td>
                <td>{article.feedback ? article.feedback : 'No feedback provided'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className={styles.footer}>
        <p>Footnote</p>
      </div>
    </div>
  );
};
export default RejectedArticle;
