export const ModalEnemyCard = ({ enemy, onClose }) => {
  if (!enemy) {
    console.log(enemy);
    return (
      <div className="modal">
        <p>Enemigo no encontrado</p>
        
        <button onClick={onClose}>Cerrar</button>
      </div>
    );
  }

  const { name, imagen, vida, vidaMax, movimiento, ataque, color, comportamiento, categoria } = enemy;
  
  const borderColor = {
    blanco: 'border-gray-300',
    gris: 'border-gray-600',
    negro: 'border-black',
    comandante: 'border-yellow-400',
    jefe: 'border-purple-600',
  }[color] || 'border-gray-400';

  const vidaPercent = Math.max(0, Math.min(100, (vida / vidaMax) * 100));
  
 return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-lg max-w-md w-full relative border-4 ${borderColor}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 text-xl font-bold"
          aria-label="Cerrar modal"
        >
          ×
        </button>

        <div className="flex flex-col items-center p-6">
          <img
            src={imagen}
            alt={name}
            className="w-40 h-40 object-cover rounded-lg mb-4 border-2"
          />

          <h2 className="text-2xl font-bold mb-2 text-center">{name}</h2>

          {categoria && (
            <span className="inline-block mb-3 px-3 py-1 bg-gray-200 rounded-full text-sm font-semibold text-gray-700">
              Categoría: {categoria}
            </span>
          )}

          {comportamiento && (
            <p className="italic text-gray-600 mb-4 text-center">
              Comportamiento: {comportamiento}
            </p>
          )}

          <div className="w-full grid grid-cols-3 gap-4 text-center font-semibold text-gray-800 mb-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Vida</div>
              <div>{vida} / {vidaMax}</div>

              {/* Barra de vida */}
              <div className="w-full h-4 bg-red-200 rounded mt-1 overflow-hidden border border-red-400">
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${vidaPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Movimiento</div>
              <div>{movimiento}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Ataque</div>
              <div>{ataque}</div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
            >
              Cerrar
            </button>

            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

