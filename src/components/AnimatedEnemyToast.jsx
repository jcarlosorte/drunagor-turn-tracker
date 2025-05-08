// components/AnimatedEnemyToast.jsx
import { motion } from 'framer-motion';
import { GiBullyMinion } from 'react-icons/gi';

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
 
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-2 rounded-xl shadow-xl font-semibold px-4 py-2 ${bgClass}`}
    >
      <GiBullyMinion className={`text-2xl ${iconClass}`} />
       <div className="text-sm leading-tight space-y-1">
        <div className="font-bold">{name}</div>
        <div>{categoria} — {com} </div>
        <div className="text-xs opacity-80">{translatedExpansion}</div>
      </div>
    </motion.div>
  );
}
