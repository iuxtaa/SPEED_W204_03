import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/ArticleSearch.module.css";

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
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [error, setError] = useState<string>("");

  const fetchFilteredArticles = useCallback(async () => {
    try {
      const queryParts = [];
      if (searchQuery) {
        queryParts.push(`title=${encodeURIComponent(searchQuery)}`);
        queryParts.push(`author=${encodeURIComponent(searchQuery)}`);
        queryParts.push(`journalName=${encodeURIComponent(searchQuery)}`);
        queryParts.push(`doi=${encodeURIComponent(searchQuery)}`);
      }
      if (filterYear) {
        queryParts.push(`publicationYear=${encodeURIComponent(filterYear)}`);
      }
      queryParts.push(`sortBy=${encodeURIComponent("high rating")}`);

      const queryString = queryParts.join("&");
      const response = await fetch(
        `http://localhost:8082/api/articles/search-article?${queryString}`
      );
      if (response.ok) {
        const data = await response.json();
        setFilteredArticles(data);
      } else {
        setError("Failed to fetch articles.");
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      setError("Error fetching articles.");
    }
  }, [searchQuery, filterYear]);

  useEffect(() => {
    fetchFilteredArticles();
  }, [fetchFilteredArticles]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Article Research and Analysis</h1>
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>Keyword Search:</label>
          <input
            type="text"
            placeholder="Search by title, authors, journal, or DOI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBox}
          />
        </div>

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
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {filteredArticles.length === 0 ? (
        <p className={styles.noArticles}>
          No articles found matching your criteria.
        </p>
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
                <td>
                  {article.analysisDetails
                    ? article.analysisDetails
                    : "No details available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArticleResearch;
