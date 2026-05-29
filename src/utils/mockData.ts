export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  specifications: { label: string; value: string }[];
  image_url: string;
  is_sterile: boolean;
  certifications: string[];
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cotton Bandage",
    slug: "cotton-bandage",
    category: "Bandages",
    description: "100% natural cotton, breathable and high absorbency. Ideal for securing wound dressings with maximum patient comfort.",
    image_url: "/assets/cotton-bandage.png",
    is_sterile: true,
    certifications: ["CE", "ISO 13485"],
    specifications: [
      { label: "Material", value: "100% Cotton" },
      { label: "Thread Count", value: "17 Threads/cm²" },
      { label: "Sterility", value: "Sterile EO (Ethylene Oxide)" },
      { label: "Available Widths", value: "5cm, 7.5cm, 10cm, 15cm" }
    ]
  },
  {
    id: "2",
    name: "Crepe Bandage",
    slug: "crepe-bandage",
    category: "Bandages",
    description: "Elastic support bandage for sprains, strains, and minor fractures. Extremely durable, washable, and reusable fabric.",
    image_url: "/assets/crepe-bandage.png",
    is_sterile: false,
    certifications: ["CE", "ISO 13485"],
    specifications: [
      { label: "Material", value: "90% Cotton, 10% Spandex" },
      { label: "Stretch Capability", value: "Heavy Stretch (up to 180%)" },
      { label: "Weight / Thickness", value: "75 gsm" },
      { label: "Available Lengths", value: "4m stretched" }
    ]
  },
  {
    id: "3",
    name: "Surgical Cotton Wool",
    slug: "surgical-cotton-wool",
    category: "Cotton Products",
    description: "Highly absorbent, chemical-free and impurities-free bleached cotton wool. Perfect for wound cleaning, padding, and liquid absorption.",
    image_url: "/assets/cotton-wool.png",
    is_sterile: false,
    certifications: ["CE", "ISO 13485", "BP Standards"],
    specifications: [
      { label: "Material", value: "100% Bleached Cotton" },
      { label: "Absorbency Speed", value: "Less than 10 seconds" },
      { label: "Purity Check", value: "Optical brightener & starch free" },
      { label: "Packaging Sizes", value: "100g, 250g, 500g rolls" }
    ]
  },
  {
    id: "4",
    name: "Absorbent Cotton Gauze",
    slug: "absorbent-cotton-gauze",
    category: "Gauze Products",
    description: "Premium medical cotton gauze conforming to European Pharmacopoeia (BP) standards. Soft and highly absorbent fabric layout.",
    image_url: "/assets/gauze.png",
    is_sterile: true,
    certifications: ["CE", "ISO 13485"],
    specifications: [
      { label: "Material", value: "100% Cotton Gauze" },
      { label: "Ply & Layers", value: "8-ply, 12-ply, 16-ply" },
      { label: "Mesh Size Density", value: "19x15 threads or 20x12 threads" },
      { label: "Sterility Formats", value: "Sterile or Non-Sterile packs available" }
    ]
  },
  {
    id: "5",
    name: "Absorbent Cotton Lint",
    slug: "absorbent-cotton-lint",
    category: "Cotton Products",
    description: "Soft, highly flexible cotton lint material raised/napped on one side. Specially designed for sensitive skin, burns, and ointment dressing applications.",
    image_url: "/assets/lint.png",
    is_sterile: false,
    certifications: ["CE", "ISO 13485"],
    specifications: [
      { label: "Material", value: "100% Cotton Lint" },
      { label: "Napped Raised Layer", value: "Single side raised nap structure" },
      { label: "Primary Application", value: "Ointment application and burn dressing" },
      { label: "Standard Weights", value: "100g, 500g packages" }
    ]
  }
];
