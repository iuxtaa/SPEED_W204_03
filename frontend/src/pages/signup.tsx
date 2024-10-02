import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/SignupForm.module.css';

interface SignupInputs {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ErrorMessages {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const SignupPage = () => {
    const router = useRouter();
    const [inputs, setInputs] = useState<SignupInputs>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<ErrorMessages>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validatePassword = (password: string, confirmPassword: string): boolean => {
        if (password !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
            return false;
        }
        const strongPasswordRegex = new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$"
        );
        if (!strongPasswordRegex.test(password)) {
            setErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.' }));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        console.log("Form submitted");
        e.preventDefault();
        const newErrors = { ...errors };
        (Object.keys(inputs) as (keyof SignupInputs)[]).forEach(key => {
            if (!inputs[key]) {
                newErrors[key] = 'This field is required.';
            }
        });
        setErrors(newErrors);
        if (Object.values(newErrors).some(error => error !== '')) {
            return;
        }
        if (!validatePassword(inputs.password, inputs.confirmPassword)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8082/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs)
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }
            const data = await response.json();
            console.log('Success:', data);
            router.push('/');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
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
                    {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className={styles.inputField}
                        value={inputs.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className={styles.inputField}
                        value={inputs.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className={styles.error}>{errors.username}</p>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className={styles.inputField}
                        value={inputs.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
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
                    {errors.password && <p className={styles.error}>{errors.password}</p>}
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className={styles.inputPassword}
                        value={inputs.confirmPassword}
                        onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
                    <button type="submit" className={styles.signupButton}>
                        Sign Up
                    </button>
                </form>
                <p className={styles.loginPrompt}>
                    Already have an account? <Link href="/"><a>Log In</a></Link>
                </p>
            </main>
        </div>
    );
};

export default SignupPage;
