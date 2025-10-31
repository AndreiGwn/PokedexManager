import "../CSS/TeamSlot.css";
// Component representing a single slot in the Pokémon team, supporting drop functionality
function TeamSlot({ index, pokemon, onDrop, onRemove }) {
  const handleDrop = (e) => {
    e.preventDefault();
    if (window.draggedPokemon) {
      onDrop(index, window.draggedPokemon);
      window.draggedPokemon = null;
    }
  };
  // Allow dropping by preventing default behavior
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="team-slot"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {pokemon ? (
        <>
          <img src={pokemon.image} alt={pokemon.name} />
          <p>{pokemon.name}</p>
          {/* small remove button for this slot */}
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove && onRemove(index);
            }}
            title="Remove"
          >
            ×
          </button>
        </>
      ) : (
        <p className="empty">+</p>
      )}
    </div>
  );
}

export default TeamSlot;
