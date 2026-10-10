export type MarbleColor =
  | "White"
  | "Black"
  | "Green"
  | "Red"
  | "Grey"
  | "Beige";

export type MarbleType =
  | "Calacatta"
  | "Carrara"
  | "Marquina"
  | "Onyx"
  | "Travertine"
  | "Verde"
  | "Rosso"
  | "Statuario";

export type DemoMarble = {
  id: string;
  name: string;
  color: MarbleColor;
  finish: "Polished" | "Honed" | "Leathered" | "Brushed";
  type: MarbleType;
  origin: string;
  description: string;
  image: string;
};

function marbleImage({
  base,
  accent,
  vein,
  fineVein,
}: {
  base: string;
  accent: string;
  vein: string;
  fineVein: string;
}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420">
      <defs>
        <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${base}"/>
          <stop offset=".48" stop-color="${accent}"/>
          <stop offset="1" stop-color="${base}"/>
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="8"/>
          <feColorMatrix type="saturate" values=".2"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 .18"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="640" height="420" fill="url(#base)"/>
      <rect width="640" height="420" filter="url(#grain)" opacity=".35"/>
      <path d="M-40 120 C120 80 170 220 320 180 C430 150 500 40 700 90" fill="none" stroke="${vein}" stroke-width="24" stroke-linecap="round" opacity=".46"/>
      <path d="M-30 285 C130 210 260 330 390 250 C520 170 560 240 690 185" fill="none" stroke="${fineVein}" stroke-width="10" stroke-linecap="round" opacity=".5"/>
      <path d="M80 -30 C170 85 130 160 240 250 C315 310 420 308 500 450" fill="none" stroke="${vein}" stroke-width="16" stroke-linecap="round" opacity=".32"/>
      <path d="M440 -20 C380 120 485 175 410 300 C375 355 300 365 245 445" fill="none" stroke="${fineVein}" stroke-width="7" stroke-linecap="round" opacity=".46"/>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const demoMarbles: DemoMarble[] = [
  {
    id: "MM-DEMO-1048",
    name: "Calacatta Oro",
    color: "White",
    finish: "Polished",
    type: "Calacatta",
    origin: "Carrara, Italy",
    description:
      "A demonstration Calacatta-style slab with warm gold veining over a soft white base, suitable for premium counters, feature walls, and showroom display mockups.",
    image: marbleImage({
      base: "#f7f4ea",
      accent: "#d8cfbc",
      vein: "#a88948",
      fineVein: "#5c5f60",
    }),
  },
  {
    id: "MM-DEMO-1186",
    name: "Carrara Bianco",
    color: "White",
    finish: "Honed",
    type: "Carrara",
    origin: "Tuscany, Italy",
    description:
      "A sample Carrara-inspired marble with a quiet white-grey palette and soft linear movement, shown here as demo catalogue data only.",
    image: marbleImage({
      base: "#f3f4f1",
      accent: "#d9dcda",
      vein: "#8d969b",
      fineVein: "#c3c7c7",
    }),
  },
  {
    id: "MM-DEMO-2163",
    name: "Nero Marquina",
    color: "Black",
    finish: "Polished",
    type: "Marquina",
    origin: "Markina, Spain",
    description:
      "A dramatic black marble sample with crisp light veining, useful for previewing high-contrast surfaces in the MarbleMatch catalogue interface.",
    image: marbleImage({
      base: "#09090a",
      accent: "#2d2d31",
      vein: "#f4f1e8",
      fineVein: "#a9a9a9",
    }),
  },
  {
    id: "MM-DEMO-2450",
    name: "Black Onyx",
    color: "Black",
    finish: "Leathered",
    type: "Onyx",
    origin: "Balochistan, Pakistan",
    description:
      "A dark onyx-inspired demonstration record with bronze-toned movement and a leathered finish for testing richer material presentations.",
    image: marbleImage({
      base: "#13100f",
      accent: "#4b4037",
      vein: "#c8aa75",
      fineVein: "#726557",
    }),
  },
  {
    id: "MM-DEMO-3307",
    name: "Verde Alpi",
    color: "Green",
    finish: "Polished",
    type: "Verde",
    origin: "Aosta Valley, Italy",
    description:
      "A green marble sample with alpine character, pale veining, and polished depth, included as demo data for catalogue and detail layouts.",
    image: marbleImage({
      base: "#11251f",
      accent: "#355c49",
      vein: "#d8e0cf",
      fineVein: "#7ea27e",
    }),
  },
  {
    id: "MM-DEMO-3722",
    name: "Verde Guatemala",
    color: "Green",
    finish: "Brushed",
    type: "Verde",
    origin: "Rajasthan, India",
    description:
      "A Verde Guatemala-inspired demonstration stone with saturated green movement and a brushed finish for sample filtering workflows.",
    image: marbleImage({
      base: "#0d352c",
      accent: "#1f6a58",
      vein: "#b7d2bc",
      fineVein: "#5e977d",
    }),
  },
  {
    id: "MM-DEMO-4721",
    name: "Rosso Levanto",
    color: "Red",
    finish: "Polished",
    type: "Rosso",
    origin: "Liguria, Italy",
    description:
      "A deep red marble example with creamy veins and polished contrast, intended for previewing statement stone records in the demo catalogue.",
    image: marbleImage({
      base: "#3a1014",
      accent: "#8c3431",
      vein: "#f2dcc0",
      fineVein: "#b98772",
    }),
  },
  {
    id: "MM-DEMO-5894",
    name: "Statuario Venato",
    color: "White",
    finish: "Polished",
    type: "Statuario",
    origin: "Carrara, Italy",
    description:
      "A Statuario-inspired sample with a bright field and measured grey veining, presented as demonstration data until real inventory is provided.",
    image: marbleImage({
      base: "#fbfaf6",
      accent: "#d6dadd",
      vein: "#59636e",
      fineVein: "#b8bec2",
    }),
  },
  {
    id: "MM-DEMO-6412",
    name: "Silver Travertine",
    color: "Grey",
    finish: "Honed",
    type: "Travertine",
    origin: "Denizli, Turkey",
    description:
      "A silver travertine-style demo record with a honed surface and layered grey-beige movement for testing neutral stone presentations.",
    image: marbleImage({
      base: "#b9b6ad",
      accent: "#6e6d68",
      vein: "#f0eee6",
      fineVein: "#8d877d",
    }),
  },
  {
    id: "MM-DEMO-7345",
    name: "Crema Marfil",
    color: "Beige",
    finish: "Brushed",
    type: "Travertine",
    origin: "Alicante, Spain",
    description:
      "A warm beige Crema Marfil-style demonstration stone with a brushed finish, useful for reviewing softer palette catalogue states.",
    image: marbleImage({
      base: "#efe1c4",
      accent: "#c5aa78",
      vein: "#fff5d8",
      fineVein: "#967c51",
    }),
  },
];

export const marbleColors = [
  "White",
  "Black",
  "Green",
  "Red",
  "Grey",
  "Beige",
] satisfies MarbleColor[];

export const marbleTypes = [
  "Calacatta",
  "Carrara",
  "Marquina",
  "Onyx",
  "Travertine",
  "Verde",
  "Rosso",
  "Statuario",
] satisfies MarbleType[];
