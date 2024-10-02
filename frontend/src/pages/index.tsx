import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/index.module.css';

const LoginPage = () => {
    return (
        <div>
            <Head>
                <title>Login Page</title>
                <meta name="description" content="Login to access your account" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.loginContainer}>
                <h1>Login</h1>
                <form className={styles.loginForm}>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.inputField}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.inputPassword}
                    />
                    <button type="submit" className={styles.loginButton}>
                        Log In
                    </button>
                </form>
                <p className={styles.signupPrompt}>
                    Don&apos;t have an account? <Link href="login_signup/signup"><a>Sign Up</a></Link>
                </p>
            </main>
        </div>
    );
};

export default index;