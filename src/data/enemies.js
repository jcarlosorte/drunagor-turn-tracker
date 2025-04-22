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
  { id: "undead_king_boss", nombre: "Undead King Boss", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "base", imagen: undead_king_boss },
  { id: "skeleton_archer", nombre: "Skeleton Archer", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "base", imagen: skeleton_archer },
  { id: "dark_vampire", nombre: "Dark Vampire", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "base", imagen: dark_vampire },
  { id: "rotten_flesh", nombre: "Rotten Flesh", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "base", imagen: rotten_flesh },
  { id: "shadow_cultist", nombre: "Shadow Cultist", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "base", imagen: shadow_cultist },
  { id: "executioner", nombre: "Executioner", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "base", imagen: executioner },
  { id: "shadow_knight", nombre: "Shadow Knight", vida: 0, movimiento: 0, color: "negro", tipo: "enemigo", expansionId: "base", imagen: shadow_knight },
  { id: "abomination", nombre: "Abomination", vida: 0, movimiento: 0, color: "negro", tipo: "enemigo", expansionId: "base", imagen: abomination },
  { id: "lorelai_corrupted", nombre: "Lorelai", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", image: lorelai },
  { id: "elros_corrupted", nombre: "Elros", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", image: elros },
  { id: "jaheen_corrupted", nombre: "Jaheen", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", image: jaheen },
  { id: "maya_corrupted", nombre: "Maya", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", image: maya },
  { id: "vorn_corrupted", nombre: "Vorn", vida: 0, movimiento: 0, color: "hero", tipo: "enemigo", expansionId: "base", image: vorn },

  { id: "ravager", nombre: "Ravager", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "luccanor", imagen: ravager },
  { id: "lady_claw", nombre: "Lady Claw", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "luccanor", imagen: lady_claw },

  { id: "corrupted_farmer", nombre: "Corrupted Farmer", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "undead_dragon", imagen: corrupted_farmer },
  { id: "aralhezec", nombre: "Aral´hezec", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "undead_dragon", imagen: aralhezec },

  { id: "wermunggdir", nombre: "Wermunggdir", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "desert", imagen: wermunggdir },
  { id: "corrupted_worm", nombre: "Corrupted Worm", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "desert", imagen: corrupted_worm },

  { id: "shadow_pain", nombre: "Shadow Pain", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "dark_world", imagen: shadow_pain },
  { id: "shadow_guardian", nombre: "Shadow Guardian", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "dark_world", imagen: shadow_guardian },

  { id: "scout_darkness", nombre: "Scout of Darkness", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "monster_pack", imagen: scout_darkness },
  { id: "death_messenger", nombre: "Death Messenger", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "monster_pack", imagen: death_messenger },
  { id: "demon_lord", nombre: "Demon Lord", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "monster_pack", imagen: demon_lord },

  { id: "shadow_mistress", nombre: "Shadow Mistress", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "war_loot", imagen: shadow_mistress },
  { id: "walking_horror", nombre: "Walking Horror", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "war_loot", imagen: walking_horror },
  { id: "bone_reaper", nombre: "Bone Reaper", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "war_loot", imagen: bone_reaper },
  { id: "commander_twins", nombre: "Commander Twins", vida: 0, movimiento: 0, color: "comandante", tipo: "enemigo", expansionId: "war_loot", imagen: commander_twins },
  { id: "commander_thern", nombre: "Commander Thern", vida: 0, movimiento: 0, color: "comandante", tipo: "enemigo", expansionId: "war_loot", imagen: commander_thern },

  { id: "dream_titan", nombre: "Dream Titan", vida: 0, movimiento: 0, color: "shadow", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: dream_titan },
  { id: "chain_master", nombre: "Chain Master", vida: 0, movimiento: 0, color: "dark", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: chain_master },
  { id: "the_witch", nombre: "The Witch", vida: 0, movimiento: 0, color: "dark", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: the_witch },
  { id: "skeleton_knight", nombre: "Skeleton Knight", vida: 0, movimiento: 0, color: "dark", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: skeleton_knight },
  { id: "larua_mage", nombre: "Larua Mage", vida: 0, movimiento: 0, color: "shadow", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: larua_mage },
  { id: "war_horsemen", nombre: "War Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: war_horsemen },
  { id: "death_horsemen", nombre: "Death Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: death_horsemen },
  { id: "plague_horsemen", nombre: "Plague Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: plague_horsemen },
  { id: "famine_horsemen", nombre: "Famine Horsemen", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_adventures", imagen: famine_horsemen },

  { id: "soul_harvester", nombre: "Soul Harvester", vida: 0, movimiento: 0, color: "jefe", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: soul_harvester },
  { id: "gorgon_hexer", nombre: "Gorgon Hexer", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: gorgon_hexer },
  { id: "gremlin_horde", nombre: "Gremlin Horde", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: gremlin_horde },
  { id: "gorgoness_witch", nombre: "Gorgoness Witch", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: gorgoness_witch },
  { id: "grim_doctor", nombre: "Grim Doctor Fell Asteris", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: grim_doctor },
  { id: "nagian_hunter", nombre: "Nagian Hunter", vida: 0, movimiento: 0, color: "blanco", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: nagian_hunter },
  { id: "hellspawn_brute", nombre: "Hellspawn Brute", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: hellspawn_brute },
  { id: "night_stalker", nombre: "Night Stalker", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: night_stalker },
  { id: "fell_asteris", nombre: "Fell Asteris", vida: 0, movimiento: 0, color: "gris", tipo: "enemigo", expansionId: "apocalypse_awakenings", imagen: fell_asteris  },

  { id: "fallen_sisters", nombre: "Fallen Sisters", vida: 0, movimiento: 0, color: "comandante", tipo: "enemigo", expansionId: "apocalypse_sisters", imagen: fallen_sisters }
];

