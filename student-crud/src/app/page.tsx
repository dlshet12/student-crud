'use client';

import { useRef, useState } from "react";
import "../styles/studentCrud.css";

const html2pdf = typeof window !== "undefined" ? require("html2pdf.js") : null;

export default function StudentCRUD() {
  const [students, setStudents] = useState([
    { id: 1, name: "Asha Rao", age: 20, email: "asha@example.com", course: "BSc" },
    { id: 2, name: "Rahul Kumar", age: 22, email: "rahul@example.com", course: "BCom" },
  ]);

  const [form, setForm] = useState({ id: null, name: "", age: "", email: "", course: "" });
  const [isEditing, setIsEditing] = useState(false);

  const pdfRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert("Name and Email are required!");
      return;
    }

    if (isEditing) {
      setStudents((prev) =>
        prev.map((s) => (s.id === form.id ? { ...form, id: s.id, age: Number(form.age) } : s))
      );
      setIsEditing(false);
    } else {
      const newStudent = {
        id: Date.now(),
        name: form.name,
        age: Number(form.age),
        email: form.email,
        course: form.course,
      };
      setStudents((prev) => [...prev, newStudent]);
    }

    setForm({ id: null, name: "", age: "", email: "", course: "" });
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
    setForm({ id: null, name: "", age: "", email: "", course: "" });
    setIsEditing(false);
  };

 const handleDownloadPDF = () => {
  if (!html2pdf) return;
  const element = document.getElementById("pdfRef");
  if (!element) return;

  // Clone the table to avoid modifying the live DOM
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
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
      <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
    </div>
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
          <th>Age</th>
          <th>Course</th>
          <th className="no-pdf">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan={5} className="empty-row">
              No students found
            </td>
          </tr>
        ) : (
          students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>
              <td>{s.course}</td>
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
