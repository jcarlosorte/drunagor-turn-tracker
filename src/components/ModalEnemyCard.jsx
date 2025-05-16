export default function ModalEnemyCard({ uuid, onClose, onUpdateLife }) {
  const { name, comportamiento, image, vidaActual, vidaMax, uuid, color } = uuid;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-4 rounded-lg w-[300px] relative text-white">
        <button onClick={onClose} className="absolute top-2 right-2 text-white bg-red-600 w-6 h-6 flex items-center justify-center rounded-full">×</button>
        <img src={image} alt={name} className="w-full h-48 object-cover rounded border-2 mb-2" />
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-sm italic">{comportamiento}</p>

        {/* Barra de vida completa */}
        <div className="mt-4">
          <div className="text-sm">Vida: {vidaActual} / {vidaMax}</div>
          <div className="w-full h-3 bg-red-900 rounded mt-1">
            <div
              className="h-full bg-red-500 rounded"
              style={{ width: `${(vidaActual / vidaMax) * 100}%` }}
            ></div>
          </div>

          {/* Botones para subir y bajar */}
          <div className="flex justify-between mt-2">
            <button onClick={() => onUpdateLife(uuid, vidaActual - 1)} className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">-</button>
            <button onClick={() => onUpdateLife(uuid, vidaActual + 1)} className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
