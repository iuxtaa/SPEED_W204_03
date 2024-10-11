import React, { useState, useEffect } from 'react';
import styles from '../styles/ViewAnalysed.module.css';

type Article = {
  _id: string;
  title: string;
  authors: string;
  source: string;
  publicationYear: number;
  doi: string;
  evidenceClaim: string;
  evidenceResult: string;
  methodology: string;
  approved?: boolean;
  status?: string;
};

const ViewAnalysed: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/articles/analysed-articles');
        if (response.ok) {
          const data = await response.json();

          // Optional: Log data to inspect available fields
          console.log('Fetched articles:', data);

          // Filter articles that are approved and have status 'Analysed'
          const approvedAnalysedArticles = data.filter((article: Article) => {
            return article.approved === true && article.status === 'Analysed';
          });

          setArticles(approvedAnalysedArticles);
        } else {
          console.error('Failed to fetch articles:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(
    (article) =>
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.authors?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.publicationYear?.toString().includes(searchQuery) ||
      article.doi?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>View Analysed Articles</h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Insert Search Query Filter"
          className={styles.searchInput}
        />
      </div>

      <table className={styles.articlesTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Authors</th>
            <th>Source</th>
            <th>Publication Year</th>
            <th>DOI</th>
            <th>Claim</th>
            <th>Evidence</th>
            <th>Methodology</th>
          </tr>
        </thead>
        <tbody>
          {filteredArticles.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.noArticles}>
                No analysed articles found.
              </td>
            </tr>
          ) : (
            filteredArticles.map((article) => (
              <tr key={article._id}>
                <td>{article.title || 'N/A'}</td>
                <td>{article.authors || 'N/A'}</td>
                <td>{article.source || 'N/A'}</td>
                <td>{article.publicationYear || 'N/A'}</td>
                <td>{article.doi || 'N/A'}</td>
                <td>{article.evidenceClaim || 'N/A'}</td>
                <td>{article.evidenceResult || 'N/A'}</td>
                <td>{article.methodology || 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAnalysed;
