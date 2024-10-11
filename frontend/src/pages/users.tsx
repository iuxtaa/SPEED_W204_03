import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Users.module.css";

type User = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: string;
};

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [addingUser, setAddingUser] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [formData, setFormData] = useState<User>({
    _id: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/users");
      if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users: " + error.message);
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setPasswordVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddNewUser = async () => {
    if (!addingUser) {
      setAddingUser(true);
      setFormData({
        _id: "",
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        role: "",
      });
    } else {
      try {
        const response = await fetch(
          "http://localhost:8082/api/users/create-user",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to create user");
        }
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setAddingUser(false);
      } catch (error: any) {
        setError("Failed to add user: " + error.message);
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user._id);
    setFormData(user);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8082/api/users/update-user/${formData._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedUser = await response.json();
      setUsers(
        users.map((user) => (user._id === formData._id ? updatedUser : user))
      );
      setEditingUserId(null);
    } catch (error: any) {
      setError("Failed to update user: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers(users.filter((user) => user._id !== id));
    } catch (error: any) {
      setError("Failed to delete user: " + error.message);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin User Management</title>
      </Head>
      <h1>Admin User Management</h1>
      {error && <p className={styles.error}>{error}</p>}
      <button onClick={handleAddNewUser}>Add New User</button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addingUser && (
            <tr>
              <td>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </td>
              <td>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </td>
              <td>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="admin">Admin</option>
                  <option value="analyst">Analyst</option>
                  <option value="moderator">Moderator</option>
                  <option value="researcher">Researcher</option>
                </select>
              </td>
              <td>
                <button onClick={handleAddNewUser}>Save</button>
                <button onClick={() => setAddingUser(false)}>Cancel</button>
              </td>
            </tr>
          )}
          {users.map((user) => (
            <tr key={user._id}>
              {editingUserId === user._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="analyst">Analyst</option>
                      <option value="moderator">Moderator</option>
                      <option value="researcher">Researcher</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setEditingUserId(null)}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    {passwordVisibility[user._id] ? user.password : "********"}
                    <button
                      onClick={() => togglePasswordVisibility(user._id)}
                      style={{ marginLeft: "10px" }}
                    >
                      {passwordVisibility[user._id] ? "Hide" : "Show"}
                    </button>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersPage;
