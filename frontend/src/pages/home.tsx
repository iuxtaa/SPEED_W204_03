// pages/home.tsx

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import NotificationItem from '../components/NotificationItem';

type Notification = {
  id: number;
  message: string;
};

const Home: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Redirect to login page if not logged in
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data: Notification[] = await new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              { id: 1, message: 'Your article "Understanding React" has been approved.' },
              { id: 2, message: 'New comment on your post "Advanced TypeScript".' },
              { id: 3, message: 'Reminder: Complete your profile setup.' },
            ]),
          1000
        )
      );
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('username'); // Clear the username from localStorage
    router.push('/'); // Redirect to login page
  };

  return (
    <Layout>
      <div className={styles.container}>
        {/* Navigation Bar */}
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
              <li>
                <Link href="/Submission">Submit New</Link>
              </li>
              <li>
                <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <section className={styles.introduction}>
            {/* Personalized Welcome Message */}
            {username ? (
              <h1 className={styles.welcomeMessage}>Welcome back, {username}!</h1>
            ) : (
              <h1 className={styles.welcomeMessage}>Welcome to SPEED</h1>
            )}
            <p>
              The <strong>Scientific Publication Evidence Extraction Database (SPEED)</strong> is your all-in-one platform for extracting, managing, and analyzing evidence from scientific publications. Whether you&#39;re a researcher, analyst, or enthusiast, SPEED streamlines the process of gathering data, making it easier to collaborate and share insights.
            </p>
            <p>
              Explore our tools designed to enhance your research workflow, from automated data extraction to real-time collaboration features. Join our community and accelerate your research today!
            </p>
            {/* Updated Button */}
            <button className={styles.ctaButton} onClick={() => router.push('/signup')}>
              Get Started
            </button>
          </section>

          {/* Notifications Section */}
          <section className={styles.notifications}>
            <h2>Notifications Dashboard</h2>
            {notifications.length === 0 ? (
              <p>Loading notifications...</p>
            ) : (
              <ul className={styles.notificationList}>
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} message={notification.message} />
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
