// import React, { useState } from 'react';
// import styles from '../styles/rejected.module.css';

// interface Article {
//     id: number;
//     title: string;
//     status: string;
// }

// const RejectedArticle: React.FC = () => {
//     const [articles, setArticles] = useState<Article[]>([
//         { id: 1, title: 'Example Article One', status: 'Pending' },
//         { id: 2, title: 'Example Article Two', status: 'Reviewed' },
//     ]);

//     return (
//         <div className={styles.container}>
//             <h1>Rejected Articles Review</h1>
//             <table className={styles.table}>
//                 <thead>
//                     <tr>
//                         <th>Rejected Articles</th>
//                         <th>Status</th>
//                         <th>Review Approval</th>
//                         <th>Reject</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {articles.map((article) => (
//                         <tr key={article.id}>
//                             <td>{article.title}</td>
//                             <td>{article.status}</td>
//                             <td>
//                                 <button className={styles.buttonApprove} onClick={() => console.log('Approve', article.id)}>
//                                     Approve
//                                 </button>
//                             </td>
//                             <td>
//                                 <button className={styles.buttonReject} onClick={() => console.log('Reject', article.id)}>
//                                     Reject
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default RejectedArticle;
