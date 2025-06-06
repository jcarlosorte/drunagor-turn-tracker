export const CARTAS_COMANDANTE = [
  {
    id: 'cmd_1',
    nombre: 'cmd_1',
    rune: 'azul',
    runePosition: 'arriba',
    capacidades: 'cmd_1'
  },
  {
    id: 'cmd_2',
    nombre: 'cmd_2',
    rune: 'verde',
    runePosition: 'arriba',
    capacidades: 'cmd_2'
  },
  {
    id: 'cmd_3',
    nombre: 'cmd_3',
    rune: 'gris',
    runePosition: 'arriba',
    capacidades: 'cmd_3'
  },
   {
    id: 'cmd_4',
    nombre: 'cmd_4',
    rune: 'gris',
    runePosition: 'abajo',
    capacidades: 'cmd_4'
  },
   {
    id: 'cmd_5',
    nombre: 'cmd_5',
    rune: 'rojo',
    runePosition: 'abajo',
    capacidades: 'cmd_5'
  },
   {
    id: 'cmd_6',
    nombre: 'cmd_6',
    rune: 'naranja',
    runePosition: 'arriba',
    capacidades: 'cmd_6'
  },
  {
    id: 'cmd_7',
    nombre: 'cmd_7',
    rune: 'azul',
    runePosition: 'abajo',
    capacidades: 'cmd_7'
  },
   {
    id: 'cmd_8',
    nombre: 'cmd_8',
    rune: 'verde',
    runePosition: 'abajo',
    capacidades: 'cmd_8'
  },
   {
    id: 'cmd_9',
    nombre: 'cmd_9',
    rune: 'naranja',
    runePosition: 'abajo',
    capacidades: 'cmd_9'
  },
   {
    id: 'cmd_10',
    nombre: 'cmd_10',
    rune: 'rojo',
    runePosition: 'arriba',
    capacidades: 'cmd_10'
  }
];

export const CARTAS_JEFE = [
  {
    id: 'boss_1',
    nombre: 'Ascenso del Terror',
    rune: 'gris',
    runePosition: 'arriba',
    idJefe: 'undead_king_boss',
    encuentro: 'fortaleza sombría',
    capacidades: ['INMUNIDAD_DAÑO', 'GRITO_TERROR']
  },
  {
    id: 'boss_2',
    nombre: 'Domador de Sombras',
    rune: 'naranja',
    runePosition: 'abajo',
    idJefe: 'shadow_knight',
    encuentro: 'torre de los lamentos',
    capacidades: ['SOMBRA_MÓVIL', 'FATIGA_3']
  },
  // ... hasta 10 cartas
];

export const CARTAS_HEROE_CAIDO = [
  {
    id: 'fallen_1',
    nombre: 'Caídos de Elros',
    rune: 'verde',
    runePosition: 'arriba',
    capacidades: ['SOMBRA_ATAQUE', 'BLOQUEO_2']
  },
  {
    id: 'fallen_2',
    nombre: 'Venganza de Lorelai',
    rune: 'rojo',
    runePosition: 'abajo',
    capacidades: ['FURIA_FINAL', 'DAÑO_AREA']
  }
];
