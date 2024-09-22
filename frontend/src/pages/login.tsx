import React, { useState } from 'react';
import styles from '../styles/Login.module.scss';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        // Here you would typically handle your login logic, like making an API call
        console.log('Login Attempt:', username, password);
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputPassword}
                />
                <button type="submit" className={styles.loginButton}>
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
