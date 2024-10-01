import React, { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/SignupForm.module.css';

interface SignupInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignupPage = () => {
    const [inputs, setInputs] = useState<SignupInputs>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const validatePassword = (password: string): boolean => {
        return /[A-Z]/.test(password) &&    // Checks for at least one uppercase letter
               /[a-z]/.test(password) &&    // Checks for at least one lowercase letter
               /[!@#$%^&*(),.?":{}|<>]/.test(password) && // Checks for at least one special character
               password.length >= 8;        // Checks for a minimum length of 8 characters
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validatePassword(inputs.password)) {
            alert('Password must contain at least one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.');
            return;
        }
        if (inputs.password !== inputs.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        console.log('Form submitted', inputs);
    };

    return (
        <div>
            <Head>
                <title>Sign Up</title>
                <meta name="description" content="Create an account to use the application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.signupContainer}>
                <h1>Sign Up</h1>
                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className={styles.inputField}
                        value={inputs.firstName}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className={styles.inputField}
                        value={inputs.lastName}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.inputField}
                        value={inputs.email}
                        onChange={handleChange}
                    />
                    <p className={styles.passwordRequirements}>
                        Password must contain at least 1 uppercase, 1 lowercase, 1 special character, and be 8 characters long
                    </p>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className={styles.inputPassword}
                        value={inputs.password}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={styles.inputPassword}
                        value={inputs.confirmPassword}
                        onChange={handleChange}
                    />
                    <button type="submit" className={styles.signupButton}>
                        Sign Up
                    </button>
                </form>
                <p className={styles.loginPrompt}>
                    Already have an account? <Link href="/login"><a>Log In</a></Link>
                </p>
            </main>
        </div>
    );
};

export default SignupPage;
