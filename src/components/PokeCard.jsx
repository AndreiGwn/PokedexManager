import "../CSS/PokeCard.css";
// Component to display a Pokémon card with image and name, supporting drag-and-drop and click
function PokeCard({ pokemon, draggable, onDragStart, onClick }) {
  const handleDragStart = (e) => {
    // make it usable for drop
    try {
      e.dataTransfer.setData("text/plain", pokemon.name);
    } catch (err) {
      // ignore in some browsers
    }
    window.draggedPokemon = pokemon;
    if (onDragStart) onDragStart(e);
  };

  const safeOnClick = (e) => {
    try {
      if (onClick) onClick(pokemon);
    } catch (err) {
      console.error("PokeCard onClick error:", err);
    }
  };

  return (
    <div
      className="poke-card"
      draggable={draggable}
      onDragStart={handleDragStart}
      onClick={safeOnClick}
      role={onClick ? "button" : undefined}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <img src={pokemon.image} alt={pokemon.name} />
      <p>{pokemon.name.toUpperCase()}</p>
    </div>
  );
}

export default PokeCard;