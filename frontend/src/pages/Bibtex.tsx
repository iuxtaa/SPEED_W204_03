import React, { useState } from "react";

interface UploadResponse {
  message: string;
  savedArticle?: any;
}

const BibTeXUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState<string>("");
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleUpload = async () => {
    if (!file || !email) {
      setError("Please provide both an email and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("bibtexFile", file);
    formData.append("email", email); // Add email as part of the form data

    try {
      const response = await fetch(
        "http://localhost:8082/api/articles/upload-bibtex",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUploadResponse(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || "An error occurred during the upload.");
    }
  };

  return (
    <div>
      <h1>Upload Article with BibTeX File</h1>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter your email"
      />
      <input type="file" onChange={handleFileChange} accept=".bib,.txt" />
      <button onClick={handleUpload}>Upload File</button>
      {uploadResponse && <div>Response: {uploadResponse.message}</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
    </div>
  );
};

export default BibTeXUpload;
