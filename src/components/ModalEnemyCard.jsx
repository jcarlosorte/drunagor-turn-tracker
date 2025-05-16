export const ModalEnemyCard = ({ uuid, enemy, onClose, onDelete }) => {
  console.log(uuid);
  if (!enemy) {
    //console.log(enemy);
    return (
      <div className="modal">
        <p>Enemigo no encontrado</p>
        
        <button onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  const { name, imagen, vida, vidaMax, movimiento, ataque, color, comportamiento, categoria } = enemy;
  
  const borderColorMap = {
    blanco: 'border-blanco',
    gris: 'border-gris',
    negro: 'border-negro',
    comandante: 'border-dorado',
    jefe: 'border-morado',
  };

  const textBgColorMap = {
    blanco: 'bg-white/70',
    gris: 'bg-gray-500/70',
    negro: 'bg-black/70',
    comandante: 'bg-yellow-400/70',
    jefe: 'bg-purple-700/70',
  };

  const categoryGlowMap = {
    bisoño: 'drop-shadow-[0_0_6px_rgba(59,130,246,1)]',
    soldado: 'drop-shadow-[0_0_6px_rgba(234,179,8,1)]',
    veterano: 'drop-shadow-[0_0_6px_rgba(251,146,60,1)]',
    campeon: 'drop-shadow-[0_0_6px_rgba(239,68,68,1)]',
  };

  const categoryTextGlowMap = {
    bisoño: 'glow-bisono',
    soldado: 'glow-soldado',
    veterano: 'glow-veterano',
    campeon: 'glow-campeon',
    comandante: 'glow-commander',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-lg max-w-sm w-full relative border-4 ${borderColorMap[color] || ''}`}>
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 hover:text-black text-xl font-bold"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        {/* Eliminar */}
        {onDelete && (
          <button
            onClick={() => onDelete(uuid)}
            className="absolute top-2 left-2 text-white bg-red-600 hover:bg-red-700 rounded-full px-2 py-1 text-xs"
          >
            🗑 Eliminar
          </button>
        )}

        <div className="flex flex-col items-center p-6">
          {/* Imagen */}
          <img
            src={imagen}
            alt={name}
            className={`w-40 h-40 object-cover rounded-lg mb-4 border-2 ${borderColorMap[color] || ''}`}
          />

          {/* Nombre */}
          <h2
            className={`text-2xl font-bold mb-2 text-center text-white px-3 py-1 rounded 
              ${textBgColorMap[color] || ''} 
              ${categoryTextGlowMap[categoria] || ''}`}
          >
            {name}
          </h2>

          {/* Categoría */}
          {categoria && (
            <span className={`inline-block mb-3 px-3 py-1 bg-gray-200 rounded-full text-sm font-semibold text-gray-700 ${categoryGlowMap[categoria] || ''}`}>
              Categoría: {categoria}
            </span>
          )}

          {/* Comportamiento */}
          {comportamiento && (
            <p className="italic text-gray-600 mb-4 text-center">
              Comportamiento: {comportamiento}
            </p>
          )}

          {/* Vida / Movimiento / Ataque */}
          <div className="w-full grid grid-cols-3 gap-4 text-center font-semibold text-gray-800 mb-3">
            <div>
              <div className="text-sm text-gray-500">Vida</div>
              <div>{vida} / {vidaMax}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Movimiento</div>
              <div>{movimiento}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ataque</div>
              <div>{ataque}</div>
            </div>
          </div>

          {/* Barra de vida */}
          <div className="w-full relative h-3">
            <div className="absolute inset-0 flex items-center justify-center text-white text-[0.65rem] font-bold z-10">
              {vida} / {vidaMax}
            </div>
            <div className="w-full h-full bg-red-900 rounded">
              <div
                className="h-full bg-red-500 rounded"
                style={{ width: `${(vida / vidaMax) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

