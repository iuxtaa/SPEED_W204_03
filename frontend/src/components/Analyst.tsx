import React, { useState } from 'react';
import styles from '../styles/Analyst.module.css';

type Article = {
  _id: string;
  title: string;
  authors: string;
  journalName: string;
  publicationYear: number;
  evidenceClaim?: string;
  evidenceResult?: string;
};

type AnalystProps = {
  article: Article;
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
};

const Analyst: React.FC<AnalystProps> = ({ article, setArticles }) => {
  const [formData, setFormData] = useState({
    evidenceClaim: article.evidenceClaim || '',
    evidenceResult: article.evidenceResult || '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8082/api/articles/${article._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedArticle = await response.json();
        setArticles((prevArticles) =>
          prevArticles.map((art) => (art._id === updatedArticle._id ? updatedArticle : art))
        );
        alert('Article updated successfully!');
      } else {
        setError('Failed to update article');
      }
    } catch (error) {
      setError('Failed to update article');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.subHeading}>Edit Article Information</h2>
      <div className={styles.claimInfo}>
        <p><strong>Title:</strong> {article.title}</p>
        <p><strong>Authors:</strong> {article.authors}</p>
        <p><strong>Journal:</strong> {article.journalName}</p>
        <p><strong>Publication Year:</strong> {article.publicationYear}</p>
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

        <button type="submit" className={styles.submitButton}>
          Update Article
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Analyst;
