import React, { useState } from 'react';
import styles from '../styles/SubmitArticlePage.module.css';

const SubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    journalName: '',
    publicationYear: '',
    volume: '',
    number: '',
    pages: '',
    doi: '',
    email: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.journalName) newErrors.journalName = 'Journal Name is required';
    if (!formData.publicationYear) newErrors.publicationYear = 'Publication Year is required';
    if (!formData.doi) newErrors.doi = 'DOI is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear errors on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      title: formData.title,
      author: formData.author,
      journalName: formData.journalName,
      publicationYear: Number(formData.publicationYear),
      volume: formData.volume ? Number(formData.volume) : undefined,
      number: formData.number ? Number(formData.number) : undefined,
      pages: formData.pages || undefined,
      doi: formData.doi,
      email: formData.email,
    };

    try {
      const response = await fetch('http://localhost:8082/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Article submitted successfully:', responseData);
        setSuccessMessage('Article submitted successfully!');
        // Reset form fields
        setFormData({
          title: '',
          author: '',
          journalName: '',
          publicationYear: '',
          volume: '',
          number: '',
          pages: '',
          doi: '',
          email: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Error submitting article:', errorData);
        setErrors({ api: 'Failed to submit article. Please try again later.' });
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      setErrors({ api: 'Failed to submit article. Please try again later.' });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Submit Article</h1>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errors.api && <p style={{ color: 'red' }}>{errors.api}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Title */}
        <div className={styles.formGroup}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
        </div>

        {/* Author */}
        <div className={styles.formGroup}>
          <label>Author:</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && <span style={{ color: 'red' }}>{errors.author}</span>}
        </div>

        {/* Journal Name */}
        <div className={styles.formGroup}>
          <label>Journal Name:</label>
          <input
            type="text"
            name="journalName"
            value={formData.journalName}
            onChange={handleChange}
          />
          {errors.journalName && (
            <span style={{ color: 'red' }}>{errors.journalName}</span>
          )}
        </div>

        {/* Publication Year */}
        <div className={styles.formGroup}>
          <label>Publication Year:</label>
          <input
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
          />
          {errors.publicationYear && (
            <span style={{ color: 'red' }}>{errors.publicationYear}</span>
          )}
        </div>

        {/* Volume (Optional) */}
        <div className={styles.formGroup}>
          <label>Volume (optional):</label>
          <input
            type="number"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
          />
        </div>

        {/* Number (Optional) */}
        <div className={styles.formGroup}>
          <label>Number (optional):</label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>

        {/* Pages (Optional) */}
        <div className={styles.formGroup}>
          <label>Pages (optional):</label>
          <input
            type="text"
            name="pages"
            value={formData.pages}
            onChange={handleChange}
          />
        </div>

        {/* DOI */}
        <div className={styles.formGroup}>
          <label>DOI:</label>
          <input
            type="text"
            name="doi"
            value={formData.doi}
            onChange={handleChange}
          />
          {errors.doi && <span style={{ color: 'red' }}>{errors.doi}</span>}
        </div>

        {/* Email */}
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>
          Submit Article
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;
