
import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setSuccess(false);
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must have at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!formData.age || Number(formData.age) < 18) {
      newErrors.age = "You must be at least 18 years old";
    } else if (Number(formData.age) > 100) {
      newErrors.age = "Enter a valid age";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters";
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      newErrors.password = "Include one uppercase letter and one number";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.terms) {
      newErrors.terms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setSuccess(true);
      setErrors({});
      console.log("Registration Data:", formData);
    } else {
      setSuccess(false);
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <div className="header">
          <h1>Student Registration</h1>
          <p>Create your account by filling in the details below.</p>
        </div>

        {success && (
          <div className="success">
            Registration successful! Your details are valid.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            <span className="error">{errors.name}</span>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            <span className="error">{errors.email}</span>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              placeholder="10-digit mobile number"
              maxLength="10"
              value={formData.mobile}
              onChange={handleChange}
            />
            <span className="error">{errors.mobile}</span>
          </div>

          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleChange}
            />
            <span className="error">{errors.age}</span>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span className="error">{errors.gender}</span>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
            />
            <span className="error">{errors.password}</span>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span className="error">{errors.confirmPassword}</span>
          </div>

          <div className="terms">
            <label>
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              I accept the Terms and Conditions
            </label>
            <span className="error">{errors.terms}</span>
          </div>

          <button type="submit">Register Now</button>
        </form>

        <p className="footer">
          ReactJS Client-Side Validation Demonstration
        </p>
      </div>
    </div>
  );
}

export default App;
