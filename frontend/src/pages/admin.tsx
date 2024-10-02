import React, { useState, useEffect } from 'react';
import styles from '../styles/adminForm.module.css'; // Adjust the path as necessary

interface User {
    id: number;
    name: string;
    status: string;
}

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'User One', status: 'Active' },
        { id: 2, name: 'User Two', status: 'Inactive' },
        { id: 3, name: 'User Three', status: 'Pending' },
        { id: 4, name: 'User Four', status: 'Active' }
    ]);

    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.adminHeader}>SPEED</h1>
            <table className={styles.adminTable}>
                <thead className={styles.adminTableThead}>
                    <tr>
                        <th className={styles.adminTableTh}>Users</th>
                        <th className={styles.adminTableTh}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className={styles.adminTableTbodyTrOdd}>
                            <td className={styles.adminTableTd}>{user.name}</td>
                            <td className={styles.adminTableTd}>{user.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
