import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from '../styles/SubmitArticlePage.module.css';

type ArticleFormState = {
  title: string;
  authors: string[];
  source: string;
  publicationYear: string;
  doi: string;
  summary: string;
};

const SubmitArticlePage: React.FC = () => {
  const [formData, setFormData] = useState<ArticleFormState>({
    title: '',
    authors: [''],
    source: '',
    publicationYear: '',
    doi: '',
    summary: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState('Submit');

  const router = useRouter(); // Initialize useRouter for navigation

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === 'authors' && typeof index === 'number') {
      const newAuthors = [...formData.authors];
      newAuthors[index] = value;
      setFormData({ ...formData, authors: newAuthors });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addAuthor = () => {
    setFormData({ ...formData, authors: [...formData.authors, ''] });
  };

  const removeAuthor = (index: number) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const payload = {
      title: formData.title,
      author: formData.authors.join(', '), 
      journalName: formData.source,
      publicationYear: parseInt(formData.publicationYear, 10),
      doi: formData.doi,
      summary: formData.summary, 
    };

    try {
      const response = await fetch('http://localhost:8082/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Submission Success:', result);
      
      // Update success message and button state
      setSuccessMessage('Article submitted successfully!');
      setButtonText('Submitted');
      setFormData({
        title: '',
        authors: [''],
        source: '',
        publicationYear: '',
        doi: '',
        summary: '',
      }); 

    
      router.push('/'); 
    } catch (err) {
      setError('Failed to submit the article. Please try again.');
      console.error('Submission Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Submit Article</title>
      </Head>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Submit Article</h2>

        {/* Success and Error Messages */}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}

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
          <label>Authors</label>
          {formData.authors.map((author, index) => (
            <div key={index} className={styles.authorInput}>
              <input
                type="text"
                name="authors"
                value={author}
                onChange={(e) => handleChange(e, index)}
                required
              />
              <div className={styles.authorButtons}>
                {formData.authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(index)}
                    className={styles.removeButton}
                  >
                    -
                  </button>
                )}
                {index === formData.authors.length - 1 && (
                  <button
                    type="button"
                    onClick={addAuthor}
                    className={styles.addButton}
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          ))}
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

        {/* Summary Field */}
        <div className={styles.formGroup}>
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default SubmitArticlePage;

