import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/forgot-password",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Reset Password</h2>
      <input
        type="text"
        name="userName"
        placeholder="Username"
        value={formData.userName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email (Optional)"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="confirmNewPassword"
        placeholder="Confirm New Password"
        value={formData.confirmNewPassword}
        onChange={handleChange}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ForgotPassword;
