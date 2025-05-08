// components/AnimatedEnemyToast.jsx
import { motion } from 'framer-motion';
import { GiBullyMinion, GiHeartBeats, GiFootprint, GiBroadsword } from 'react-icons/gi';

export default function AnimatedEnemyToast({ enemyData, t }) {
 
  const bgClasses = {
    blanco: 'bg-white text-black',
    gris: 'bg-gray-600 text-white',
    negro: 'bg-black text-white',
    jefe: 'bg-red-500 text-white',
    blue: 'bg-blue-700 text-white',
    green: 'bg-green-700 text-white',
    comandante: 'bg-yellow-600 text-black',
    purple: 'bg-purple-500 text-white',
  };

  const iconColorClasses = {
    blanco: 'text-black',
    gris: 'text-gray-300',
    negro: 'text-white',
    jefe: 'text-red-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    comandante: 'text-yellow-400',
    purple: 'text-purple-400',
  };

  const bgClass = bgClasses[enemyData.color] || 'bg-black text-white';
  const iconClass = iconColorClasses[enemyData.color] || 'text-white';

  const name = t?.enemies?.[enemyData.id] ;
  const life = enemyData.vida ;
  const category = t?.enemies?.categoria[enemyData.categoria] ;
  const com = t?.trackerSelect?.comportamientos[enemyData.comportamiento] ;
  const image = enemyData.imagen ;
  const move = enemyData.movimiento ;
  const attack = enemyData.ataque ;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-4 rounded-xl shadow-2xl font-semibold px-6 py-4 text-base ${bgClass}`}
    >
      <img
         src={image}
         alt={name}
         className="w-20 h-20 object-cover rounded-md border border-white shadow-md"
       />
       <GiBullyMinion className={`text-2xl ${iconClass}`} />
        <div className="text-sm leading-tight space-y-1">
         <div className="font-bold">{name}</div>
         <div>{category} — {com}</div>
       <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><GiHeartBeats /> {life}</span>
          <span className="flex items-center gap-1"><GiFootprint /> {move}</span>
          <span className="flex items-center gap-1"><GiBroadsword /> {attack}</span>
        </div>
       </div>
    </motion.div>
  );
}
