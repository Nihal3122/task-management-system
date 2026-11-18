import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Register API
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...userData } = formData;

    console.log("Sending Registration Data:", userData);

    try {
      const data = await registerUser(userData);
      console.log("Registration Response:", data);

      setSuccess(data.message || "Registration successful!");
       toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.log("Backend Error:", error.response?.data);
      setError(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-slate-100">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          TaskFlow
        </h1>

        <h2 className="text-xl font-semibold text-slate-800 text-center mt-6">
          Create Account
        </h2>

        <p className="text-sm text-slate-500 text-center mt-2">
          Sign up to get started.
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-3"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
