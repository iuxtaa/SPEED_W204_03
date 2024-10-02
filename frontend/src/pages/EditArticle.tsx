import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/EditPage.module.css';

type ArticleFormState = {
  title: string;
  authors: string;
  source: string;
  publicationYear: string;
  doi: string;
  evidenceClaim: string;
  evidenceResult: string;
};

const EditArticlePage: React.FC = () => {
  const [formData, setFormData] = useState<ArticleFormState>({
    title: '',
    authors: '',
    source: '',
    publicationYear: '',
    doi: '',
    evidenceClaim: '',
    evidenceResult: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // Add form submission logic here
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Edit Article</title>
      </Head>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Edit Article</h2>

        {/* Title Field */}
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Authors Field */}
        <div className={styles.formGroup}>
          <label htmlFor="authors">Authors</label>
          <input
            type="text"
            id="authors"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            required
          />
        </div>

        {/* Source Field */}
        <div className={styles.formGroup}>
          <label htmlFor="source">Source</label>
          <input
            type="text"
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
          />
        </div>

        {/* Publication Year Field */}
        <div className={styles.formGroup}>
          <label htmlFor="publicationYear">Publication Year</label>
          <input
            type="text"
            id="publicationYear"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
          />
        </div>

        {/* DOI Field */}
        <div className={styles.formGroup}>
          <label htmlFor="doi">DOI</label>
          <input
            type="text"
            id="doi"
            name="doi"
            value={formData.doi}
            onChange={handleChange}
          />
        </div>

        {/* Evidence Claim Field */}
        <div className={styles.formGroup}>
          <label htmlFor="evidenceClaim">Evidence Claim</label>
          <textarea
            id="evidenceClaim"
            name="evidenceClaim"
            value={formData.evidenceClaim}
            onChange={handleChange}
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
          >
            <option value="">Select an option</option>
            <option value="Images">Images</option>
            <option value="Files">Files</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;