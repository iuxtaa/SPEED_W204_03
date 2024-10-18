import React, { useState } from 'react';
import styles from '../styles/SubmitArticlePage.module.css';

interface Article {
  title: string;
  author: string;
  journalName: string;
  publicationYear: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi: string;
  email: string;
  // Include other fields as needed
}

const Submission: React.FC = () => {
  const [formData, setFormData] = useState<Article>({
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

  const [bibtexFile, setBibtexFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.journalName) newErrors.journalName = 'Journal Name is required';
    if (!formData.publicationYear)
      newErrors.publicationYear = 'Publication Year is required';
    if (!formData.doi) newErrors.doi = 'DOI is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear errors on change
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBibtexFile(e.target.files[0]);
      setErrors({ ...errors, bibtexFile: '' }); // Clear errors on change
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('email', formData.email);
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('journalName', formData.journalName);
    data.append('publicationYear', formData.publicationYear);
    if (formData.volume) data.append('volume', formData.volume);
    if (formData.number) data.append('number', formData.number);
    if (formData.pages) data.append('pages', formData.pages);
    data.append('doi', formData.doi);
  
    if (bibtexFile) {
      data.append('bibtexFile', bibtexFile); // Append the file
    } else {
      console.log('No BibTeX file uploaded');
    }
  
    try {
      const response = await fetch('http://localhost:8082/api/articles/upload-bibtex', {
        method: 'POST',
        body: data, // Send the FormData object
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit article: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Article submitted successfully:', result);
      setSuccessMessage('Article submitted successfully!');
      // Optionally, reset form fields here if necessary
    } catch (error) {
      console.error('Error submitting article:', error);
      setErrors({ api: 'Failed to submit article. Please try again later.' });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Submit Article via BibTeX</h1>
      {errors.api && <p style={{ color: 'red' }}>{errors.api}</p>}
      {successMessage && (
        <div className={styles.successMessage}>
          <p>{successMessage}</p>
        </div>
      )}
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
            type="text"
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
            type="text"
            name="volume"
            value={formData.volume}
            onChange={handleChange}
          />
        </div>

        {/* Number (Optional) */}
        <div className={styles.formGroup}>
          <label>Number (optional):</label>
          <input
            type="text"
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

        {/* Upload BibTeX File */}
        <div className={styles.formGroup}>
          <label>Upload BibTeX File (optional):</label>
          <input
            type="file"
            name="bibtexFile"
            accept=".bib"
            onChange={handleFileChange}
          />
          {errors.bibtexFile && (
            <span style={{ color: 'red' }}>{errors.bibtexFile}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.submitButton}>
          Submit Article
        </button>
      </form>
    </div>
  );
};

export default Submission;
