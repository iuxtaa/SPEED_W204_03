import React, { useState } from "react";

interface Article {
  title: string;
  author: string;
  journalName: string;
  publicationYear: number;
  volume: number;
  number: number;
  pages: string;
  doi: string;
  evidence?: string; // Assuming you have an enum to string mapping on the frontend
  claim?: string;
}

const SearchArticles = () => {
  const [searchParams, setSearchParams] = useState({
    title: "",
    author: "",
    journalName: "",
    publicationYear: "", // This is kept as string for input handling convenience
    volume: "",
    number: "",
    pages: "",
    doi: "",
    evidence: "",
    claim: "",
    sortBy: "",
  });
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Convert numeric inputs appropriately
    const intValue = ["publicationYear", "volume", "number"].includes(name)
      ? parseInt(value) || ""
      : value;
    setSearchParams((prev) => ({ ...prev, [name]: intValue }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryParameters = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== "") {
        queryParameters.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(
        `http://localhost:8082/api/articles/search-article?${queryParameters.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={searchParams.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={searchParams.author}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="journalName"
          placeholder="Journal Name"
          value={searchParams.journalName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="publicationYear"
          placeholder="Publication Year"
          value={searchParams.publicationYear}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="volume"
          placeholder="Volume"
          value={searchParams.volume}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="number"
          placeholder="Issue Number"
          value={searchParams.number}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="pages"
          placeholder="Pages"
          value={searchParams.pages}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="doi"
          placeholder="DOI"
          value={searchParams.doi}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="evidence"
          placeholder="Evidence"
          value={searchParams.evidence}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="claim"
          placeholder="Claim"
          value={searchParams.claim}
          onChange={handleInputChange}
        />
        <select
          name="sortBy"
          value={searchParams.sortBy}
          onChange={handleInputChange}
        >
          <option value="">Select Sort Option</option>
          <option value="low rating">Low Rating</option>
          <option value="high rating">High Rating</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      <div>
        {articles.map((article, index) => (
          <div key={index}>
            <h3>{article.title}</h3>
            <p>Author: {article.author}</p>
            <p>
              Journal: {article.journalName}, Vol. {article.volume}, No.{" "}
              {article.number}, Pages: {article.pages}
            </p>
            <p>DOI: {article.doi}</p>
            <p>Publication Year: {article.publicationYear}</p>
            <p>Evidence: {article.evidence}</p>
            <p>Claim: {article.claim}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchArticles;
