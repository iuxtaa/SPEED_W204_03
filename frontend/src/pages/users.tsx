import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Users.module.css";

const UserStatus = {
  General: 0, // Adjust these values based on your backend requirements
  Moderator: 1,
  Analyser: 2,
  Administrator: 3,
};

type UserStatusType = keyof typeof UserStatus; // This creates a type that includes all keys of UserStatus as string literals

// Convert enum to array for rendering in select dropdown
const userStatusOptions = Object.keys(UserStatus).map((key) => ({
  label: key,
  value: UserStatus[key as UserStatusType].toString(), // Store the numeric value as a string for the select input
}));


type User = {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  status: string;
  [key: string]: string;
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
    passwordConfirmation: "",
    status: UserStatus.General.toString(),
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
  if (
    !formData.firstname ||
    !formData.lastname ||
    !formData.username ||
    !formData.email ||
    !formData.password ||
    formData.password !== formData.passwordConfirmation
  ) {
    setError("Please fill all fields and ensure passwords match");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:8082/api/users/create-user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: formData.firstname,
          lastname: formData.lastname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          passwordConfirmation: formData.passwordConfirmation,
          status: formData.status,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create user");
    }

    const newUser = await response.json();
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setAddingUser(false);
    setFormData({
      _id: "",
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      status: UserStatus.General.toString(),
    }); // Reset form data
    setError(null); // Clear any errors
  } catch (error : any) {
    console.error("Error creating user:", error);
    setError("Failed to create user: " + error.message);
  }
  await fetchUsers();
};


  const handleEditUser = (user: User) => {
    setEditingUserId(user._id);
    setFormData(user);
  };

  const handleSaveEdit = async () => {
    const originalUser = users.find((user) => user._id === formData._id);

    if (!originalUser) {
      setError("User not found");
      return;
    }

    const updatedFields: Partial<User> = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalUser[key]) {
        updatedFields[key] = formData[key];
      }
    });

    try {
      const response = await fetch(
        `http://localhost:8082/api/users/update-user/${formData._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      const updatedUser = await response.json();

      await fetchUsers();

      setEditingUserId(null);
    } catch (error: any) {
      setError("Failed to update user: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Ensure the URL is fully qualified if necessary, or correctly specified
      const response = await fetch(`http://localhost:8082/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        // Log the error response from the server to understand the issue better
        const errorResponse = await response.text(); // Getting the full error message
        console.error("Delete Error Response:", errorResponse);
        throw new Error("Failed to delete user: " + errorResponse);
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
    <button onClick={() => setAddingUser(!addingUser)}>
      {addingUser ? "Cancel" : "Add New User"}
    </button>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Password</th>
          <th>Status</th>
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
              {/* Add a wrapper div to stack Password and Password Confirmation */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  type="text" // Password field
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <input
                  type="text" // Password confirmation field below password
                  name="passwordConfirmation"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
              </div>
            </td>
            <td>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {userStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
                    type="text" // Keeping passwords visible
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {userStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={() => setEditingUserId(null)}>Cancel</button>
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
                <td>{user.status}</td>
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
