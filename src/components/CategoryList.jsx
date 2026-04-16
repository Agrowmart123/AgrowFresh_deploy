import React from "react";

export default function CategoryList({ categories, setCategory }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          style={{
            padding: "8px 15px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
