import React, { useState, useEffect } from 'react';
import styles from '../styles/ArticleSearch.module.css'; // Create and link the CSS file for styling

interface Article {
  id: number;
  title: string;
  authors: string;
  source: string;
  publicationYear: number;
  doi: string;
  rating: number;
  status: string;
  analysisDetails?: string;
}

const ArticleResearch: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for keyword search
  const [filterYear, setFilterYear] = useState<string>(''); // State for publication year filter
  const [minRating, setMinRating] = useState<string>(''); // State for minimum rating filter
  const [statusFilter, setStatusFilter] = useState<string>(''); // State for status filter
  const [error, setError] = useState<string>('');

  // Fetch analyzed and moderated articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/articles/analyzed-moderated');
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
          setFilteredArticles(data); // Initialize filtered articles
        } else {
          setError('Failed to fetch articles.');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Error fetching articles.');
      }
    };

    fetchArticles();
  }, []);

  // Handle keyword search
  useEffect(() => {
    filterArticles();
  }, [searchQuery, filterYear, minRating, statusFilter]);

  // Filter articles based on search and filter criteria
  const filterArticles = () => {
    let filtered = articles;

    // Filter by keyword search
    if (searchQuery) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.doi.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by publication year
    if (filterYear) {
      filtered = filtered.filter((article) =>
        article.publicationYear.toString().includes(filterYear)
      );
    }

    // Filter by minimum rating
    if (minRating) {
      filtered = filtered.filter((article) => article.rating >= parseFloat(minRating));
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((article) => article.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredArticles(filtered);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Article Research and Analysis</h1>

      {/* Search and Filter Section */}
      <div className={styles.filterSection}>
        {/* Keyword Search */}
        <div className={styles.filterGroup}>
          <label>Keyword Search:</label>
          <input
            type="text"
            placeholder="Search by title, authors, source, or DOI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBox}
          />
        </div>

        {/* Publication Year Filter */}
        <div className={styles.filterGroup}>
          <label>Publication Year:</label>
          <input
            type="number"
            placeholder="e.g., 2023"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        {/* Minimum Rating Filter */}
        <div className={styles.filterGroup}>
          <label>Minimum Rating:</label>
          <input
            type="number"
            placeholder="e.g., 4"
            min="1"
            max="5"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className={styles.filterInput}
          />
        </div>

        {/* Status Filter */}
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterInput}
          >
            <option value="">All</option>
            <option value="Analyzed">Analyzed</option>
            <option value="Moderated">Moderated</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Articles Table */}
      {filteredArticles.length === 0 ? (
        <p className={styles.noArticles}>No articles found matching your criteria.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Authors</th>
              <th>Source</th>
              <th>Publication Year</th>
              <th>DOI</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Analysis Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.authors}</td>
                <td>{article.source}</td>
                <td>{article.publicationYear}</td>
                <td>{article.doi}</td>
                <td>{article.rating}</td>
                <td>{article.status}</td>
                <td>{article.analysisDetails ? article.analysisDetails : 'No details available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArticleResearch;
