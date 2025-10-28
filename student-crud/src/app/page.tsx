'use client';

import { useState } from "react";
import '../styles/studentCrud.css'

export default function StudentCRUD() {
  const [students, setStudents] = useState([
    { id: 1, name: "Asha Rao", age: 20, email: "asha@example.com", course: "BSc" },
    { id: 2, name: "Rahul Kumar", age: 22, email: "rahul@example.com", course: "BCom" },
  ]);

  const [form, setForm] = useState({ id: null, name: "", age: "", email: "", course: "" });
  const [isEditing, setIsEditing] = useState(false);

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

  return (
  <div className="container">
    <h1>Student CRUD</h1>
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit Student" : "Add Student"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
      </div>
      <div style={{ marginTop: 15 }}>
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
        {isEditing && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
          <th>Course</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", padding: 12 }}>
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
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>


  );
}

