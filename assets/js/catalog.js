export const ratio = (factor) => ({
  forward: (value) => value * factor,
  reverse: (value) => value / factor
});

export const linear = (multiplier, offset) => ({
  forward: (value) => value * multiplier + offset,
  reverse: (value) => (value - offset) / multiplier
});

export const translate = (offset) => ({
  forward: (value) => value + offset,
  reverse: (value) => value - offset
});

export const conversionCatalog = [
  {
    id: "length",
    name: "Length",
    baseUnit: "meters",
    units: [
      // Metric units (small to large)
      { name: "Millimeters (mm)", unit: "mm", toBase: 0.001 },
      { name: "Centimeters (cm)", unit: "cm", toBase: 0.01 },
      { name: "Decimeters (dm)", unit: "dm", toBase: 0.1 },
      { name: "Meters (m)", unit: "m", toBase: 1 },
      { name: "Dekameters (dam)", unit: "dam", toBase: 10 },
      { name: "Hectometers (hm)", unit: "hm", toBase: 100 },
      { name: "Kilometers (km)", unit: "km", toBase: 1000 },
      // Imperial/US units
      { name: "Inches (in)", unit: "in", toBase: 0.0254 }, // exact by definition
      { name: "Feet (ft)", unit: "ft", toBase: 0.3048 }, // exact by definition
      { name: "Yards (yd)", unit: "yd", toBase: 0.9144 }, // exact by definition
      { name: "Miles (mi)", unit: "mi", toBase: 1609.344 } // exact by definition
    ]
  },
  {
    id: "mass",
    name: "Mass",
    baseUnit: "grams",
    units: [
      // Metric units
      { name: "Milligrams (mg)", unit: "mg", toBase: 0.001 },
      { name: "Grams (g)", unit: "g", toBase: 1 },
      { name: "Kilograms (kg)", unit: "kg", toBase: 1000 },
      { name: "Metric Tons (t)", unit: "t", toBase: 1000000 },
      // Imperial/US units
      { name: "Ounces (oz)", unit: "oz", toBase: 28.349523125 }, // exact avoirdupois ounce
      { name: "Pounds (lb)", unit: "lb", toBase: 453.59237 } // exact avoirdupois pound
    ]
  },
  {
    id: "temperature",
    name: "Temperature",
    baseUnit: "celsius",
    units: [
      { 
        name: "Celsius (°C)", 
        unit: "°C", 
        toBase: (c) => c,
        fromBase: (c) => c
      },
      { 
        name: "Fahrenheit (°F)", 
        unit: "°F",
        toBase: (f) => (f - 32) * 5/9,
        fromBase: (c) => c * 9/5 + 32
      },
      { 
        name: "Kelvin (K)", 
        unit: "K",
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15
      }
    ]
  },
  {
    id: "volume",
    name: "Volume",
    baseUnit: "liters",
    units: [
      // Metric units
      { name: "Milliliters (mL)", unit: "mL", toBase: 0.001 },
      { name: "Liters (L)", unit: "L", toBase: 1 },
      // US liquid units
      { name: "Teaspoons (tsp)", unit: "tsp", toBase: 3.785411784 / 768 }, // 1 gal = 768 tsp exactly
      { name: "Tablespoons (tbsp)", unit: "tbsp", toBase: 3.785411784 / 256 }, // 1 gal = 256 tbsp exactly
      { name: "Fluid Ounces (fl oz)", unit: "fl oz", toBase: 3.785411784 / 128 }, // 1 gal = 128 fl oz exactly
      { name: "US Cups (cup)", unit: "cup", toBase: 3.785411784 / 16 }, // 1 gal = 16 cups exactly  
      { name: "US Pints (pt)", unit: "pt", toBase: 3.785411784 / 8 }, // 1 gal = 8 pints exactly
      { name: "US Quarts (qt)", unit: "qt", toBase: 3.785411784 / 4 }, // 1 gal = 4 quarts exactly
      { name: "US Gallons (gal)", unit: "gal", toBase: 3.785411784 }
    ]
  },
  {
    id: "area",
    name: "Area",
    baseUnit: "square meters",
    units: [
      // Metric units
      { name: "Square Millimeters (mm²)", unit: "mm²", toBase: 0.000001 },
      { name: "Square Centimeters (cm²)", unit: "cm²", toBase: 0.0001 },
      { name: "Square Meters (m²)", unit: "m²", toBase: 1 },
      { name: "Hectares (ha)", unit: "ha", toBase: 10000 },
      { name: "Square Kilometers (km²)", unit: "km²", toBase: 1000000 },
      // Imperial/US units
      { name: "Square Inches (in²)", unit: "in²", toBase: 0.00064516 }, // (0.0254)^2 exact
      { name: "Square Feet (ft²)", unit: "ft²", toBase: 0.09290304 }, // (0.3048)^2 exact
      { name: "Acres (ac)", unit: "ac", toBase: 4046.8564224 } // exact acre
    ]
  },
  {
    id: "power",
    name: "Power",
    baseUnit: "watts",
    units: [
      // Metric units
      { name: "Watts (W)", unit: "W", toBase: 1 },
      { name: "Kilowatts (kW)", unit: "kW", toBase: 1000 },
      // Imperial units
      { name: "Horsepower (hp)", unit: "hp", toBase: 745.7 },
      { name: "BTU per Hour (BTU/h)", unit: "BTU/h", toBase: 0.293071 }
    ]
  },
  {
    id: "digital",
    name: "Digital Storage",
    baseUnit: "bytes",
    units: [
      // Binary units
      { name: "Bits (b)", unit: "b", toBase: 0.125 },
      { name: "Bytes (B)", unit: "B", toBase: 1 },
      { name: "Kilobytes (KB)", unit: "KB", toBase: 1024 },
      { name: "Megabytes (MB)", unit: "MB", toBase: 1048576 },
      { name: "Gigabytes (GB)", unit: "GB", toBase: 1073741824 },
      { name: "Terabytes (TB)", unit: "TB", toBase: 1099511627776 }
    ]
  },
  {
    id: "energy",
    name: "Energy",
    baseUnit: "joules",
    units: [
      // Metric units
      { name: "Joules (J)", unit: "J", toBase: 1 },
      { name: "Kilojoules (kJ)", unit: "kJ", toBase: 1000 },
      // Calories
      { name: "Calories (cal)", unit: "cal", toBase: 4.184 },
      { name: "Kilocalories (kcal)", unit: "kcal", toBase: 4184 },
      // Imperial units
      { name: "British Thermal Units (BTU)", unit: "BTU", toBase: 1055.06 }
    ]
  },
  {
    id: "speed",
    name: "Speed",
    baseUnit: "meters per second",
    units: [
      // Metric units
      { name: "Meters per Second (m/s)", unit: "m/s", toBase: 1 },
      { name: "Kilometers per Hour (km/h)", unit: "km/h", toBase: 1/3.6 }, // exact: 1000/3600
      // Imperial units
      { name: "Feet per Second (ft/s)", unit: "ft/s", toBase: 0.3048 },
      { name: "Miles per Hour (mph)", unit: "mph", toBase: 0.44704 },
      // Maritime
      { name: "Knots (kn)", unit: "kn", toBase: 0.5144444444444444 } // 1852/3600 exact (nautical mile)
    ]
  },
  {
    id: "pressure",
    name: "Pressure",
    baseUnit: "pascals",
    units: [
      // Metric units
      { name: "Pascals (Pa)", unit: "Pa", toBase: 1 },
      { name: "Kilopascals (kPa)", unit: "kPa", toBase: 1000 },
      { name: "Megapascals (MPa)", unit: "MPa", toBase: 1000000 },
      { name: "Bar (bar)", unit: "bar", toBase: 100000 },
      // Imperial units
      { name: "Pounds per Square Inch (PSI)", unit: "psi", toBase: 6894.76 },
      // Standard units
      { name: "Atmospheres (atm)", unit: "atm", toBase: 101325 }
    ]
  }
];
