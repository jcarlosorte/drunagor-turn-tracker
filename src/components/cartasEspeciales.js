export const CARTAS_COMANDANTE = [
  {
    id: 'cmd_1',
    nombre: 'cmd_1',
    rune: 'azul',
    runePosition: 'arriba',
    capacidades: ["EL COMANDANTE GANA ESCUDO {X}. LAS FICHAS DE ESCUDO RECIBIDAS ASÍ PUEDEN SUPERAR EL MÁXIMO DE 4. LUEGO, SI UN HÉROE ESTÁ ADYACENTE AL COMANDANTE, ESTE ATAQUE INFLINGE DAÑO {X} AL MÁS FUERTE DE ELLOS"]
  },
  {
    id: 'cmd_2',
    nombre: 'cmd_2',
    rune: 'verde',
    runePosition: 'arriba',
    capacidades: ["EL OBJETIVO DE ESTE ATAQUE ES EL HÉROE MÁS FUERTE A ALCANCE 1 DEL COMANDANTE. LE INFLINGE DAÑO {X} Y VENENO {X}"]
  },
  {
    id: 'cmd_3',
    nombre: 'cmd_3',
    rune: 'gris',
    runePosition: 'arriba',
    capacidades: ["EL COMANDANTE SALTA A UNA CASILLA A ELECCIÓN DEL LÍDER DEL GRUPO, ADYACENTE AL HÉROE MÁS FUERTE. APARTA A CUAQUIER PERSONAJE EN DONDE ATERRICE. LUEGO, ESTE ATAQUE INFLINGE DAÑO {X} NO PREVENIBLE AL HÉROE MÁS FUERTE."]
  },
   {
    id: 'cmd_4',
    nombre: 'cmd_4',
    rune: 'gris',
    runePosition: 'abajo',
    capacidades: ["PASIVA: EL COMANDANTE GANA DAÑO BÁSICO +{X} MIENTRAS NO TENGA OTRO MOSNTRUO ADYACENTE."]
  },
   {
    id: 'cmd_5',
    nombre: 'cmd_5',
    rune: 'rojo',
    runePosition: 'abajo',
    capacidades: ["EL OBJETIVO DE ESTE ATAQUE ES EL HÉROE MÁS FUERTE ADYACENTE AL COMANDANTE (SI LO HAY). LE INFLINGE DAÑO {X} Y HEMORRAGIA {X}."]
  },
   {
    id: 'cmd_6',
    nombre: 'cmd_6',
    rune: 'naranja',
    runePosition: 'arriba',
    capacidades: ["PASIVA: EL COMANDANTE GANA INMUNIDAD A QUEMADURA.", "ATAQUE: EL OBJETIVO DE ESTE ATAQUE SON LOS 2 HÉROES MÁS DÉBILES A CUAQUIER ALCANCE. LES INFLINGE QUEMADURA {X} Y LENTITUD."]
  },
  {
    id: 'cmd_7',
    nombre: 'cmd_7',
    rune: 'azul',
    runePosition: 'abajo',
    capacidades: ["ESTE ATAQUE ELIGE COMO OBJETIVO A LOS 2 HÉROES MÁS CORRUPTOS A CUALQUIER ALCANCE Y LES INFLINGE DAÑO {X}."]
  },
   {
    id: 'cmd_8',
    nombre: 'cmd_8',
    rune: 'verde',
    runePosition: 'abajo',
    capacidades: ["EL COMANDANTE SANA {2*X}. LA SALUD QUE GANE ASÍ PUEDE SUPERAR LA SALUD MÁXIMA"]
  },
   {
    id: 'cmd_9',
    nombre: 'cmd_9',
    rune: 'naranja',
    runePosition: 'abajo',
    capacidades: ["ACTIVA EL COMANDANTE. LUEGO ACTÍVALO UNA VEZ MÁS SI HAY 5 O MÁS RUNAS NARANJAS EN EL MEDIDOR DE INICIATIVA."]
  },
   {
    id: 'cmd_10',
    nombre: 'cmd_10',
    rune: 'rojo',
    runePosition: 'arriba',
    capacidades: ["EL OBJETIVO DE ESTE ATAQUE SON LOS 2 HÉROES MÁS CANSADOS A CUALQUIER ALCANCE. LES INFLINGE DAÑO 2, INTIMIDAR {X} Y FATIGA {X}."]
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
