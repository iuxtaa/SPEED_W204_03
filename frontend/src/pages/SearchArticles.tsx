import React, { useState, useEffect } from "react";
import styles from "../styles/SearchArticles.module.css";

interface Article {
  title: string;
  author: string;
  journalName: string;
  publicationYear: number | null;
  volume: number | null;
  number: number | null;
  pages: string;
  doi: string;
  evidence?: string;
  claim?: string;
  rating?: number;
  seMethod?: string;
}

const SearchArticles = () => {
  const [searchParams, setSearchParams] = useState({
    title: "",
    author: "",
    journalName: "",
    publicationYear: null,
    volume: null,
    number: null,
    pages: "",
    doi: "",
    evidence: "",
    claim: "",
    seMethod: "",
    sortBy: "",
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState("");

  // Fetch all articles initially and on every search
  const fetchArticles = async (params?: URLSearchParams) => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/articles/search-article?${
          params ? params.toString() : ""
        }`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        setError("");
      } else {
        throw new Error(
          "Failed to fetch articles: Server responded with an error"
        );
      }
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    // Fetch all articles on mount
    fetchArticles();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Specific check for numeric values
    if (["publicationYear", "volume", "number"].includes(name)) {
      if (value === "") {
        setSearchParams((prev) => ({ ...prev, [name]: null }));
      } else if (/^\d+$/.test(value)) {
        setSearchParams((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
      }
    } else {
      setSearchParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryParameters = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        queryParameters.append(key, value.toString());
      }
    });

    fetchArticles(queryParameters);
  };

return (
  <div className={styles.container}>
    <form onSubmit={handleSearch} className={styles.filterSection}>
      {/* Grouping title and author */}
      <div className={styles.filterGroup}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={searchParams.title}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={searchParams.author}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Grouping journal name and publication year */}
      <div className={styles.filterGroup}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="journalName"
            placeholder="Journal Name"
            value={searchParams.journalName}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            name="publicationYear"
            placeholder="Publication Year"
            value={searchParams.publicationYear ?? ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Grouping volume and number */}
      <div className={styles.filterGroup}>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            name="volume"
            placeholder="Volume"
            value={searchParams.volume ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            name="number"
            placeholder="Issue Number"
            value={searchParams.number ?? ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Grouping pages, DOI, and SE Method */}
      <div className={styles.filterGroup}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="pages"
            placeholder="Pages"
            value={searchParams.pages}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="doi"
            placeholder="DOI"
            value={searchParams.doi}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="seMethod"
            placeholder="SE Method"
            value={searchParams.seMethod}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Grouping evidence and claim */}
      <div className={styles.filterGroup}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="evidence"
            placeholder="Evidence"
            value={searchParams.evidence}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            name="claim"
            placeholder="Claim"
            value={searchParams.claim}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Sort By dropdown */}
      <div className={styles.inputWrapper}>
        <select
          name="sortBy"
          value={searchParams.sortBy}
          onChange={handleInputChange}
        >
          <option value="">Select Sort Option</option>
          <option value="low rating">Low Rating</option>
          <option value="high rating">High Rating</option>
        </select>
      </div>

      <button type="submit">Search</button>
    </form>
    {error && <p className={styles.error}>{error}</p>}
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Journal</th>
          <th>Volume</th>
          <th>Number</th>
          <th>Pages</th>
          <th>DOI</th>
          <th>Publication Year</th>
          <th>Evidence</th>
          <th>Claim</th>
          <th>Rating</th>
          <th>SE Method</th> {/* Added SE Method column header */}
        </tr>
      </thead>
      <tbody>
        {articles.map((article, index) => (
          <tr key={index}>
            <td>{article.title}</td>
            <td>{article.author}</td>
            <td>{article.journalName}</td>
            <td>{article.volume}</td>
            <td>{article.number}</td>
            <td>{article.pages}</td>
            <td>{article.doi}</td>
            <td>{article.publicationYear}</td>
            <td>{article.evidence}</td>
            <td>{article.claim}</td>
            <td>{article.rating ?? "N/A"}</td>
            <td>{article.seMethod ?? "N/A"}</td> {/* Displaying SE Method */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

};

export default SearchArticles;
