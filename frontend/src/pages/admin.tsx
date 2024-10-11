import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/adminForm.module.css";
import { useRouter } from "next/router";


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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Article | null>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {

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

  const handleEditClick = (article: Article) => {
    setEditingId(article._id);
    setEditFormData(article);
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  const handleSaveClick = async () => {
    if (!editFormData) return;

    try {
      const response = await fetch(
        `http://localhost:8082/api/articles/${editingId}/details`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (response.ok) {
        const updatedArticles = articles.map((article) =>
          article._id === editingId ? ({ ...editFormData } as Article) : article
        );
        setArticles(updatedArticles);
        setEditingId(null);
        alert("Article updated successfully!");
      } else {
        setError("Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      setError("Failed to update article");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editFormData) {
      setEditFormData({ ...editFormData, [name]: value });
    }

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
      <h1 className={styles.heading}>Admin&apos;s Article Dashboard</h1>

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
                {editingId === article._id ? (
                  <React.Fragment>
                    <td>
                      <input
                        type="text"
                        name="title"
                        value={editFormData?.title}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="author"
                        value={editFormData?.author}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="journalName"
                        value={editFormData?.journalName}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="publicationYear"
                        value={editFormData?.publicationYear}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="doi"
                        value={editFormData?.doi}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={editFormData?.email}
                        onChange={handleFormChange}
                      />
                    </td>
                    <td>
                      <button onClick={handleSaveClick}>Save</button>
                      <button onClick={handleCancelClick}>Cancel</button>
                    </td>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <td>{article.title}</td>
                    <td>{article.author}</td>
                    <td>{article.journalName}</td>
                    <td>{article.publicationYear}</td>
                    <td>{article.doi}</td>
                    <td>{article.email}</td>
                    <td>
                      <button onClick={() => handleEditClick(article)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(article._id)}>
                        Delete
                      </button>
                    </td>
                  </React.Fragment>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
