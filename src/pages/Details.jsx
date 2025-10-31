import React, { useState, useEffect } from "react";
import "../CSS/Home.css";
import "../CSS/Details.css";
import PokeCard from "../components/PokeCard";

// color map for types
function typeColorMap(type) {
  const map = {
    fire: "#D94E3F",
    water: "#3FA7E0",
    grass: "#67B26F",
    electric: "#E8C23A",
    psychic: "#A86FBF",
    normal: "#BDBDBD",
    rock: "#A1887F",
    ground: "#C69B6D",
    ice: "#7FD1E5",
    dark: "#64707A",
    fairy: "#F09CBF",
    fighting: "#D96549",
    poison: "#8A5CA6",
    bug: "#A6C66E",
    ghost: "#6C5AA0",
    dragon: "#6B86C9",
    flying: "#8FB4D9",
  };
  return map[(type || "").toLowerCase()] || "#9E9E9E";
}

// small helper to get a short label for type (1-2 chars)
function typeLabel(type) {
  if (!type) return "";
  const t = type.toLowerCase();
  if (t.length <= 2) return t.toUpperCase();
  return t[0].toUpperCase(); // e.g. G for Grass, E for Electric
}

// -- Updated SvgCard: uses type colors and draws a bottom-right chip showing types
function SvgCard({ pokemon, width = 300, height = 380 }) {
  const name = (pokemon?.name || "UNKNOWN").toUpperCase();
  const typesArr = (pokemon?.types || []).map((t) => t.toUpperCase());
  const types = typesArr.join(" / ");
  const stats = pokemon?.stats || [];
  const primary = (pokemon?.types && pokemon.types[0]) || "normal";
  const secondary = (pokemon?.types && pokemon.types[1]) || null;
  const color1 = typeColorMap(primary);
  const color2 = typeColorMap(secondary || primary);

  const nameLen = name.length;
  const nameFont = nameLen > 18 ? 9 : nameLen > 14 ? 10 : nameLen > 10 ? 12 : 14;
  const typesFont = 9;
  const statsFont = 9;

  const chipWidth = 42;
  const gap = 8;
  const totalWidth = secondary ? chipWidth * 2 + gap : chipWidth;
  const startX = 300 - 16 - totalWidth; // 16px right padding

  // safe gradient id
  const gradId = `g_${(pokemon?.name || "p").replace(/[^a-z0-9]/gi, "")}_grad`;

  return (
    <svg
      className="svg-card"
      width={width}
      height={height}
      viewBox="0 0 300 380"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${name} card`}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="1">
          <stop offset="0%" stopColor={color1} stopOpacity="1" />
          <stop offset="100%" stopColor={color2} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* card background uses the type gradient */}
      <rect x="0" y="0" width="300" height="380" rx="12" ry="12" fill={`url(#${gradId})`} stroke="#222" strokeWidth="2" />

      {/* artwork area */}
      <rect x="16" y="14" width="268" height="160" rx="10" ry="10" fill="rgba(0,0,0,0.10)" />
      {pokemon?.image && (
        <image
          href={pokemon.image}
          x="28"
          y="24"
          width="244"
          height="140"
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: "auto" }}
        />
      )}

      {/* top-right type chips */}
      <g>
        {/* white background holders so chips stand out */}
        {secondary ? (
          <>
            <rect x={startX} y={12} width={chipWidth} height={28} rx={6} fill="#fff" />
            <rect x={startX + chipWidth + gap} y={12} width={chipWidth} height={28} rx={6} fill="#fff" />
            <text x={startX + 12} y={32} fill={color1} fontFamily="'Press Start 2P', monospace" fontSize="10">{typeLabel(primary)}</text>
            <text x={startX + chipWidth + gap + 12} y={32} fill={color2} fontFamily="'Press Start 2P', monospace" fontSize="10">{typeLabel(secondary)}</text>
          </>
        ) : (
          <>
            <rect x={startX} y={12} width={chipWidth} height={28} rx={6} fill="#fff" />
            <text x={startX + 12} y={32} fill={color1} fontFamily="'Press Start 2P', monospace" fontSize="10">{typeLabel(primary)}</text>
          </>
        )}
      </g>

      {/* info - nudged up slightly so name doesn't sit too low */}
      <rect x="16" y="182" width="268" height="40" rx="8" ry="8" fill="rgba(0,0,0,0.28)" />
      <text x="28" y="198" fill="#ffd166" fontFamily="'Press Start 2P', monospace" fontSize={typesFont}>
        {types}
      </text>
      <text x="28" y="216" fill="#fff" fontFamily="'Press Start 2P', monospace" fontSize={nameFont} fontWeight="700">
        {name}
      </text>

      <rect x="16" y="226" width="268" height="120" rx="8" ry="8" fill="rgba(255,255,255,0.02)" />
      <text x="28" y="246" fill="#fff" fontFamily="'Press Start 2P', monospace" fontSize={statsFont}>
        Stats:
      </text>
      {stats.slice(0, 6).map((s, i) => (
        <text key={s.name} x="28" y={266 + i * 14} fill="#ffd" fontFamily="'Press Start 2P', monospace" fontSize={statsFont}>
          {`${s.name.replace("-", " ").toUpperCase()}: ${s.value}`}
        </text>
      ))}

      <text x="26" y="362" fill="#f0f0f0" fontFamily="'Press Start 2P', monospace" fontSize="7">
        Generated card — not official
      </text>
    </svg>
  );
}

// small helper for TCG cache/storage
const TCG_CACHE_KEY = "tcgCache_v1";

async function fetchTCGCard(name, id, timeoutMs = 500) {
  if (!name && !id) return null;
  // check cache
  try {
    const raw = localStorage.getItem(TCG_CACHE_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    const key = `${(name || "").toLowerCase()}|${id || ""}`;
    if (cache[key]) return cache[key];
    // try by id (national dex) first if provided
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const queries = [];
    if (id) queries.push(`nationalPokedexNumbers:${id}`);
    queries.push(`name:"${name}"`);
    for (const q of queries) {
      try {
        const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(q)}&pageSize=1`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) continue;
        const json = await res.json();
        const card = json.data && json.data[0];
        if (card && card.images) {
          const tcgImage = card.images.large || card.images.small || null;
          const tcgName = card.name || null;
          if (tcgImage) {
            cache[key] = { tcgImage, tcgName };
            try { localStorage.setItem(TCG_CACHE_KEY, JSON.stringify(cache)); } catch {}
            clearTimeout(timer);
            return cache[key];
          }
        }
      } catch (e) {
        // ignore and try next query
      }
    }
    clearTimeout(timer);
  } catch (e) {
    // ignore cache errors
  }
  return null;
}

export default function Details() {
  const samplePokemons = [
    { name: "Pikachu", image: getArtwork(25) },
    { name: "Charmander", image: getArtwork(4) },
    { name: "Bulbasaur", image: getArtwork(1) },
    { name: "Squirtle", image: getArtwork(7) },
    { name: "Eevee", image: getArtwork(133) },
    { name: "Snorlax", image: getArtwork(143) },
  ];

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [animateInfo, setAnimateInfo] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (selected) {
      setAnimateInfo(true);
      const id = setTimeout(() => setAnimateInfo(false), 900);
      return () => clearTimeout(id);
    }
  }, [selected]);

  async function loadDetails(name) {
    if (!name) return;
    setError("");
    setLoading(true);
    setSelected(null);

    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}`)
      ]);

      if (!pRes.ok) {
        setError("Pokémon niet gevonden");
        setLoading(false);
        return;
      }

      const pData = await pRes.json();
      let flavor = "";
      if (sRes.ok) {
        const sData = await sRes.json();
        const en = sData.flavor_text_entries.find((f) => f.language?.name === "en");
        if (en) flavor = en.flavor_text.replace(/\f|\n|\r/g, " ").trim();
      }

      const info = {
        id: pData.id,
        name: pData.name,
        image: pData.sprites.other["official-artwork"].front_default || getArtwork(pData.id),
        types: pData.types.map(t => t.type.name),
        abilities: pData.abilities.map(a => a.ability.name),
        stats: pData.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
        height: pData.height,
        weight: pData.weight,
        base_experience: pData.base_experience,
        description: flavor || "",
        tcgImage: null,
        tcgName: null
      };

      // show primary info immediately
      setSelected(info);

      // background TCG lookup (non-blocking)
      (async () => {
        const card = await fetchTCGCard(pData.name, pData.id, 500);
        if (card) {
          setSelected(prev => (prev && prev.name === pData.name ? { ...prev, tcgImage: card.tcgImage, tcgName: card.tcgName } : prev));
        }
      })();
    } catch (err) {
      setError("Fout bij ophalen van gegevens");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    loadDetails(query.trim());
  }

  return (
    <div className={`home-container container ${mounted ? "page-animate" : ""} details-root`}>
      <h2 className="pixel-title">POKÉDEX DETAILS</h2>

      <form onSubmit={handleSearch} className="search-bar" style={{ marginTop: 12 }}>
        <input
          type="text"
          placeholder="Zoek een Pokémon... (bijv. pikachu)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Zoeken</button>
      </form>

      {loading && <p className="muted">Laden...</p>}
      {error && <p className="error">{error}</p>}

      <section style={{ marginTop: 18 }}>
        <h3>Voorbeelddex</h3>
        <div className="pokedex-grid" style={{ marginTop: 12 }}>
          {samplePokemons.map(p => (
            <PokeCard key={p.name} pokemon={p} onClick={() => loadDetails(p.name)} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        {selected ? (
          <div className={`details-panel ${animateInfo ? "show-info" : ""}`}>
            <div className="details-flex">
              <div className="details-info">
                <h3 className="details-name">{selected.name.toUpperCase()}</h3>

                {selected.description && (
                  <p style={{ maxWidth: 520, margin: "8px 0", color: "#ffd" }}>
                    {selected.description}
                  </p>
                )}

                <div className="details-row">
                  <div><strong>Types:</strong> {selected.types.join(", ")}</div>
                  <div><strong>Abilities:</strong> {selected.abilities.join(", ")}</div>
                </div>

                <div style={{ marginTop: 8, color: "#fff" }}>
                  <strong>What they can do:</strong>
                  <p style={{ margin: "6px 0 0 0", color: "#ffd166" }}>
                    This Pokémon is {selected.types.join(" / ")} type and can use abilities like {selected.abilities.slice(0,3).join(", ")}.
                  </p>
                </div>

                <div className="details-row muted" style={{ marginTop: 8 }}>
                  <div>Height: {selected.height}</div>
                  <div>Weight: {selected.weight}</div>
                  <div>Base XP: {selected.base_experience}</div>
                </div>
              </div>

              {/* RIGHT: show real TCG image framed with type color, icon bottom-right */}
              <div className={`card-column ${animateInfo ? "card-appear" : ""}`}>
                {selected?.tcgImage ? (
                  <div className="card-wrap">
                    <div
                      className="tcg-frame"
                      style={{
                        borderColor: typeColorMap(selected.types?.[0]),
                        background: `linear-gradient(180deg, ${typeColorMap(selected.types?.[0])}, ${typeColorMap(selected.types?.[1] || selected.types?.[0])})`
                      }}
                    >
                      <img src={selected.tcgImage} alt={selected.tcgName || selected.name} className="card-image" />

                      {/* top-right chips rendered as HTML so they overlay the image */}
                      <div className="tcg-top-badge" aria-hidden>
                        {selected.types && selected.types.slice(0,2).map((t, idx) => (
                          <div key={t} className="tcg-top-chip" style={{ background: "#fff", color: typeColorMap(t) }}>
                            {typeLabel(t)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card-caption">Real-life TCG card: {selected.tcgName || selected.name}</div>
                  </div>
                ) : (
                  <div className="card-wrap">
                    <SvgCard pokemon={selected} />
                    <div className="card-caption">Generated card preview</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="muted">Klik op een Pokémon of zoek er één om details te zien.</p>
        )}
      </section>
    </div>
  );
}

// helper to return an artwork url by id
function getArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
