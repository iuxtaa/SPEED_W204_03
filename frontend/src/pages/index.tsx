import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/LoginForm.module.css'; // Ensure the path is correct
import Link from 'next/link';


type LoginFormState = {
  username: string;
  password: string;
};

const IndexPage = () => {
  const [formState, setFormState] = useState<LoginFormState>({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter(); // Get the router object

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.username || !formState.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8082/api/users/login', {
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

      const data = await response.json();
      console.log('Login successful:', data);
      // Redirect to the homepage
      router.push('/homepage');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to login. Please check your username and password.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={formState.username} onChange={handleChange} className={styles.inputField} required />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formState.password} onChange={handleChange} className={styles.inputField} required />
        </label>
        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
      <p className={styles.signupLink}>
  Don&apos;t have an account? 
  <Link href="/signup">
    <a style={{ color: 'red' }}>Sign up</a>
  </Link>
</p>
    </div>
  );
};


export default IndexPage;



