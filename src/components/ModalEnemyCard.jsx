export const ModalEnemyCard = ({ enemy, onClose }) => {
  if (!enemy) {
    return (
      <div className="modal">
        <p>Enemigo no encontrado</p>{enemy}
        <button onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  const { name, imagen, vida, vidaMax, movimiento, ataque, color, comportamiento, categoria } = enemy;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded relative">
        <button className="absolute top-2 right-2" onClick={onClose}>❌</button>
        <img src={imagen} alt={name} className="w-32 h-32 object-cover" />
        <h2>{name}</h2>
        <p>Vida: {vida}/{vidaMax}</p>
        <p>Movimiento: {movimiento}</p>
        <p>Ataque: {ataque}</p>
        <p>Comportamiento: {comportamiento}</p>
        <p>Categoría: {categoria}</p>
      </div>
    </div>
  );
};

