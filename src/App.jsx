import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", age: "", gender: "",
    password: "", confirmPassword: "", terms: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`);
      if (!response.ok) throw new Error("Unable to load student records");
      setStudents(await response.json());
      setApiError("");
    } catch (error) {
      setApiError(error.message + ". Check that the backend is running.");
    }
  };

  useEffect(() => { loadStudents(); }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((previous) => ({
      ...previous, [name]: type === "checkbox" ? checked : value,
    }));
    setSuccess("");
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 3) newErrors.name = "Name must have at least 3 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email address";
    if (!/^[0-9]{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!formData.age || Number(formData.age) < 18) newErrors.age = "You must be at least 18 years old";
    else if (Number(formData.age) > 100) newErrors.age = "Enter a valid age";
    if (!formData.gender) newErrors.gender = "Please select your gender";
    if (formData.password.length < 8) newErrors.password = "Password must contain at least 8 characters";
    else if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) newErrors.password = "Include one uppercase letter and one number";
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.terms) newErrors.terms = "Please accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSuccess("");
    setApiError("");
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, email: formData.email, mobile: formData.mobile,
          age: formData.age, gender: formData.gender, password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      setSuccess("Student registered and saved to MongoDB successfully!");
      setErrors({});
      setFormData({
        name: "", email: "", mobile: "", age: "", gender: "",
        password: "", confirmPassword: "", terms: false,
      });
      await loadStudents();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editStudent = async (student) => {
    const name = window.prompt("Full name:", student.name);
    if (name === null) return;
    const mobile = window.prompt("10-digit mobile number:", student.mobile);
    if (mobile === null) return;
    const age = window.prompt("Age:", String(student.age));
    if (age === null) return;
    const email = window.prompt("Email address:", student.email);
    if (email === null) return;
    const gender = window.prompt("Gender (Male, Female, Other):", student.gender);
    if (gender === null) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, age, gender }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      setSuccess("Student record updated successfully!");
      await loadStudents();
    } catch (error) {
      setApiError(error.message);
    }
  };

  const deleteStudent = async (student) => {
    if (!window.confirm(`Delete the record for ${student.name}?`)) return;
    try {
      const response = await fetch(`${API_URL}/api/students/${student._id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");
      setSuccess("Student record deleted successfully!");
      await loadStudents();
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <div className="header">
          <h1>Student Registration</h1>
          <p>Create your account by filling in the details below.</p>
        </div>

        {success && <div className="success">{success}</div>}
        {apiError && <div className="error" role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} />
            <span className="error">{errors.name}</span>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} />
            <span className="error">{errors.email}</span>
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input type="text" name="mobile" placeholder="10-digit mobile number" maxLength="10" value={formData.mobile} onChange={handleChange} />
            <span className="error">{errors.mobile}</span>
          </div>
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" placeholder="Enter your age" value={formData.age} onChange={handleChange} />
            <span className="error">{errors.age}</span>
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option><option value="Male">Male</option>
              <option value="Female">Female</option><option value="Other">Other</option>
            </select>
            <span className="error">{errors.gender}</span>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} />
            <span className="error">{errors.password}</span>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} />
            <span className="error">{errors.confirmPassword}</span>
          </div>
          <div className="terms">
            <label><input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} /> I accept the Terms and Conditions</label>
            <span className="error">{errors.terms}</span>
          </div>
          <button type="submit" disabled={loading}>{loading ? "Saving..." : "Register Now"}</button>
        </form>
        <p className="footer">ReactJS Validation + Node.js + MongoDB Demonstration</p>
      </div>

      <section className="form-container" style={{ marginTop: 28, maxWidth: 900 }}>
        <div className="header">
          <h2>Registered Students</h2>
          <p>Records retrieved live from the MongoDB database ({students.length})</p>
        </div>
        <button type="button" onClick={loadStudents}>Refresh Records</button>
        {students.length === 0 ? <p>No student records found yet.</p> : (
          <div style={{ overflowX: "auto", marginTop: 18 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead><tr>{["Name", "Email", "Mobile", "Age", "Gender", "Actions"].map((heading) => <th key={heading} style={{ padding: 10, borderBottom: "1px solid #ddd" }}>{heading}</th>)}</tr></thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td style={{ padding: 10 }}>{student.name}</td>
                    <td style={{ padding: 10 }}>{student.email}</td>
                    <td style={{ padding: 10 }}>{student.mobile}</td>
                    <td style={{ padding: 10 }}>{student.age}</td>
                    <td style={{ padding: 10 }}>{student.gender}</td>
                    <td style={{ padding: 10, whiteSpace: "nowrap" }}>
                      <button type="button" onClick={() => editStudent(student)}>Edit</button>{" "}
                      <button type="button" onClick={() => deleteStudent(student)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
