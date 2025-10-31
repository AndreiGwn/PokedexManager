import React, { useEffect, useState } from 'react'
import "../CSS/Home.css";


export default function About(){
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
return (
<div className={`home-container container ${mounted ? "page-animate" : ""}`}>
<h2 className="pixel-title">Over deze app</h2>

      <p>
        Deze Pokedex Manager is een lichte, gebruiksvriendelijke webapp gebouwd met React en de PokéAPI.
        Je kunt teams samenstellen, Pokémon onderzoeken en je werk lokaal bewaren.
      </p>

      <h3>Wat je kunt doen</h3>
      <ul style={{ textAlign: "left", maxWidth: 900, margin: "0.5rem auto" }}>
        <li>Team Management: sleep Pokémon naar je team, verwijder ze en orden de slots.</li>
        <li>Opslaan: bewaar je team direct in localStorage met de knop "Save team".</li>
        <li>Pokédex Details: zoek Pokémon op naam, bekijk types, abilities, stats en een korte beschrijving.</li>
        <li>TCG/Kaartweergave: toont officiële artwork of een gegenereerde kaart-preview aan de rechterzijde.</li>
        <li>Responsive: werkt op desktop, tablet en mobiel; UI schaalt en knoppen passen zich aan.</li>
      </ul>

      <h3>Tips & uitbreidingsmogelijkheden</h3>
      <ul style={{ textAlign: "left", maxWidth: 900, margin: "0.5rem auto" }}>
        <li>Je kunt meer eigenschappen toevoegen uit de PokéAPI (moves, abilities details, evoluties).</li>
        <li>Overweeg export/import van teams (JSON) om teams te delen tussen apparaten.</li>
        <li>Styling en teamgrootte zijn eenvoudig aan te passen in de broncode.</li>
      </ul>

      <p style={{ marginTop: 8 }}>
        Dit project is bedoeld als startpunt — pas het aan naar je eigen workflow of stuur verzoeken voor extra features.
      </p>
</div>
)
}