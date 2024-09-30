
// src/pages/index.tsx
import Layout from '../app/layout';
import styles from '../styles/Home.module.css';  // Ensure you have this CSS module file

import React from 'react';
import Link from 'next/link';
import Layout from '../app/layout';
import styles from '../styles/Home.module.css'; 


export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>SPEED</h1>
          <select className={styles.dropdown}>
            <option value="article1">Article 1</option>
            <option value="article2">Article 2</option>
            <option value="article3">Article 3</option>
          </select>
        </header>
        <div className={styles.mainContent}>
          <div className={styles.introduction}>
            <h1>Introduction</h1>
            <p>This section provides an introduction to the SPEED app.</p>
          </div>
          <div className={styles.notifications}>
            <h1>Notifications Dashboard</h1>
            <ul>

              <li>Notification 1</li>
              <li>Notification 2</li>
              <li>Notification 3</li>

              {/* Notification items would go here */}

            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
