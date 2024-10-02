import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from next/router
import styles from '../styles/SignupForm.module.css'; // Update the path according to your file structure
import Link from 'next/link';

type SignupFormState = {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const initialState: SignupFormState = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

const Signup = () => {
  const [formState, setFormState] = useState<SignupFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Use the useRouter hook to get access to the router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.password !== formState.passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8082/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState)
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(errorResponse);
      }

      await response.json(); // We assume signup is successful if no error is thrown
      router.push('/homepage'); // Redirect to homepage after successful signup
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Failed to signup. Please check your details and try again.');
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h1>Signup</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <label className={styles.label}>First Name:</label>
        <input type="text" name="firstname" className={styles.inputField} value={formState.firstname} onChange={handleChange} required />

        <label className={styles.label}>Last Name:</label>
        <input type="text" name="lastname" className={styles.inputField} value={formState.lastname} onChange={handleChange} required />

        <label className={styles.label}>Username:</label>
        <input type="text" name="username" className={styles.inputField} value={formState.username} onChange={handleChange} required />

        <label className={styles.label}>Email:</label>
        <input type="email" name="email" className={styles.inputField} value={formState.email} onChange={handleChange} required />

        <p className={styles.passwordRequirements}>Password must contain at least one uppercase, one lowercase, one special character, and be 8 characters long.</p>
        <label className={styles.label}>Password:</label>
        <input type="password" name="password" className={styles.inputField} value={formState.password} onChange={handleChange} required />

        <label className={styles.label}>Confirm Password:</label>
        <input type="password" name="passwordConfirmation" className={styles.inputField} value={formState.passwordConfirmation} onChange={handleChange} required />

        <button type="submit" className={styles.signupButton}>Signup</button>
      </form>
      <p className={styles.loginLink}>
      Already have an account? 
      <Link href="/"><a style={{ color: 'red' }}>Login</a></Link>
    </p>
    </div>
  );
};

export default Signup;
