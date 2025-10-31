import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Home.css";
import MyButton from "../components/MyButton";

// Main Home component - Welcome screen
export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`home-container container ${mounted ? "page-animate" : ""}`}>
      <h1 className="pixel-title">WELCOME</h1>
      <p style={{ color: "#ffcb05", marginTop: 12 }}>
        Manage your Pokémon teams or explore the Pokédex
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          marginTop: 24,
        }}
      >
        <Link to="/manage">
          <MyButton className="primary">Go to Team Management</MyButton>
        </Link>
        <Link to="/details">
          <MyButton>Go to Pokedex Details Page</MyButton>
        </Link>
      </div>
    </div>
  );
}
