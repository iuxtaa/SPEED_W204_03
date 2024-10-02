// import React, { useState } from 'react';
// import Head from 'next/head';
// import styles from '../styles/AnalystClaim.module.css';

// type AnalystClaimProps = {
//   authors: string;
//   source: string;
//   publicationYear: string;
// };

// const AnalystClaim: React.FC<AnalystClaimProps> = () => {
//   // Assuming these values are fetched from a data source or passed via props
//   const authors = 'John Doe, Jane Smith';
//   const source = 'International Journal of Science';
//   const publicationYear = '2023';

//   const [formData, setFormData] = useState({
//     evidenceClaim: '',
//     evidenceResult: '',
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log(formData);
//     // Add form submission logic here
//   };

//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Analyst Claim</title>
//       </Head>
//       <h2 className={styles.heading}>Enter Evidence and Result</h2>
//       <div className={styles.claimInfo}>
//         <p><strong>Authors:</strong> {authors}</p>
//         <p><strong>Source:</strong> {source}</p>
//         <p><strong>Publication Year:</strong> {publicationYear}</p>
//       </div>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         {/* Evidence Claim Field */}
//         <div className={styles.formGroup}>
//           <label htmlFor="evidenceClaim">Evidence Claim</label>
//           <textarea
//             id="evidenceClaim"
//             name="evidenceClaim"
//             value={formData.evidenceClaim}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </div>

//         {/* Evidence Result Field */}
//         <div className={styles.formGroup}>
//           <label htmlFor="evidenceResult">Evidence Result</label>
//           <select
//             id="evidenceResult"
//             name="evidenceResult"
//             value={formData.evidenceResult}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select an option</option>
//             <option value="Images">Images</option>
//             <option value="Files">Files</option>
//             {/* Add more options as needed */}
//           </select>
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className={styles.submitButton}>
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AnalystClaim;
