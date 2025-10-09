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
import sanar from "@/assets/assets_logo/sanar.png";
import tiempo from "@/assets/assets_logo/tiempo.png";
import grande from "@/assets/assets_logo/grande.png";
import evento from "@/assets/assets_logo/evento.png";

export const ESTADOS_ALTERADOS = [
  // condiciones redundantes
  { id: "DERRIBO_I", texto: "derribo", accion: "derribo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: derribo, mostrar: "si", prevenible: "si" },
  { id: "MARCA_DE_MONTARAZ", texto: "marca", accion: "marca", reduce: "no", numReduce: 0, turno: "", daño: 0, max: 1, imagen: marca, mostrar: "si", prevenible: "si" },
  { id: "SIGILO_I", texto: "sigilo", accion: "sigilo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: sigilo, mostrar: "si", prevenible: "si" },
  { id: "ATURDIMIENTO_I", texto: "aturdimiento", accion: "aturdimiento", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: aturdimiento, mostrar: "si", prevenible: "si" },
  { id: "LENTITUD_I", texto: "lentitud", accion: "lentitud", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 1, imagen: lentitud, mostrar: "si", prevenible: "si" },

  // condiciones acumulables
  { id: "HEMORRAGIA_I", texto: "hemorragia", accion: "hemorragia", reduce: "si", numReduce: 4, turno: "principio", daño: 1, max: 4, imagen: hemorragia, mostrar: "si", prevenible: "no" },
  { id: "VENENO_I", texto: "veneno", accion: "veneno", reduce: "no", numReduce: 0, turno: "principio", daño: 1, max: 4, imagen: veneno, mostrar: "si", prevenible: "no" },
  { id: "INTIMIDAR_I", texto: "intimidar", accion: "intimidar", reduce: "si", numReduce: 4, turno: "final", daño: 0, max: 4, imagen: intimidar, mostrar: "si", prevenible: "si" },
  { id: "QUEMADURA_I", texto: "quemadura", accion: "quemadura", reduce: "si", numReduce: 1, turno: "principio", daño: 1, max: 4, imagen: quemadura, mostrar: "si", prevenible: "no" },

  // recurso acumulable
  //{id: "FURIA", reduce:"", max: 4},
  //{id: "FRUTO_DE_VIDA", reduce:"", max: 4},
  //{id: "CONCENTRACION_X", reduce:"", max: 4},
  //{id: "KI", reduce:"", max: 4},
  { id: "ESCUDO", texto: "escudo", accion: "escudo", reduce: "no", numReduce: 0, turno: "principio", daño: 0, max: 4, imagen: escudo, mostrar: "si", prevenible: "si" },
  { id: "TIEMPO", texto: "tiempo", accion: "tiempo", reduce: "si", numReduce: 1, turno: "principio", daño: 0, max: 4, imagen: tiempo, mostrar: "no", prevenible: "si" }
];

export const INMUNIDADES = [
  // condiciones redundantes
  { id: "DERRIBO_I", imagen: derribo },
  { id: "SIGILO_I", imagen: sigilo },
  { id: "ATURDIMIENTO_I", imagen: aturdimiento },
  { id: "LENTITUD_I", imagen: lentitud },
  { id: "HEMORRAGIA_I", imagen: hemorragia },
  { id: "VENENO_I", texto: "veneno", imagen: veneno },
  { id: "INTIMIDAR_I", imagen: intimidar },
  { id: "QUEMADURA_I", imagen: quemadura },
  { id: "GRANDE", imagen: grande }
];

export const CAPACIDADES_ACTIVADAS = [
  { id: "REGENERACION", max: 0, imagen: sanar },
  { id: "MANIFESTAR", max: 0, imagen: veneno },
  { id: "HASTA", max: 0, imagen: sanar },
  { id: "SANAR", max: 0, imagen: sanar },
  { id: "ESCUDO", max: 4, imagen: escudo }
];

export const OTROS = [
  { id: "evento", max: 0, imagen: evento }
];
