import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/EditArticlePage.module.css';

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

        {/* ... rest of the form fields ... */}

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditArticlePage;





