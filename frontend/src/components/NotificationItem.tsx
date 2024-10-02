import React from 'react';
import styles from '../styles/NotificationItem.module.css';

interface NotificationItemProps {
  message: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ message }) => {
  return (
    <li className={styles.notificationItem}>
      <p>{message}</p>
    </li>
  );
};

export default NotificationItem;