// Exact 16 Categories & Subcategories from MENUmitrashop.pdf
// Audited product mapping: only verified products assigned to true categories & subcategories.

export const pdfCategories = [
  {
    id: 1,
    name: "Development Boards",
    slug: "development-boards",
    aliases: ["boards-iot"],
    image: "photo-1518770660439-4636190af475",
    description: "Industry-standard development platforms including Raspberry Pi, Arduino-compatible systems, ESP/NodeMCU Wi-Fi boards, and STM microcontrollers.",
    productIds: ["raspberry-pi", "arduino-starter", "esp32-board"],
    subcategories: [
      { name: "Raspberry Pi", slug: "raspberry-pi", productIds: ["raspberry-pi"] },
      { name: "Boards Compatible with Arduino", slug: "boards-compatible-with-arduino", productIds: ["arduino-starter"] },
      { name: "NodeMCU / ESP", slug: "nodemcu-esp", productIds: ["esp32-board"] },
      { name: "STM", slug: "stm", productIds: [] },
    ],
  },
  {
    id: 2,
    name: "Sensor Modules",
    slug: "sensor-modules",
    aliases: ["sensors"],
    image: "photo-1519389950473-47ba0277781c",
    description: "High-precision sensing modules for environmental monitoring, motion detection, distance measurement, optical analysis, and IoT data gathering.",
    productIds: ["sensor-pack", "smart-home-sensor"],
    subcategories: [
      { name: "Color Sensors", slug: "color-sensors", productIds: [] },
      { name: "Current Sensors", slug: "current-sensors", productIds: [] },
      { name: "Distance Sensors", slug: "distance-sensors", productIds: [] },
      { name: "Fingerprint Sensors", slug: "fingerprint-sensors", productIds: [] },
      { name: "Flex Sensors", slug: "flex-sensors", productIds: [] },
      { name: "Flow Sensors", slug: "flow-sensors", productIds: [] },
      { name: "Gas Sensors", slug: "gas-sensors", productIds: [] },
      { name: "Hall/Magnet Sensors", slug: "hall-magnet-sensors", productIds: [] },
      { name: "Heartbeat Sensors", slug: "heartbeat-sensors", productIds: [] },
      { name: "Humidity Sensors", slug: "humidity-sensors", productIds: [] },
      { name: "Temperature/Humidity Sensors", slug: "temperature-humidity-sensors", productIds: ["sensor-pack"] },
      { name: "IR/Motion Sensors", slug: "ir-motion-sensors", productIds: ["sensor-pack", "smart-home-sensor"] },
      { name: "Light Sensors", slug: "light-sensors", productIds: ["sensor-pack"] },
      { name: "Motion/Tilt Sensors", slug: "motion-tilt-sensors", productIds: [] },
      { name: "PH Sensors", slug: "ph-sensors", productIds: [] },
      { name: "Pressure Sensors", slug: "pressure-sensors", productIds: [] },
      { name: "Accelerometer and Gyrometer Sensors", slug: "accelerometer-and-gyrometer-sensors", productIds: [] },
      { name: "Proximity Sensors", slug: "proximity-sensors", productIds: [] },
      { name: "Rain/Soil Moisture Sensors", slug: "rain-soil-moisture-sensors", productIds: [] },
      { name: "Soil Sensors", slug: "soil-sensors", productIds: [] },
      { name: "Sound Sensor", slug: "sound-sensor", productIds: ["smart-home-sensor"] },
      { name: "Touch Sensors", slug: "touch-sensors", productIds: [] },
      { name: "Vibration Sensors", slug: "vibration-sensors", productIds: [] },
      { name: "Voltage Sensors", slug: "voltage-sensors", productIds: [] },
      { name: "Water Level/Flow Sensors", slug: "water-level-flow-sensors", productIds: [] },
      { name: "Weighing Sensors", slug: "weighing-sensors", productIds: [] },
      { name: "RFID Tags and Modules", slug: "rfid-tags-and-modules", productIds: [] },
    ],
  },
  {
    id: 3,
    name: "Semiconductors & Prototyping Components",
    slug: "semiconductors-prototyping-components",
    aliases: ["components"],
    image: "photo-1553406830-ef2513450d76",
    description: "Fundamental building blocks of modern circuits: ICs, passive components, voltage regulators, discrete semiconductors, and prototyping breadboards.",
    productIds: ["breadboard-set"],
    subcategories: [
      { name: "ICs", slug: "ics", productIds: [] },
      { name: "Resistors", slug: "resistors", productIds: [] },
      { name: "Capacitors", slug: "capacitors", productIds: [] },
      { name: "Diodes", slug: "diodes", productIds: [] },
      { name: "Shift Registers", slug: "shift-registers", productIds: [] },
      { name: "Voltage Regulators", slug: "voltage-regulators", productIds: [] },
      { name: "Transistors", slug: "transistors", productIds: [] },
    ],
  },
  {
    id: 4,
    name: "Batteries, Power Supplies & Accessories",
    slug: "batteries-power-supplies-accessories",
    aliases: ["batteries-power-supply-and-accessories"],
    image: "photo-1625842268584-8f3296236761",
    description: "Reliable power delivery solutions, including Lithium packs, industrial battery cells, BMS protection modules, DC adapters, chargers, and SMPS power supplies.",
    productIds: ["usb-hub"],
    subcategories: [
      { name: "Lithium Ion Battery Packs", slug: "lithium-ion-battery-packs", productIds: [] },
      { name: "Batteries", slug: "batteries", productIds: [] },
      { name: "Ni-Cd Batteries", slug: "ni-cd-batteries", productIds: [] },
      { name: "Li-ion NMC Battery Cells", slug: "li-ion-nmc-battery-cells", productIds: [] },
      { name: "LiFePo4 Battery Cells", slug: "lifepo4-battery-cells", productIds: [] },
      { name: "Lithium Polymer", slug: "lithium-polymer", productIds: [] },
      { name: "BMS", slug: "bms", productIds: [] },
      { name: "Battery Modules", slug: "battery-modules", productIds: [] },
      { name: "Battery Pack Accessories", slug: "battery-pack-accessories", productIds: [] },
      { name: "Adapters", slug: "adapters", productIds: ["usb-hub"] },
      { name: "Chargers", slug: "chargers", productIds: ["usb-hub"] },
      { name: "Battery Enclosures", slug: "battery-enclosures", productIds: [] },
      { name: "SMPS Power Supplies", slug: "smps-power-supplies", productIds: [] },
      { name: "Transformers", slug: "transformers", productIds: [] },
    ],
  },
  {
    id: 5,
    name: "Wireless & IoT Products",
    slug: "wireless-iot-products",
    aliases: ["iot-and-wireless-modules"],
    image: "photo-1558002038-1055907df827",
    description: "Wireless transceivers and IoT gateways: Bluetooth, Wi-Fi, GPS navigation, GSM cellular, nRF/RF radio, LoRa long-range modules, and tuned antennas.",
    productIds: ["esp32-board"],
    subcategories: [
      { name: "IoT Boards and Modules", slug: "iot-boards-and-modules", productIds: ["esp32-board"] },
      { name: "Bluetooth", slug: "bluetooth", productIds: ["esp32-board"] },
      { name: "Wireless", slug: "wireless", productIds: ["esp32-board"] },
      { name: "GPS Modules", slug: "gps-modules", productIds: [] },
      { name: "GSM Modules", slug: "gsm-modules", productIds: [] },
      { name: "nRF / RF Modules", slug: "nrf-rf-modules", productIds: [] },
      { name: "LoRa Modules", slug: "lora-modules", productIds: [] },
      { name: "Antennas", slug: "antennas", productIds: [] },
    ],
  },
  {
    id: 6,
    name: "Switches, Relays & Protection",
    slug: "switches-relays-protection",
    aliases: [],
    image: "photo-1581092334651-ddf26d9a09d0",
    description: "Control and circuit protection: tactile push buttons, DIP switches, SMD switches, electromechanical relays, and fast-acting safety fuses.",
    productIds: [],
    subcategories: [
      { name: "Push Button Switches", slug: "push-button-switches", productIds: [] },
      { name: "DIP Switches", slug: "dip-switches", productIds: [] },
      { name: "SMD Switches", slug: "switches-smd-switches", aliases: ["switch-smd-switches"], productIds: [] },
      { name: "Other Switches", slug: "other-switches", productIds: [] },
      { name: "Relays", slug: "relays", productIds: [] },
      { name: "Fuses", slug: "fuses", productIds: [] },
    ],
  },
  {
    id: 7,
    name: "Lighting & LEDs",
    slug: "lighting-leds",
    aliases: [],
    image: "photo-1509391366360-2e959784a276",
    description: "Illumination and indicators: through-hole LEDs, SMD LEDs, addressable LED strips, digital controllers, flexible neon light, and high-power COB modules.",
    productIds: [],
    subcategories: [
      { name: "LEDs", slug: "leds", productIds: [] },
      { name: "SMD LEDs", slug: "lighting-smd-leds", productIds: [] },
      { name: "LED Strips & Controllers", slug: "led-strips-controllers", productIds: [] },
      { name: "Neon LED Lights", slug: "neon-led-lights", productIds: [] },
      { name: "Decorative Lightings", slug: "decorative-lightings", productIds: [] },
      { name: "COB LEDs", slug: "cob-leds", productIds: [] },
    ],
  },
  {
    id: 8,
    name: "Motors, Drivers & Pumps",
    slug: "motors-drivers-pumps",
    aliases: ["motors-actuators"],
    image: "photo-1581092160562-40aa08e78837",
    description: "Motion mechanics and fluids: DC geared motors, brushless BLDC, drone power systems, precision servos, stepper motors, propellers, motor drivers, and pumps.",
    productIds: ["robotics-kit"],
    subcategories: [
      { name: "DC Motors", slug: "dc-motors", productIds: ["robotics-kit"] },
      { name: "BLDC Motors", slug: "bldc-motors", productIds: [] },
      { name: "Drone Motors", slug: "drone-motors", productIds: [] },
      { name: "Servo Motors", slug: "servo-motors", productIds: [] },
      { name: "Stepper Motors", slug: "stepper-motors", productIds: [] },
      { name: "Propellers & Fans", slug: "propellers-fans", productIds: [] },
      { name: "Motor Drivers", slug: "motor-drivers", productIds: ["robotics-kit"] },
      { name: "Pumps", slug: "pumps", productIds: [] },
    ],
  },
  {
    id: 9,
    name: "Wires, Cables & Connectors",
    slug: "wires-cables-connectors",
    aliases: [],
    image: "photo-1558494949-ef010cbdcc31",
    description: "Interconnection essentials: flexible jumper wires, high-temp silicone wires, PVC wiring, power cords, communication cables, and audio/DC/waterproof connectors.",
    productIds: ["breadboard-set"],
    subcategories: [
      { name: "Jumper Wires", slug: "jumper-wires", productIds: ["breadboard-set"] },
      { name: "Silicone Wires", slug: "silicone-wires", productIds: [] },
      { name: "PVC Wires", slug: "pvc-wires", productIds: [] },
      { name: "Power Cables", slug: "power-cables", productIds: [] },
      { name: "Communication Cables", slug: "communication-cables", productIds: [] },
      { name: "DC Power Connectors", slug: "dc-power-connectors", productIds: [] },
      { name: "Battery Connectors", slug: "battery-connectors", productIds: [] },
      { name: "Audio Connectors/Jack", slug: "audio-connectors-jack", productIds: [] },
      { name: "Automobile Connectors", slug: "automobile-connectors", productIds: [] },
      { name: "Crocodile Connectors", slug: "crocodile-connectors", productIds: [] },
      { name: "RMC Connectors", slug: "rmc-connectors", productIds: [] },
      { name: "SMD Connectors", slug: "wire-smd-connectors", productIds: [] },
      { name: "Waterproof Connectors", slug: "waterproof-connectors", productIds: [] },
    ],
  },
  {
    id: 10,
    name: "Robotics & DIY Learning Kits",
    slug: "robotics-diy-learning-kits",
    aliases: ["diy-maker-kits", "maker-kits", "robotics-iot"],
    image: "photo-1581091226825-a6a2a5aee158",
    description: "Curated kits for makers, students, and educators. Hands-on learning kits for robotics, smart IoT builds, electronics fundamentals, and interactive projects.",
    productIds: ["arduino-starter", "robotics-kit", "weather-station"],
    subcategories: [],
  },
  {
    id: 11,
    name: "3D Printers & Parts",
    slug: "3d-printers-parts",
    aliases: ["3d-printers-and-parts"],
    image: "photo-1634838080334-28befa9efe80",
    description: "Additive manufacturing hardware: desktop 3D printers, 3D printing pens, premium filaments (PLA/PETG/ABS), nozzles, hotends, extruders, and spare parts.",
    productIds: [],
    subcategories: [
      { name: "3D Printers & Pens", slug: "3d-printers-pens", productIds: [] },
      { name: "3D Printer Filaments", slug: "3d-printer-filaments", productIds: [] },
      { name: "3D Printer Parts", slug: "3d-printer-parts", productIds: [] },
    ],
  },
  {
    id: 12,
    name: "SMD Components",
    slug: "smd-components",
    aliases: [],
    image: "photo-1607604276583-eef5d076aa5f",
    description: "Surface Mount Device components for compact PCB assembly: SMD capacitors, connectors, diodes, ICs, LEDs, precision resistors, switches, and FET transistors.",
    productIds: [],
    subcategories: [
      { name: "SMD Capacitors", slug: "smd-capacitors", productIds: [] },
      { name: "SMD Connectors", slug: "smd-connectors", productIds: [] },
      { name: "SMD Diodes", slug: "smd-diodes", productIds: [] },
      { name: "SMD ICs", slug: "smd-ics", productIds: [] },
      { name: "SMD LEDs", slug: "smd-leds", productIds: [] },
      { name: "SMD Resistors", slug: "smd-resistors", productIds: [] },
      { name: "SMD Switches", slug: "smd-switches", productIds: [] },
      { name: "SMD Transistors/FETs", slug: "smd-transistors-fets", productIds: [] },
    ],
  },
  {
    id: 13,
    name: "Electronic Modules",
    slug: "electronic-modules",
    aliases: ["electronic-modules-and-displays"],
    image: "photo-1563770660941-20978e870e26",
    description: "Ready-to-integrate breakout modules: relay boards, voltage step-down/boost converters, audio amplifiers, timing modules, and expansion peripherals.",
    productIds: [],
    subcategories: [
      { name: "SMD Capacitors", slug: "mod-smd-capacitors", productIds: [] },
      { name: "SMD Connectors", slug: "mod-smd-connectors", productIds: [] },
      { name: "SMD Diodes", slug: "mod-smd-diodes", productIds: [] },
      { name: "SMD ICs", slug: "mod-smd-ics", productIds: [] },
      { name: "SMD LEDs", slug: "mod-smd-leds", productIds: [] },
      { name: "SMD Resistors", slug: "mod-smd-resistors", productIds: [] },
      { name: "SMD Switches", slug: "mod-smd-switches", productIds: [] },
      { name: "SMD Transistors/FETs", slug: "mod-smd-transistors-fets", productIds: [] },
    ],
  },
  {
    id: 14,
    name: "Drone Components",
    slug: "drone-components",
    aliases: ["drone-parts"],
    image: "photo-1485827404703-89b55fcc595e",
    description: "FPV and multirotor drone hardware: flight controllers, carbon fiber frames, high-KV drone motors, balanced propellers, and long-range RF receivers/transmitters.",
    productIds: [],
    subcategories: [
      { name: "Drone Controllers", slug: "drone-controllers", productIds: [] },
      { name: "Drone Frames", slug: "drone-frames", productIds: [] },
      { name: "Drone Motors", slug: "drone-motors-sub", productIds: [] },
      { name: "Drone Propellers", slug: "drone-propellers", productIds: [] },
      { name: "Drone RF", slug: "drone-rf", productIds: [] },
    ],
  },
  {
    id: 15,
    name: "Hardware Instruments & Tools",
    slug: "hardware-instruments-tools",
    aliases: ["tools-equipment", "tools-lab", "mechanical-parts-measurement-workbench-tools"],
    image: "photo-1581092160562-40aa08e78837",
    description: "Professional workbench equipment: soldering irons, stations, solder lead, digital multimeters, screws/fasteners, adhesives, measurement tools, and mechanics.",
    productIds: ["precision-toolkit", "multimeter", "wireless-keyboard"],
    subcategories: [
      {
        name: "Soldering Accessories",
        slug: "soldering-accessories",
        productIds: [],
        subcategories: [
          { name: "Soldering Irons", slug: "soldering-irons", productIds: [] },
          { name: "Soldering Boards", slug: "soldering-boards", productIds: [] },
          { name: "Soldering Lead", slug: "soldering-lead", productIds: [] },
          { name: "Soldering Stations", slug: "soldering-stations", productIds: [] },
          { name: "Soldering Tip", slug: "soldering-tip", productIds: [] },
        ],
      },
      { name: "Multimeters", slug: "multimeters", productIds: ["multimeter"] },
      { name: "Nut, Screws & Bolts", slug: "nut-screws-bolts", productIds: [] },
      { name: "Adhesives & Tapes", slug: "adhesives-tapes", productIds: [] },
      { name: "Tools", slug: "tools", productIds: ["precision-toolkit"] },
      { name: "Measurement Tools", slug: "measurement-tools", productIds: ["multimeter"] },
      { name: "Mechanical Tools", slug: "mechanical-tools", productIds: ["precision-toolkit"] },
      { name: "Other Tools", slug: "other-tools", productIds: ["wireless-keyboard"] },
    ],
  },
  {
    id: 16,
    name: "Displays",
    slug: "displays",
    aliases: [],
    image: "photo-1597733336794-12d05021d510",
    description: "Visual readout devices for maker builds: crisp monochrome and color OLEDs, character/graphic LCDs, 7-segment LED arrays, and interactive TFT touch screens.",
    productIds: [],
    subcategories: [
      { name: "OLED", slug: "oled", productIds: [] },
      { name: "LCD", slug: "lcd", productIds: [] },
      { name: "7-Segment", slug: "7-segment", productIds: [] },
      { name: "TFT/Touch", slug: "tft-touch", productIds: [] },
    ],
  },
];

// Flat list for image-based header navigation scroller
export const headerImageCategories = pdfCategories.map((c) => ({
  name: c.name,
  slug: c.slug,
  image: c.image,
}));

// Slug and alias resolver
export function findCategoryBySlug(slug) {
  if (!slug) return null;
  const normalized = slug.toLowerCase().trim();

  // 1. Direct match on main category slug
  let found = pdfCategories.find((c) => c.slug === normalized);
  if (found) return { category: found, subcategory: null };

  // 2. Check aliases of main categories
  found = pdfCategories.find((c) => c.aliases && c.aliases.includes(normalized));
  if (found) return { category: found, subcategory: null };

  // 3. Check if slug matches a subcategory
  for (const cat of pdfCategories) {
    if (!cat.subcategories) continue;
    for (const sub of cat.subcategories) {
      if (sub.slug === normalized) {
        return { category: cat, subcategory: sub };
      }
      if (sub.subcategories) {
        for (const nested of sub.subcategories) {
          if (nested.slug === normalized) {
            return { category: cat, subcategory: nested, parentSubcategory: sub };
          }
        }
      }
    }
  }

  // 4. Fuzzy fallback if user navigated with partial slug
  found = pdfCategories.find((c) => normalized.includes(c.slug) || c.slug.includes(normalized));
  if (found) return { category: found, subcategory: null };

  return null;
}
