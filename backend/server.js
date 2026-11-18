import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
}));

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
  age: { type: Number, required: true, min: 18, max: 100 },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

app.get("/", (_req, res) => {
  res.json({ message: "Student Registration API is running" });
});

app.get("/api/students", async (_req, res) => {
  try {
    const students = await Student.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(students);
  } catch {
    res.status(500).json({ message: "Could not fetch students" });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { name, email, mobile, age, gender, password } = req.body;
    if (!name || !email || !mobile || !age || !gender || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name, email, mobile, age: Number(age), gender, passwordHash,
    });
    const safeStudent = await Student.findById(student._id).select("-passwordHash");
    res.status(201).json({ message: "Student registered successfully", student: safeStudent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "This email is already registered" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Could not register student" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const { name, email, mobile, age, gender } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, mobile, age: Number(age), gender },
      { new: true, runValidators: true }
    ).select("-passwordHash");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "This email is already registered" });
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Could not update student" });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid student ID" });
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it to backend/.env");
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });