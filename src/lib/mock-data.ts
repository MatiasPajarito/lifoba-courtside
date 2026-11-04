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
    logo_url: "/zeus-sport.svg",
    website_url: "https://www.instagram.com/zeussportchile/",
    tier: "plata",
  },
  {
    id: "sp-rigorer",
    name: "Rigorer",
    logo_url: "/rigorer.svg",
    website_url: "https://www.instagram.com/rigorerchile/",
    tier: "plata",
  },
  {
    id: "sp-carolina",
    name: "Impresiones Carolina",
    logo_url: "/carolina.svg",
    website_url: "https://www.instagram.com/lifoba_/",
    tier: "plata",
  },
];
