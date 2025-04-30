// @/data/enemies.js
// Blancos
import corrupted_farmer from "@/assets/enemies/CorruptedFarmer.png";
import ravager from "@/assets/enemies/Ravager.png";
import scout_darkness from "@/assets/enemies/ScoutOfDarkness.png";
import shadow_cultist from "@/assets/enemies/ShadowCultist.png";
import shadow_mistress from "@/assets/enemies/ShadowMistress.png";
import shadow_pain from "@/assets/enemies/ShadowPain.png";
import skeleton_archer from "@/assets/enemies/SkeletonArcher.png";
import walking_horror from "@/assets/enemies/WalkingHorror.png";
// Grises
import bone_reaper from "@/assets/enemies/BoneReaper.png";
import corrupted_worm from "@/assets/enemies/CorruptedWorm.png";
import death_messenger from "@/assets/enemies/DeathMessenger.png";
import executioner from "@/assets/enemies/Executioner.png";
import lady_claw from "@/assets/enemies/LadyClaw.png";
import rotten_flesh from "@/assets/enemies/RottenFlesh.png";
import shadow_guardian from "@/assets/enemies/ShadowGuardian.png";
import dark_vampire from "@/assets/enemies/ShadowVampire.png";
// Negros
import abomination from "@/assets/enemies/Abomination.png";
import shadow_knight from "@/assets/enemies/ShadowKnight.png";
// Dorados/Comandantes
import commander_thern from "@/assets/enemies/Thern.png";
import commander_twins from "@/assets/enemies/Twin.png";
// Jefes
import demon_lord from "@/assets/enemies/DemonLord.png";
import undead_king_boss from "@/assets/enemies/Lich.png";
import aralhezec from "@/assets/enemies/Dragon.png";
import wermunggdir from "@/assets/enemies/Wurm.png";

// Apocalipsis
import skeleton_knight from "@/assets/enemies/skeleton_knight.png";
import the_witch from "@/assets/enemies/the_witch.png";
import dream_titan from "@/assets/enemies/dream_titan.png";
import chain_master from "@/assets/enemies/chain_master.png";
import larua_mage from "@/assets/enemies/larua_mage.png";
import war_horsemen from "@/assets/enemies/war_horsemen.png";
import death_horsemen from "@/assets/enemies/death_horsemen.png";
import plague_horsemen from "@/assets/enemies/plague_horsemen.png";
import famine_horsemen from "@/assets/enemies/famine_horsemen.png";
import gremlin_horde from "@/assets/enemies/gremlin_horde.png";
import gorgoness_witch from "@/assets/enemies/gorgoness_witch.png";
import grim_doctor from "@/assets/enemies/grim_doctor.png";
import nagian_hunter from "@/assets/enemies/nagian_hunter.png";
import hellspawn_brute from "@/assets/enemies/hellspawn_brute.png";
import night_stalker from "@/assets/enemies/night_stalker.png";
import gorgon_hexer from "@/assets/enemies/gorgon_hexer.png";
import soul_harvester from "@/assets/enemies/soul_harvester.png";
import fell_asteris from "@/assets/enemies/FellAsteris.png";
import fallen_sisters from "@/assets/enemies/fallen_sisters.png";
//heroes caidos
import lorelai from "@/assets/heroes/Lorelai.png";
import elros from "@/assets/heroes/Elros.png";
import jaheen from "@/assets/heroes/Jaheen.png";
import maya from "@/assets/heroes/Maya.png";
import vorn from "@/assets/heroes/Vorn.png";

export const ENEMIES = [
  { id: "undead_king_boss", nombre: "Undead King Boss", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "base", imagen: undead_king_boss, rune: "rojo", runePosition: "arriba", comportamiento: "jefe" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 15, movimiento: 5, ataque: 7, color: "blanco", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 18, movimiento: 5, ataque: 6, color: "blanco", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "estandar" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 12, movimiento: 5, ataque: 6, color: "blanco", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 15, movimiento: 5, ataque: 5, color: "blanco", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "estandar" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 9, movimiento: 4, ataque: 5, color: "blanco", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 12, movimiento: 4, ataque: 4, color: "blanco", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "estandar" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 6, movimiento: 4, ataque: 4, color: "blanco", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 9, movimiento: 4, ataque: 3, color: "blanco", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "azul", runePosition: "arriba", comportamiento: "estandar" },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 3, movimiento: 0, ataque: 0, color: "esbirro", categoria: "esbirro", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer, rune: "esbirro", runePosition: "esbirro" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 18, movimiento: 5, ataque: 4, color: "gris", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 24, movimiento: 6, ataque: 8, color: "gris", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "estandar" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 15, movimiento: 5, ataque: 3, color: "gris", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 20, movimiento: 6, ataque: 7, color: "gris", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "estandar" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 12, movimiento: 5, ataque: 2, color: "gris", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 16, movimiento: 5, ataque: 6, color: "gris", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "estandar" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 9, movimiento: 5, ataque: 1, color: "gris", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 12, movimiento: 5, ataque: 5, color: "gris", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "verde", runePosition: "arriba", comportamiento: "estandar" },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 0, movimiento: 0, ataque: 0, color: "gris", categoria: "comandante", tipo: "enemigo", expansionId: "base", imagen: dark_vampire, rune: "gris", runePosition: "arriba" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 24, movimiento: 4, ataque: 6, color: "gris", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "complejo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 24, movimiento: 3, ataque: 8, color: "gris", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 24, movimiento: 4, ataque: 6, color: "gris", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "estandar" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 20, movimiento: 4, ataque: 6, color: "gris", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "complejo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 20, movimiento: 3, ataque: 7, color: "gris", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 20, movimiento: 4, ataque: 5, color: "gris", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "estandar" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 16, movimiento: 3, ataque: 5, color: "gris", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "complejo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 16, movimiento: 2, ataque: 6, color: "gris", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 16, movimiento: 3, ataque: 4, color: "gris", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "estandar" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 12, movimiento: 3, ataque: 4, color: "gris", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "complejo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 12, movimiento: 2, ataque: 5, color: "gris", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 12, movimiento: 3, ataque: 3, color: "gris", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh, rune: "rojo", runePosition: "abajo", comportamiento: "estandar" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 18, movimiento: 5, ataque: 7, color: "blanco", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "complejo"  },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 18, movimiento: 4, ataque: 7, color: "blanco", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "alternativo"  },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 18, movimiento: 4, ataque: 7, color: "blanco", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "estandar" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 15, movimiento: 5, ataque: 6, color: "blanco", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "complejo" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 15, movimiento: 4, ataque: 6, color: "blanco", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 15, movimiento: 4, ataque: 6, color: "blanco", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "estandar" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 12, movimiento: 4, ataque: 5, color: "blanco", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "complejo" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 12, movimiento: 3, ataque: 5, color: "blanco", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 12, movimiento: 3, ataque: 5, color: "blanco", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "estandar" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 9, movimiento: 3, ataque: 4, color: "blanco", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "complejo" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 9, movimiento: 3, ataque: 4, color: "blanco", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 9, movimiento: 3, ataque: 4, color: "blanco", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist, rune: "rojo", runePosition: "arriba", comportamiento: "estandar" },
  { id: "executioner", nombre: "Executioner", vida: 30, movimiento: 5, ataque: 6, color: "gris", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "verde", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "executioner", nombre: "Executioner", vida: 24, movimiento: 5, ataque: 7, color: "gris", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "verde", runePosition: "abajo", comportamiento: "estandar" },
  { id: "executioner", nombre: "Executioner", vida: 25, movimiento: 5, ataque: 5, color: "gris", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "gris", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "executioner", nombre: "Executioner", vida: 20, movimiento: 5, ataque: 6, color: "gris", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "verde", runePosition: "abajo", comportamiento: "estandar" },
  { id: "executioner", nombre: "Executioner", vida: 20, movimiento: 4, ataque: 4, color: "gris", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "verde", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "executioner", nombre: "Executioner", vida: 16, movimiento: 4, ataque: 5, color: "gris", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "verde", runePosition: "abajo", comportamiento: "estandar" },
  { id: "executioner", nombre: "Executioner", vida: 15, movimiento: 4, ataque: 3, color: "gris", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "verde", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "executioner", nombre: "Executioner", vida: 12, movimiento: 4, ataque: 4, color: "gris", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: executioner, rune: "verde", runePosition: "abajo", comportamiento: "estandar" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 30, movimiento: 3, ataque: 8, color: "negro", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "complejo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 24, movimiento: 4, ataque: 7, color: "negro", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 30, movimiento: 3, ataque: 7, color: "negro", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "estandar" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 25, movimiento: 3, ataque: 7, color: "negro", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "complejo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 20, movimiento: 4, ataque: 6, color: "negro", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 25, movimiento: 3, ataque: 6, color: "negro", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "estandar" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 20, movimiento: 2, ataque: 6, color: "negro", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "complejo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 16, movimiento: 3, ataque: 5, color: "negro", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 20, movimiento: 2, ataque: 5, color: "negro", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "estandar" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 15, movimiento: 2, ataque: 5, color: "negro", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "complejo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 12, movimiento: 3, ataque: 4, color: "negro", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "alternativo" },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 15, movimiento: 2, ataque: 4, color: "negro", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: shadow_knight, rune: "gris", runePosition: "arriba", comportamiento: "estandar" },
  { id: "abomination", nombre: "Abomination", vida: 30, movimiento: 3, ataque: 6, color: "negro", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "abomination", nombre: "Abomination", vida: 30, movimiento: 3, ataque: 8, color: "negro", categoria: "campeon", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "estandar" },
  { id: "abomination", nombre: "Abomination", vida: 25, movimiento: 3, ataque: 5, color: "negro", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "abomination", nombre: "Abomination", vida: 25, movimiento: 3, ataque: 7, color: "negro", categoria: "veterano", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "estandar" },
  { id: "abomination", nombre: "Abomination", vida: 20, movimiento: 2, ataque: 4, color: "negro", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "abomination", nombre: "Abomination", vida: 20, movimiento: 2, ataque: 6, color: "negro", categoria: "soldado", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "estandar" },
  { id: "abomination", nombre: "Abomination", vida: 15, movimiento: 2, ataque: 3, color: "negro", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "alternativo" },
  { id: "abomination", nombre: "Abomination", vida: 15, movimiento: 2, ataque: 5, color: "negro", categoria: "bisoño", tipo: "enemigo", expansionId: "base", imagen: abomination, rune: "gris", runePosition: "abajo", comportamiento: "estandar" },
  { id: "lorelai_corrupted", nombre: "Lorelai", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", imagen: lorelai, rune: "naranja", runePosition: "arriba" },
  { id: "elros_corrupted", nombre: "Elros", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", imagen: elros, rune: "gris", runePosition: "abajo" },
  { id: "jaheen_corrupted", nombre: "Jaheen", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", imagen: jaheen, rune: "verde", runePosition: "arriba" },
  { id: "maya_corrupted", nombre: "Maya", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", imagen: maya, rune: "azul", runePosition: "abajo" },
  { id: "vorn_corrupted", nombre: "Vorn", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", imagen: vorn, rune: "rojo", runePosition: "arriba" },

  { id: "ravager", nombre: "Ravager", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "luccanor", imagen: ravager, rune: "gris", runePosition: "abajo" },
  { id: "lady_claw", nombre: "Lady Claw", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "luccanor", imagen: lady_claw, rune: "naranja", runePosition: "arriba" },

  { id: "corrupted_farmer", nombre: "Corrupted Farmer", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "undead_dragon", imagen: corrupted_farmer, rune: "verde", runePosition: "abajo" },
  { id: "aralhezec", nombre: "Aral´hezec", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "undead_dragon", imagen: aralhezec, rune: "rojo", runePosition: "arriba" },

  { id: "wermunggdir", nombre: "Wermunggdir", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "desert", imagen: wermunggdir, rune: "azul", runePosition: "abajo" },
  { id: "corrupted_worm", nombre: "Corrupted Worm", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "desert", imagen: corrupted_worm, rune: "gris", runePosition: "arriba" },

  { id: "shadow_pain", nombre: "Shadow Pain", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "dark_world", imagen: shadow_pain, rune: "naranja", runePosition: "abajo" },
  { id: "shadow_guardian", nombre: "Shadow Guardian", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "dark_world", imagen: shadow_guardian, rune: "verde", runePosition: "arriba" },

  { id: "scout_darkness", nombre: "Scout of Darkness", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "monster_pack", imagen: scout_darkness, rune: "azul", runePosition: "abajo" },
  { id: "death_messenger", nombre: "Death Messenger", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "monster_pack", imagen: death_messenger, rune: "rojo", runePosition: "arriba" },
  { id: "demon_lord", nombre: "Demon Lord", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "monster_pack", imagen: demon_lord, rune: "gris", runePosition: "abajo" },

  { id: "shadow_mistress", nombre: "Shadow Mistress", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "war_loot", imagen: shadow_mistress, rune: "naranja", runePosition: "arriba" },
  { id: "walking_horror", nombre: "Walking Horror", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "war_loot", imagen: walking_horror, rune: "verde", runePosition: "abajo" },
  { id: "bone_reaper", nombre: "Bone Reaper", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "war_loot", imagen: bone_reaper, rune: "azul", runePosition: "arriba" },
  { id: "commander_twins", nombre: "Commander Twins", vida: 0, movimiento: 0, color: "comandante", tipo: "enemigo", expansionId: "war_loot", imagen: commander_twins, rune: "rojo", runePosition: "abajo" },
  { id: "commander_thern", nombre: "Commander Thern", vida: 0, movimiento: 0, color: "comandante", tipo: "enemigo", expansionId: "war_loot", imagen: commander_thern, rune: "gris", runePosition: "arriba" },

  { id: "dream_titan", nombre: "Dream Titan", vida: 0, movimiento: 0, color: "shadow", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: dream_titan, rune: "naranja", runePosition: "abajo" },
  { id: "chain_master", nombre: "Chain Master", vida: 0, movimiento: 0, color: "dark", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: chain_master, rune: "verde", runePosition: "arriba" },
  { id: "the_witch", nombre: "The Witch", vida: 0, movimiento: 0, color: "dark", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: the_witch, rune: "azul", runePosition: "abajo" },
  { id: "skeleton_knight", nombre: "Skeleton Knight", vida: 0, movimiento: 0, color: "dark", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: skeleton_knight, rune: "rojo", runePosition: "arriba" },
  { id: "larua_mage", nombre: "Larua Mage", vida: 0, movimiento: 0, color: "shadow", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: larua_mage, rune: "gris", runePosition: "abajo" },
  { id: "war_horsemen", nombre: "War Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: war_horsemen, rune: "rojo", runePosition: "arriba" },
{ id: "death_horsemen", nombre: "Death Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: death_horsemen, rune: "gris", runePosition: "abajo" },
{ id: "plague_horsemen", nombre: "Plague Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: plague_horsemen, rune: "verde", runePosition: "arriba" },
{ id: "famine_horsemen", nombre: "Famine Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: famine_horsemen, rune: "naranja", runePosition: "abajo" },

{ id: "soul_harvester", nombre: "Soul Harvester", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: soul_harvester, rune: "azul", runePosition: "arriba" },
{ id: "gorgon_hexer", nombre: "Gorgon Hexer", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: gorgon_hexer, rune: "verde", runePosition: "abajo" },
{ id: "gremlin_horde", nombre: "Gremlin Horde", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: gremlin_horde, rune: "naranja", runePosition: "arriba" },
{ id: "gorgoness_witch", nombre: "Gorgoness Witch", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: gorgoness_witch, rune: "rojo", runePosition: "abajo" },
{ id: "grim_doctor", nombre: "Grim Doctor Fell Asteris", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: grim_doctor, rune: "gris", runePosition: "arriba" },
{ id: "nagian_hunter", nombre: "Nagian Hunter", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: nagian_hunter, rune: "azul", runePosition: "abajo" },
{ id: "hellspawn_brute", nombre: "Hellspawn Brute", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: hellspawn_brute, rune: "rojo", runePosition: "arriba" },
{ id: "night_stalker", nombre: "Night Stalker", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: night_stalker, rune: "verde", runePosition: "abajo" },
{ id: "fell_asteris", nombre: "Fell Asteris", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: fell_asteris, rune: "naranja", runePosition: "arriba" },

{ id: "fallen_sisters", nombre: "Fallen Sisters", vida: 0, movimiento: 0, color: "comandante", tipo: "enemigo", expansionId: "apocalypse_sisters", imagen: fallen_sisters, rune: "azul", runePosition: "abajo" }
];

