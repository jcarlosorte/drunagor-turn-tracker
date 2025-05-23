import React, { useState, useEffect } from 'react';
import { FiInfo } from "react-icons/fi";
import { useLanguage } from '@/context/LanguageContext';
import { GiHealthPotion, GiRunningNinja, GiSwordClash, GiShieldReflect, GiSteeltoeBoots, GiBloodySword, GiArcheryTarget, GiMoebiusTrefoil } from "react-icons/gi";
import { MdLooksOne,  MdLooksTwo,  MdLooks3,  MdLooks4,  MdLooks5,  MdLooks6,} from 'react-icons/md';


export const ModalEnemyCard = ({ uuid, enemy, onClose, onDelete, onVidaChange }) => {
  const [vidaLocal, setVidaLocal] = useState(enemy?.vida || 0);
  const { language, translations } = useLanguage();
  const ti = translations.trackerInit || {};
  const tr = translations.roles || {};
  const te = translations.enemies || {};
  const tc = translations.enemies?.categoria || {};
  const tb = translations.trackerSelect?.comportamientos || {};
  const tt = translations.condiciones_t || {};
  const tte = translations.condiciones_d || {};

  useEffect(() => {
    if (enemy) {
      setVidaLocal(enemy.vida);
    }
  }, [enemy]);
  
  if (!enemy) {
    //console.log(enemy);
    return (
      <div className="modal">
        <p>{ti.enemyNotFound}</p>
        <button onClick={onClose}>{ti.close}</button>
      </div>
    );
  }

  const { id, name, imagen, vida, vidaMax, movimiento, ataque, color, comportamiento, categoria, inmunidad, tipo_ataque, capacidades } = enemy;
  const numeroIconos = [    <MdLooksOne key="1" />,    <MdLooksTwo key="2" />,    <MdLooks3 key="3" />,    <MdLooks4 key="4" />,    <MdLooks5 key="5" />,    <MdLooks6 key="6" />,  ];
  const borderColorMap = {
    blanco: 'border-blanco',
    gris: 'border-gris',
    negro: 'border-negro',
    comandante: 'border-dorado',
    jefe: 'border-morado',
  };

  const bgColorMap = {
    blanco: 'bg-white',
    gris: 'bg-gray-500',
    negro: 'bg-black',
    comandante: 'bg-yellow-400',
    jefe: 'bg-purple-700',
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

  const handleVidaChange = (delta) => {
    const nuevaVida = Math.min(vidaMax, Math.max(0, vidaLocal + delta));
    setVidaLocal(nuevaVida);
    if (onVidaChange) {
      onVidaChange(enemy.uuid, nuevaVida);
    }
  };

  const tipoAtaqueIconMap = {
    "cuerpo": <GiBloodySword className="text-white text-2xl cursor-help" title={ti.tipo_ataque.cuerpo || ''} />,
    "distancia": <GiArcheryTarget className="text-white text-2xl cursor-help" title={ti.tipo_ataque.distancia || ''} />,
    "magia": <GiMoebiusTrefoil className="text-white text-2xl cursor-help" title={ti.tipo_ataque.magia || ''} />
  };

  const tipoAtaqueCircleClass = {
    "distancia": "bg-red-600",
    "cuerpo": "bg-orange-500",
    "magia": "bg-blue-600"
  };

  const traducirClaveConNumero = (clave, base, detalles) => {
    const match = clave.match(/^([A-Z_]+)\s*(\d+)$/);
    if (match) {
      const nombre = match[1]; // ej. "HEMORRAGIA"
      const numero = match[2]; // ej. "2"
      const claveGeneral = `${nombre}_X`;
      const texto = base[claveGeneral]?.replace('{x}', numero) || clave;
      const detalle = detalles[claveGeneral]?.replace('{x}', numero) || '';
      return { claveGeneral, texto, detalle };
    }
  
    return { claveGeneral: clave, texto: base[clave] || clave, detalle: detalles[clave] || '' };
  };

  const clavesRosa = ['SANGUINARIO', 'REGENERACION_X'];
  const clavesAzul = ['MENTALISMO_X', 'PSIQUICO_X'];

  const mostrarAccionesCapacidad = (capacidades, tt, tte, ti) => {
    if (!Array.isArray(capacidades) || capacidades.length === 0) return null;
  
    // Agrupar acciones por ";"
    const acciones = [];
    let actual = [];
  
    capacidades.forEach(clave => {
      if (clave === ';') {
        if (actual.length > 0) {
          acciones.push(actual);
          actual = [];
        }
      } else if (![':', ',', '.'].includes(clave)) {
        actual.push(clave);
      }
    });
  
    if (actual.length > 0) {
      acciones.push(actual);
    }
  
    return (
      <div className="flex items-start gap-2 mt-1">
        <GiRunningNinja className="text-green-700 mt-1 text-2xl cursor-help" title={ti.capacidades || ''} />
        <div className="flex flex-col gap-1">
          {acciones.map((accion, index) => (
            <div key={`accion-${index}`} className="flex items-start gap-2">
              <span className="text-xl text-gray-600">{numeroIconos[index] || `${index + 1}.`}</span>
              <div className="flex flex-wrap gap-2">
                {accion.map((clave, idx) => {
                  const { claveGeneral, texto, detalle } = traducirClaveConNumero(clave, tt, tte);
                  const classColor = clavesRosa.includes(claveGeneral)
                    ? 'text-pink-500 font-semibold'
                    : clavesAzul.includes(claveGeneral)
                      ? 'text-blue-500 font-semibold'
                      : '';
  
                  return (
                    <span key={clave + idx} className={`inline-flex items-center gap-1 mr-2 ${classColor}`}>
                      {texto}
                      {detalle && (
                        <FiInfo
                          title={detalle}
                          className="text-gray-500 hover:text-gray-800 cursor-help"
                        />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className={`${bgColorMap[color] || ''} rounded-lg shadow-lg w-full max-w-xl relative border-4 ${borderColorMap[color] || ''}`}>
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-black bg-red-600 hover:bg-red-700 text-xl rounded-full font-bold"
          aria-label="Cerrar modal"
        >
          X
        </button>

        {/* Botón eliminar */}
        {onDelete && (
          <button
            onClick={() => onDelete(uuid)}
            className="absolute top-2 left-2 text-white bg-red-600 hover:bg-red-700 rounded-full px-2 py-1 text-xs"
          >
            🗑 {ti.remove}
          </button>
        )}

        <div className="flex flex-col gap-1 items-center p-6">

          {/* Nombre como título */}
          <h2 className={`text-2xl font-bold text-center text-white px-1 py-0 rounded ${textBgColorMap[color] || ''} ${categoryTextGlowMap[categoria] || ''}`}>
            {te[id]}
          </h2>

          {/* Categoría y comportamiento */}
          <div className="flex gap-1 text-sm">
            {categoria && (
              <span className={`${textBgColorMap[color] || ''} ${categoryTextGlowMap[categoria] || ''}`}>
                {tc[categoria] || categoria}:
              </span>
            )}
            {comportamiento && (
              <span className={`italic ${textBgColorMap[color] || ''} ${categoryTextGlowMap[categoria] || ''}`}>
                {tb[comportamiento] || comportamiento}
              </span>
            )}
          </div>

          {/* Imagen y stats */}
          <div className="flex w-full items-center gap-1 mt-2">
            <img
              src={imagen}
              alt={name}
              className={`w-32 h-32 object-cover rounded border-2 ${borderColorMap[color] || ''}`}
            />
            <div className={`flex-1 grid grid-cols-1 gap-1 text-gray-800 font-semibold text-sm bg-gray-200 rounded-lg`}>
              {/* Vida + Movimiento + Ataque en la misma línea */}
              <div className="flex items-center text-center gap-4">
                <div className="flex items-center gap-2" >
                  <GiHealthPotion className="text-red-600 text-2xl cursor-help" title={ti.health || ''}/>
                  {vidaLocal} / {vidaMax}
                </div>
                <span className="flex items-center gap-1">
                  <GiSteeltoeBoots className="text-blue-600 text-2xl cursor-help" title={ti.movement || ''} />
                  {movimiento}
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={`w-7 h-7 flex items-center justify-center rounded-full border-2 border-white ${
                      tipoAtaqueCircleClass[tipo_ataque] || "bg-gray-500"
                    }`}
                    title={ti.tipo_ataque?.label || ''}
                  >
                    {tipoAtaqueIconMap[tipo_ataque] || (
                      <GiSwordClash className="text-white text-lg" />
                    )}
                  </span>
                  {ataque}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <GiShieldReflect className="text-purple-700 mt-1 text-2xl cursor-help" title={ti.inmunidad || ''} />
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(inmunidad) && inmunidad.length > 0
                    ? inmunidad.map((clave, idx) => (
                        <span key={clave} className="inline-flex items-center gap-1 mr-2">
                          {tt[clave] || clave}
                          <FiInfo
                            title={tte[clave] || ''}
                            className="text-gray-500 hover:text-gray-800 cursor-help"
                          />
                        </span>
                      ))
                    : tt.none}
                </div>
              </div>
              {/* Capacidades */}
              {mostrarAccionesCapacidad(capacidades, tt, tte, ti)}
              
            </div>
          </div>

            {/* Barra de vida */}
            <div className="w-full relative h-5">
              <div className="absolute inset-0 flex items-center justify-center text-white text-[0.65rem] font-bold z-10">
                {vidaLocal} / {vidaMax}
              </div>
              <div className="w-full h-full bg-red-900 rounded">
                <div
                  className="h-full bg-red-500 rounded"
                  style={{ width: `${(vidaLocal / vidaMax) * 100}%` }}
                />
              </div>
            </div>

            {/* Vida botones + / - */}
            <div className="flex items-center gap-6 mt-1">
              <button
                onClick={() => handleVidaChange(-1)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                −
              </button>
              <button
                onClick={() => handleVidaChange(1)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                +
              </button>
            </div>
          
        </div>
      </div>
    </div>
  );
};

