import type { Sponsor } from "./types";

// Auspiciadores oficiales registrados en el estado base de useStore().
export const sponsors: Sponsor[] = [
  {
    id: "sp-obident",
    name: "Clínica Dental Obident",
    logo_url: "/obident_mejorado.png",
    website_url: "https://www.instagram.com/clinicaobident?stkn=OWNyOGMwejBxNXd6",
    tier: "oro",
  },
  {
    id: "sp-glamen",
    name: "Cabañas Glamen",
    logo_url: "/logo-glamen.jpg",
    website_url: "https://www.instagram.com/cabanasglamen?stkn=MTlxYzFkaHkzNTNvYw==",
    tier: "oro",
  },
  {
    id: "sp-zeus-sport",
    name: "Zeus Sport",
    logo_url: "/zeus-sport.png",
    website_url: "https://www.instagram.com/zeussportzs/",
    tier: "plata",
  },
  {
    id: "sp-rigorer",
    name: "Rigorer",
    logo_url: "/rigorer.png",
    website_url: "https://www.instagram.com/rigorer_oficial/",
    tier: "plata",
  },
  {
    id: "sp-carolina",
    name: "Impresiones Carolina",
    logo_url: "/carolina.png",
    website_url: "",
    tier: "plata",
  }
];
