// src/components/AnalystClaim.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/AnalystClaim.module.css';

type Article = {
  _id: string;
  title: string;
  authors: string;
  journalName: string;
  publicationYear: number;
  evidenceClaim?: string;
  evidenceResult?: string;
};

const AnalystClaim: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    evidenceClaim: '',
    evidenceResult: '',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch moderated articles from the backend
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/articles/moderated-articles');
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

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      evidenceClaim: article.evidenceClaim || '',
      evidenceResult: article.evidenceResult || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    try {
      const response = await fetch(`http://localhost:8082/api/articles/${selectedArticle._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedArticle = await response.json();
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === updatedArticle._id ? updatedArticle : article
          )
        );
        alert('Article updated successfully!');
      } else {
        setError('Failed to update article');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      setError('Failed to update article');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Analyst Dashboard</title>
      </Head>
      <h1 className={styles.heading}>Analyst Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.articleListContainer}>
        <h2 className={styles.subHeading}>Moderated Articles</h2>
        {articles.length === 0 ? (
          <p className={styles.noArticles}>No articles available for analysis.</p>
        ) : (
          <ul className={styles.articleList}>
            {articles.map((article) => (
              <li
                key={article._id}
                className={`${styles.articleItem} ${
                  selectedArticle && selectedArticle._id === article._id ? styles.selected : ''
                }`}
                onClick={() => handleSelectArticle(article)}
              >
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p><strong>Authors:</strong> {article.authors}</p>
                <p><strong>Journal:</strong> {article.journalName}</p>
                <p><strong>Year:</strong> {article.publicationYear}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedArticle && (
        <div className={styles.formContainer}>
          <h2 className={styles.subHeading}>Edit Article Information</h2>
          <div className={styles.claimInfo}>
            <p><strong>Title:</strong> {selectedArticle.title}</p>
            <p><strong>Authors:</strong> {selectedArticle.authors}</p>
            <p><strong>Journal:</strong> {selectedArticle.journalName}</p>
            <p><strong>Publication Year:</strong> {selectedArticle.publicationYear}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Evidence Claim Field */}
            <div className={styles.formGroup}>
              <label htmlFor="evidenceClaim">Evidence Claim</label>
              <textarea
                id="evidenceClaim"
                name="evidenceClaim"
                value={formData.evidenceClaim}
                onChange={handleChange}
                className={styles.textAreaInput} /* Use the class name */
                required
              ></textarea>
            </div>

            {/* Evidence Result Field */}
            <div className={styles.formGroup}>
              <label htmlFor="evidenceResult">Evidence Result</label>
              <select
                id="evidenceResult"
                name="evidenceResult"
                value={formData.evidenceResult}
                onChange={handleChange}
                className={styles.selectInput} /* Use a new class name */
                required
              >
                <option value="">Select an option</option>
                <option value="Images">Images</option>
                <option value="Files">Files</option>
                {/* Add more options as needed */}
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className={styles.submitButton}>
              Update Article
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AnalystClaim;