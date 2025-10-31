import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Management from "./pages/Management";
import Details from "./pages/Details";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        {/* replaced title with logo + text */}
        <div className="app-logo" aria-hidden="false">
          {/* simple pokeball-like SVG */}
          <svg className="logo-svg" viewBox="0 0 24 24" width="36" height="36" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pokedex logo">
            <circle cx="12" cy="12" r="10" fill="#fff" />
            <path d="M2 12a10 10 0 0 0 20 0" fill="#ffcb05" />
            <circle cx="12" cy="12" r="5.2" fill="#111" />
            <circle cx="12" cy="12" r="2.6" fill="#fff" />
            <path d="M2 12h20" stroke="#111" strokeWidth="1.2"/>
          </svg>
          <span className="logo-text">Pokedex Manager</span>
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/details">Details</Link>
          <Link to="/manage" className="my-btn primary" style={{ marginLeft: 12 }}>
            Make your team
          </Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/manage" element={<Management />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </main>

      <footer className="app-footer">Made with ❤️ by Andrei</footer>
    </div>
  );
}
