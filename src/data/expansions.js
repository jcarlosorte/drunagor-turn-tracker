// src/data/expansions.js
import baseImg from '@/assets/expansions/base.jpg';
import luccanorImg from '@/assets/expansions/luccanor.jpg';
import dragonImg from '@/assets/expansions/dragon.jpg';
import desiertoImg from '@/assets/expansions/desierto.jpg';
import mundoImg from '@/assets/expansions/mundo-sombrio.jpg';
import handurielImg from '@/assets/expansions/handuriel.jpg';
import iraImg from '@/assets/expansions/Ira.jpg';
import monstruos1Img from '@/assets/expansions/monstruos1.jpg';
import botinesImg from '@/assets/expansions/botines.jpg';
import apocalypseImg from '@/assets/expansions/apocalypse.png';
import heroPackImg from '@/assets/expansions/hero-pack.png';
import awakeningsImg from '@/assets/expansions/awakenings.png';
import sistersImg from '@/assets/expansions/sisters.png';

export const EXPANSIONS = [
  {
    id: "base",
    nombre: "Crónicas de Drunagor (Juego Base)",
    imagen: baseImg,
    añade: "ambos",
  },
  {
    id: "luccanor",
    nombre: "La Ruina de Luccanor",
    imagen: luccanorImg,
    añade: "ambos",
  },
  {
    id: "dragon",
    nombre: "El ascenso del Dragón no muerto",
    imagen: dragonImg,
    añade: "enemigos",
  },
  {
    id: "desierto",
    nombre: "Desierto Avernal",
    imagen: desiertoImg,
    añade: "ambos",
  },
  {
    id: "mundo-sombrio",
    nombre: "El Mundo Sombrío",
    imagen: mundoImg,
    añade: "ambos",
  },
  {
    id: "handuriel",
    nombre: "Handuriel",
    imagen: handurielImg,
    añade: "héroes",
  },
  {
    id: "Ira",
    nombre: "Señor de la Ira",
    imagen: iraImg,
    añade: "héroes",
  },
  {
    id: "monstruos1",
    nombre: "Pack de Monstruos Nº1",
    imagen: monstruos1Img,
    añade: "enemigos",
  },
  {
    id: "botines",
    nombre: "Botines de Guerra",
    imagen: botinesImg,
    añade: "ambos",
  },
  {
    id: "apocalypse",
    nombre: "Apocalypse Adventures",
    imagen: apocalypseImg,
    añade: "ambos",
  },
  {
    id: "hero-pack",
    nombre: "Hero Pack #1",
    imagen: heroPackImg,
    añade: "héroes",
  },
  {
    id: "Awakenings",
    nombre: "Apocalypse Awakenings",
    imagen: awakeningsImg,
    añade: "ambos",
  },
  {
    id: "sisters",
    nombre: "Apocalypse - The Fallen Sisters",
    imagen: sistersImg,
    añade: "enemigos",
  }
];
