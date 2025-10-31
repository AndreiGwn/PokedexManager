import React, { useState, useEffect } from "react";
import "../CSS/Home.css";
import TeamSlot from "../components/TeamSlot";
import PokeCard from "../components/PokeCard";
import MyButton from "../components/MyButton";

export default function Management() {
  // sample Pokémon (official-artwork sprites from PokéAPI)
  const samplePokemons = [
    { name: "Bulbasaur", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png" },
    { name: "Charmander", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png" },
    { name: "Squirtle", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png" },
    { name: "Pikachu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
    { name: "Eevee", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png" },
    { name: "Snorlax", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png" },
  ];

  const [team, setTeam] = useState(Array(6).fill(null));
  const [message, setMessage] = useState("");

  // NEW: search state and error
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // load saved team
    try {
      const saved = localStorage.getItem("team");
      if (saved) {
        setTeam(JSON.parse(saved));
      }
    } catch (err) {
      // ignore
    }
  }, []);

  // NEW: handle search submit (fetch from PokéAPI)
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setSearchError("");
    setSearchResult(null);
    const q = (search || "").trim().toLowerCase();
    if (!q) {
      setSearchError("Voer een Pokémon naam in.");
      return;
    }
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${q}`);
      if (!res.ok) {
        setSearchError("Geen Pokémon gevonden.");
        return;
      }
      const data = await res.json();
      const p = {
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      };
      setSearchResult(p);
    } catch (err) {
      setSearchError("Fout bij ophalen van Pokémon.");
    }
  };

  const handleDrop = (index, pokemon) => {
    setTeam((t) => {
      const copy = [...t];
      copy[index] = pokemon;
      return copy;
    });
    setMessage("");
  };

  const handleRemove = (index) => {
    setTeam((t) => {
      const copy = [...t];
      copy[index] = null;
      return copy;
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem("team", JSON.stringify(team));
      setMessage("Team saved to localStorage.");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage("Failed to save team.");
    }
  };

  return (
    <div className={`home-container container ${mounted ? "page-animate" : ""}`}>
      <h2 className="pixel-title">TEAM MANAGEMENT</h2>

      <section className="results-section">
        <div style={{ width: "100%", maxWidth: 800 }}>
          {/* NEW: search bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Zoek een Pokémon om te slepen (bijv. pikachu)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: 4, border: "2px solid #ffcb05", background: "#222", color: "#fff", fontFamily: "'Press Start 2P', cursive" }}
            />
            <MyButton type="submit">Search</MyButton>
            <MyButton onClick={() => { setSearch(""); setSearchResult(null); setSearchError(""); }}>Clear</MyButton>
          </form>
          {searchError && <div style={{ color: "#ff6b6b", marginBottom: 8 }}>{searchError}</div>}

          {/* show search result as draggable card */}
          {searchResult && (
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 6 }}>Search result (drag me):</div>
                <PokeCard pokemon={searchResult} draggable />
              </div>
            </div>
          )}

          <h3 style={{ marginBottom: 8 }}>Available Pokémon</h3>
          <div className="pokedex-grid" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {samplePokemons.map((p) => (
              <PokeCard key={p.name} pokemon={p} draggable={true} />
            ))}
          </div>

          <h3 style={{ marginTop: 20 }}>Your Team (drag to slots)</h3>
          <div className="team-grid" style={{ marginTop: 12, justifyContent: "center" }}>
            {team.map((p, i) => (
              <TeamSlot key={i} index={i} pokemon={p} onDrop={handleDrop} onRemove={handleRemove} />
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
            <MyButton onClick={handleSave} className="primary">Save team</MyButton>
            <MyButton
              onClick={() => {
                setTeam(Array(6).fill(null));
                setMessage("");
              }}
            >
              Clear
            </MyButton>
            <span style={{ color: "#ffcb05", marginLeft: 8 }}>{message}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
