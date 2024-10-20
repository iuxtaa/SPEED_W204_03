import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styles from "../styles/Home.module.css";

const IndexPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Splitting the name into first and last name assuming format "FirstName LastName"
  const username = session?.user?.name || "User";
  const [firstname, lastname] = username.split(" "); // This will work if name is "FirstName LastName"

  return (
      <div className={styles.container}>
        {/* Navigation Bar */}
        <header className={styles.header}>
          <nav className={styles.navbar}>
            <div className={styles.logo}>SPEED</div>
            <ul className={styles.navLinks}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/AnalystDashboard">Analyst Claim</Link>
              </li>
              <li>
                <Link href="/Moderator">Moderator Dashboard</Link>
              </li>
              <li>
                <Link href="/submission">Submit New</Link>
              </li>
              <li>
                <Link href="/admin">Admin Article Edit</Link>
              </li>
              <li>
                <Link href="/users">Admin User Edit</Link>
              </li>
              <li>
                <Link href="/Bibtex">Submit Article as Bibtex</Link>
              </li>
              <li>
                <Link href="/rejectedarticle">Rejected Articles</Link>
              </li>
              <li>
                <Link href="/SearchArticles">Search Analysed Articles</Link>
              </li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          <section className={styles.introduction}>
            {/* Personalized Welcome Message */}
            {status === "authenticated" ? (
              <h1 className={styles.welcomeMessage}>
                Welcome back, {firstname} {lastname}!
              </h1>
            ) : (
              <h1 className={styles.welcomeMessage}>Welcome to SPEED</h1>
            )}
            <p>
              The{" "}
              <strong>
                Scientific Publication Evidence Extraction Database (SPEED)
              </strong>{" "}
              is your all-in-one platform for extracting, managing, and
              analyzing evidence from scientific publications. Whether
              you&apos;re a researcher, analyst, or enthusiast, SPEED
              streamlines the process of gathering data, making it easier to
              collaborate and share insights.
            </p>
            <p>
              Explore our tools designed to enhance your research workflow, from
              automated data extraction to real-time collaboration features.
              Join our community and accelerate your research today!
            </p>
          </section>
        </main>
      </div>
  );
};

export default IndexPage;
