import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/AnalystDashboard.module.css';

type Article = {
  _id: string;
  title: string;
  authors: string;
  journalName: string;
  publicationYear: number;
  evidenceClaim?: string;
  evidenceResult?: string;
  methodology?: string;
};

const AnalystDashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    evidenceClaim: '',
    evidenceResult: '',
    methodology: '',
  });
  const [error, setError] = useState<string>('');

  // Fetch moderated articles from the backend
  useEffect(() => {
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

  // Handle selecting an article to view and edit its information
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      evidenceClaim: article.evidenceClaim || '',
      evidenceResult: article.evidenceResult || '',
      methodology: article.methodology || '',
    });
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to update article information
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    // Add 'Analysed' status and 'approved' flag before updating the article
    const updatedFormData = {
      ...formData,
      status: 'Analysed', // Mark the status as Analysed
      approved: true,     // Approve the article
    };

    try {
      const response = await fetch(
        `http://localhost:8082/api/articles/analyse/${selectedArticle._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (response.ok) {
        const updatedArticle = await response.json();
        // Update the list of articles with the newly updated article
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === updatedArticle._id ? updatedArticle : article
          )
        );
        alert('Article updated successfully!');
        setError(''); // Clear any previous errors
      } else {
        const errorText = await response.text();
        console.error('Failed to update article:', errorText);
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

      {/* Main layout container */}
      <div className={styles.mainContent}>
        {/* Sidebar for the list of moderated articles */}
        <div className={styles.sidebar}>
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
                  <p className={styles.articleInfo}>
                    <strong>Authors:</strong> {article.authors}
                  </p>
                  <p className={styles.articleInfo}>
                    <strong>Journal:</strong> {article.journalName}
                  </p>
                  <p className={styles.articleInfo}>
                    <strong>Year:</strong> {article.publicationYear}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main content area for editing the selected article's information */}
        {selectedArticle && (
          <div className={styles.formContainer}>
            <h2 className={styles.subHeading}>Edit Article Information</h2>
            <div className={styles.claimInfo}>
              <p>
                <strong>Title:</strong> {selectedArticle.title}
              </p>
              <p>
                <strong>Authors:</strong> {selectedArticle.authors}
              </p>
              <p>
                <strong>Journal:</strong> {selectedArticle.journalName}
              </p>
              <p>
                <strong>Publication Year:</strong> {selectedArticle.publicationYear}
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="evidenceClaim">Evidence Claim</label>
                <textarea
                  id="evidenceClaim"
                  name="evidenceClaim"
                  value={formData.evidenceClaim}
                  onChange={handleChange}
                  className={styles.textAreaInput}
                  required
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="evidenceResult">Evidence Result</label>
                <select
                  id="evidenceResult"
                  name="evidenceResult"
                  value={formData.evidenceResult}
                  onChange={handleChange}
                  className={styles.selectInput}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="Images">Images</option>
                  <option value="Files">Files</option>
                  <option value="Links">Links</option>
                  <option value="Text">Text</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="methodology">Methodology</label>
                <textarea
                  id="methodology"
                  name="methodology"
                  value={formData.methodology}
                  onChange={handleChange}
                  className={styles.textAreaInput}
                  required
                ></textarea>
              </div>

              <button type="submit" className={styles.submitButton}>
                Update Article
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalystDashboard;
