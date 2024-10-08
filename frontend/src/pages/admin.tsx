import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/adminForm.module.css";

type Article = {
  _id: string;
  title: string;
  author: string;
  journalName: string;
  publicationYear: number;
  doi: string;
  email: string;
};

const AdminPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Fetch analyzed articles from the backend
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8082/api/articles/analysed-articles"
        );
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          setError("Failed to fetch analyzed articles");
        }
      } catch (error) {
        console.error("Error fetching analyzed articles:", error);
        setError("Failed to fetch analyzed articles");
      }
    };

    fetchArticles();
  }, []);

  const handleEdit = async (id: string) => {
    // Implementation for redirecting to the edit form
    console.log("Redirect to Edit Article", id);
    // You could use useRouter from Next.js to navigate to the edit page
    // router.push(`/edit-article/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/articles/delete-article-by-id/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setArticles(articles.filter((article) => article._id !== id));
        alert("Article deleted successfully!");
      } else {
        setError("Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      setError("Failed to delete article");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin&apos;s Article Dashboard</title>
      </Head>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}
      {articles.length === 0 ? (
        <p className={styles.noArticles}>No analyzed articles available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Journal</th>
              <th>Year</th>
              <th>DOI</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.author}</td>
                <td>{article.journalName}</td>
                <td>{article.publicationYear}</td>
                <td>{article.doi}</td>
                <td>{article.email}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(article._id)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.rejectButton} // Consider renaming this class to deleteButton for clarity
                    onClick={() => handleDelete(article._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
