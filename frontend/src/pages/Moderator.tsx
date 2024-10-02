import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Moderator.module.css';

type Article = {
  id: number;
  title: string;
  authors: string;
  publicationYear: string;
  abstract: string;
};

const ModeratorPage: React.FC = () => {
  // Sample data: list of articles pending approval
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: 'Understanding React Hooks',
      authors: 'John Doe, Jane Smith',
      publicationYear: '2021',
      abstract: 'An in-depth look at React Hooks and how to use them.',
    },
    {
      id: 2,
      title: 'Advanced TypeScript',
      authors: 'Alice Johnson',
      publicationYear: '2022',
      abstract: 'Exploring advanced features of TypeScript.',
    },
    // Add more articles as needed
  ]);

  const handleApprove = (id: number) => {
    // Logic to approve the article
    // For now, we'll simply remove it from the list
    setArticles(articles.filter((article) => article.id !== id));
    // In a real application, you would send a request to the backend API
  };

  const handleReject = (id: number) => {
    // Logic to reject the article
    // For now, we'll simply remove it from the list
    setArticles(articles.filter((article) => article.id !== id));
    // In a real application, you would send a request to the backend API
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Moderator Dashboard</title>
      </Head>
      <h1 className={styles.heading}>Moderator Dashboard</h1>
      {articles.length === 0 ? (
        <p>No articles pending approval.</p>
      ) : (
        <ul className={styles.articleList}>
          {articles.map((article) => (
            <li key={article.id} className={styles.articleItem}>
              <h2>{article.title}</h2>
              <p><strong>Authors:</strong> {article.authors}</p>
              <p><strong>Publication Year:</strong> {article.publicationYear}</p>
              <p><strong>Abstract:</strong> {article.abstract}</p>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.approveButton}
                  onClick={() => handleApprove(article.id)}
                >
                  Approve
                </button>
                <button
                  className={styles.rejectButton}
                  onClick={() => handleReject(article.id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModeratorPage;
