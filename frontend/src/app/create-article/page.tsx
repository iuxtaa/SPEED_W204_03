// src/pages/CreateArticle/page.tsx

import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles/SubmitArticlePage.module.css";

// Define the structure for the form state
type ArticleFormState = {
  title: string;
  authors: string[];
  source: string;
  publicationYear: string;
  doi: string;
  summary: string;
};

const SubmitArticlePage: React.FC = () => {
  const navigate = useRouter(); // Use useRouter for navigation
  const [formData, setFormData] = useState<ArticleFormState>({
    title: "",
    authors: [""],
    source: "",
    publicationYear: "",
    doi: "",
    summary: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Submit");

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;

    if (name === "authors" && typeof index === "number") {
      const newAuthors = [...formData.authors];
      newAuthors[index] = value;
      setFormData({ ...formData, authors: newAuthors });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Add a new author field
  const addAuthor = () => {
    setFormData({ ...formData, authors: [...formData.authors, ""] });
  };

  // Remove an author field
  const removeAuthor = (index: number) => {
    const newAuthors = formData.authors.filter((_, i) => i !== index);
    setFormData({ ...formData, authors: newAuthors });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const payload = {
      title: formData.title,
      author: formData.authors.join(", "),
      journalName: formData.source,
      publicationYear: parseInt(formData.publicationYear, 10),
      doi: formData.doi,
      summary: formData.summary,
    };

    try {
      const response = await fetch("http://localhost:8082/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Submission Success:", result);

      // Update success message and button state
      setSuccessMessage("Article submitted successfully!");
      setButtonText("Submitted");
      setFormData({
        title: "",
        authors: [""],
        source: "",
        publicationYear: "",
        doi: "",
        summary: "",
      });

      // Navigate to the home page after submission
      navigate.push("/");
    } catch (err) {
      setError("Failed to submit the article. Please try again.");
      console.error("Submission Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="CreateArticle">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <br />
              <Link href="/" className="btn btn-outline-warning float-left">
                Show Article List
              </Link>
            </div>
            <div className="col-md-10 m-auto">
              <h1 className="display-4 text-center">Submit Article</h1>
              <p className="lead text-center">Create new article submission</p>
              <form noValidate onSubmit={handleSubmit}>
                {/* Title Field */}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Title of the Article"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <br />

                {/* Authors Field */}
                <div className="form-group">
                  <label>Authors</label>
                  {formData.authors.map((author, index) => (
                    <div key={index} className={styles.authorInput}>
                      <input
                        type="text"
                        name="authors"
                        className="form-control"
                        value={author}
                        onChange={(e) => handleChange(e, index)}
                        required
                      />
                      <div className={styles.authorButtons}>
                        {formData.authors.length > 1 && (
                          <button type="button" onClick={() => removeAuthor(index)} className={styles.removeButton}>
                            -
                          </button>
                        )}
                        {index === formData.authors.length - 1 && (
                          <button type="button" onClick={addAuthor} className={styles.addButton}>
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <br />

                {/* Source Field */}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Source"
                    name="source"
                    className="form-control"
                    value={formData.source}
                    onChange={handleChange}
                  />
                </div>
                <br />

                {/* Publication Year Field */}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Publication Year"
                    name="publicationYear"
                    className="form-control"
                    value={formData.publicationYear}
                    onChange={handleChange}
                  />
                </div>
                <br />

                {/* DOI Field */}
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="DOI"
                    name="doi"
                    className="form-control"
                    value={formData.doi}
                    onChange={handleChange}
                  />
                </div>
                <br />

                {/* Summary Field */}
                <div className="form-group">
                  <textarea
                    placeholder="Summary of the Article"
                    name="summary"
                    className="form-control"
                    value={formData.summary}
                    onChange={handleChange}
                  />
                </div>
                <br />

                {/* Submit Button */}
                <button type="submit" className="btn btn-outline-warning btn-block mt-4 mb-4 w-100" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : buttonText}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitArticlePage;
