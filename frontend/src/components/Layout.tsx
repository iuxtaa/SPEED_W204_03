// src/components/Layout.tsx

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>SPEED</div>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/home">Home</Link>
            </li>
            <li>
              <Link href="/AnalystClaim">Analyst Claim</Link>
            </li>
            <li>
              <Link href="/Moderator">Moderator Dashboard</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default Layout;
