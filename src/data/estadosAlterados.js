import derribo from "@/assets/assets_logo/derribo.png";
import marca from "@/assets/assets_logo/montaraz.png";
import sigilo from "@/assets/assets_logo/sigilo.png";
import aturdimiento from "@/assets/assets_logo/aturdimiento.png";
import lentitud from "@/assets/assets_logo/lentitud.png";
import hemorragia from "@/assets/assets_logo/hemorragia.png";
import veneno from "@/assets/assets_logo/veneno.png";
import intimidar from "@/assets/assets_logo/intimidar.png";
import quemadura from "@/assets/assets_logo/quemadura.png";
import escudo from "@/assets/assets_logo/escudo.png";

export const ESTADOS_ALTERADOS = [
  // condiciones redundantes
  { id: "DERRIBO_X", texto: "derribo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: derribo },
  { id: "MARCA_DE_MONTARAZ", texto: "marca de montaraz", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1, imagen: marca },
  { id: "SIGILO_X", texto: "sigilo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: sigilo },
  { id: "ATURDIMIENTO_X", texto: "aturdimiento", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: aturdimiento },
  { id: "LENTITUD_X", texto: "lentitud", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: lentitud },

  // condiciones acumulables
  { id: "HEMORRAGIA_X", texto: "hemorragia", reduce: "si", numReduce: 4, turno: "principio", daño: 1, max: 4, imagen: hemorragia },
  { id: "VENENO_X", texto: "veneno", reduce: "no", numReduce: 0, turno: "principio", daño: 1, max: 4, imagen: veneno },
  { id: "INTIMIDAR_X", texto: "intimidar", reduce: "si", numReduce: 4, turno: "final", daño: 0, max: 4, imagen: intimidar },
  { id: "QUEMADURA_X", texto: "quemadura", reduce: "si", numReduce: 1, turno: "principio", daño: 1, max: 4, imagen: quemadura },

  // recurso acumulable
  //{id: "FURIA", reduce:"", max: 4},
  //{id: "FRUTO_DE_VIDA", reduce:"", max: 4},
  //{id: "CONCENTRACION_X", reduce:"", max: 4},
  //{id: "KI", reduce:"", max: 4},
  { id: "ESCUDO_X", texto: "escudo", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 4, imagen: escudo }
];
