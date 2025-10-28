'use client';

import { useRef, useState } from "react";
import "../styles/studentCrud.css";

const html2pdf = typeof window !== "undefined" ? require("html2pdf.js") : null;

export default function StudentCRUD() {
  const [students, setStudents] = useState([
    { id: 1, name: "Asha Rao", age: 20, email: "asha@example.com", phone: "9876543210", course: "BSc", file: "" },
    { id: 2, name: "Rahul Kumar", age: 22, email: "rahul@example.com", phone: "8765432109", course: "BCom", file: "" },
  ]);

  const [form, setForm] = useState({ id: null, name: "", age: "", email: "", phone: "", course: "", file: "" });
  const [errors, setErrors] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err: any) => ({ ...err, [name]: "" })); // clear error when typing
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setForm((f) => ({ ...f, file: fileURL }));
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone); // Indian mobile pattern

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(form.phone)) newErrors.phone = "Enter a valid 10-digit phone number";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return; // stop if validation fails

    if (isEditing) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === form.id ? { ...form, id: s.id, age: Number(form.age) } : s
        )
      );
      setIsEditing(false);
    } else {
      const newStudent = {
        id: Date.now(),
        name: form.name,
        age: Number(form.age),
        email: form.email,
        phone: form.phone,
        course: form.course,
        file: form.file,
      };
      setStudents((prev) => [...prev, newStudent]);
    }

    // Reset form + clear file input
    setForm({ id: null, name: "", age: "", email: "", phone: "", course: "", file: "" });
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (student: any) => {
    setForm(student);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleCancel = () => {
    setForm({ id: null, name: "", age: "", email: "", phone: "", course: "", file: "" });
    setErrors({});
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadPDF = () => {
    if (!html2pdf) return;
    const element = document.getElementById("pdfRef");
    if (!element) return;

    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".no-pdf").forEach((col) => col.remove());

    const options = {
      margin: 0.5,
      filename: "students.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "fixed";
    tempDiv.style.top = "-9999px";
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);

    html2pdf()
      .from(clone)
      .set(options)
      .save()
      .then(() => {
        document.body.removeChild(tempDiv);
      });
  };

  return (
    <div className="container">
      <h1>Student CRUD</h1>

      <form onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Student" : "Add Student"}</h2>
        <div className="form-grid">
          <div>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
            {errors.phone && <p className="error">{errors.phone}</p>}
          </div>

          <div>
            <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
          </div>

          <div>
            <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
          </div>

          <div>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} />
          </div>
        </div>

        {form.file && (
          <div className="file-preview">
            {form.file.endsWith(".pdf") ? (
              <a href={form.file} target="_blank" rel="noopener noreferrer">View Uploaded File</a>
            ) : (
              <img src={form.file} alt="Uploaded" width="80" height="80" />
            )}
          </div>
        )}

        <div className="form-buttons">
          <button type="submit">{isEditing ? "Update" : "Add"}</button>
          {isEditing && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="pdf-actions">
        <button className="pdf-button" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      <div id="pdfRef">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Course</th>
              <th>File</th>
              <th className="no-pdf">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">No students found</td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.age}</td>
                  <td>{s.course}</td>
                  <td>
                    {s.file ? (
                      s.file.endsWith(".pdf") ? (
                        <a href={s.file} target="_blank" rel="noopener noreferrer">View</a>
                      ) : (
                        <img src={s.file} alt="Uploaded" width="60" height="60" />
                      )
                    ) : (
                      "No File"
                    )}
                  </td>
                  <td className="no-pdf">
                    <button onClick={() => handleEdit(s)}>Edit</button>
                    <button onClick={() => handleDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
