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
    defaultConversionId: "length-meters-feet",
    conversions: [
      {
        id: "length-meters-feet",
        label: "Meters <-> Feet",
        fromUnit: { name: "Meters", unit: "m" },
        toUnit: { name: "Feet", unit: "ft" },
        transform: ratio(3.280839895),
        note: "1 meter equals 3.280839895 feet."
      },
      {
        id: "length-kilometers-miles",
        label: "Kilometers <-> Miles",
        fromUnit: { name: "Kilometers", unit: "km" },
        toUnit: { name: "Miles", unit: "mi" },
        transform: ratio(0.621371192),
        note: "1 kilometer equals 0.621371192 miles."
      },
      {
        id: "length-centimeters-inches",
        label: "Centimeters <-> Inches",
        fromUnit: { name: "Centimeters", unit: "cm" },
        toUnit: { name: "Inches", unit: "in" },
        transform: ratio(0.3937007874),
        note: "1 centimeter equals 0.3937007874 inches."
      }
    ]
  },
  {
    id: "mass",
    name: "Mass",
    defaultConversionId: "mass-kilograms-pounds",
    conversions: [
      {
        id: "mass-kilograms-pounds",
        label: "Kilograms <-> Pounds",
        fromUnit: { name: "Kilograms", unit: "kg" },
        toUnit: { name: "Pounds", unit: "lb" },
        transform: ratio(2.2046226218),
        note: "1 kilogram equals 2.2046226218 pounds."
      },
      {
        id: "mass-grams-ounces",
        label: "Grams <-> Ounces",
        fromUnit: { name: "Grams", unit: "g" },
        toUnit: { name: "Ounces", unit: "oz" },
        transform: ratio(0.0352739619),
        note: "1 gram equals 0.0352739619 ounces."
      }
    ]
  },
  {
    id: "temperature",
    name: "Temperature",
    defaultConversionId: "temperature-celsius-fahrenheit",
    conversions: [
      {
        id: "temperature-celsius-fahrenheit",
        label: "Celsius <-> Fahrenheit",
        fromUnit: { name: "Celsius", unit: "°C" },
        toUnit: { name: "Fahrenheit", unit: "°F" },
        transform: linear(9 / 5, 32),
        note: "Fahrenheit equals Celsius x 9/5 + 32."
      },
      {
        id: "temperature-celsius-kelvin",
        label: "Celsius <-> Kelvin",
        fromUnit: { name: "Celsius", unit: "°C" },
        toUnit: { name: "Kelvin", unit: "K" },
        transform: translate(273.15),
        note: "Kelvin equals Celsius + 273.15."
      }
    ]
  },
  {
    id: "volume",
    name: "Volume",
    defaultConversionId: "volume-liters-gallons",
    conversions: [
      {
        id: "volume-liters-gallons",
        label: "Liters <-> Gallons (US)",
        fromUnit: { name: "Liters", unit: "L" },
        toUnit: { name: "Gallons", unit: "gal" },
        transform: ratio(0.2641720524),
        note: "1 liter equals 0.2641720524 US gallons."
      },
      {
        id: "volume-milliliters-fluid-ounces",
        label: "Milliliters <-> Fluid Ounces",
        fromUnit: { name: "Milliliters", unit: "mL" },
        toUnit: { name: "Fluid Ounces", unit: "fl oz" },
        transform: ratio(0.0338140227),
        note: "1 milliliter equals 0.0338140227 fluid ounces."
      }
    ]
  },
  {
    id: "cooking",
    name: "Cooking",
    defaultConversionId: "cooking-cups-tablespoons",
    conversions: [
      {
        id: "cooking-cups-tablespoons",
        label: "US Cups <-> Tablespoons",
        fromUnit: { name: "US Cups", unit: "cup" },
        toUnit: { name: "Tablespoons", unit: "tbsp" },
        transform: ratio(16),
        note: "1 cup equals 16 tablespoons."
      }
    ]
  },
  {
    id: "digital",
    name: "Digital",
    defaultConversionId: "digital-megabytes-gigabytes",
    conversions: [
      {
        id: "digital-megabytes-gigabytes",
        label: "Megabytes <-> Gigabytes",
        fromUnit: { name: "Megabytes", unit: "MB" },
        toUnit: { name: "Gigabytes", unit: "GB" },
        transform: ratio(1 / 1024),
        note: "1 megabyte equals 0.0009765625 gigabytes."
      },
      {
        id: "digital-bits-bytes",
        label: "Bits <-> Bytes",
        fromUnit: { name: "Bits", unit: "b" },
        toUnit: { name: "Bytes", unit: "B" },
        transform: ratio(1 / 8),
        note: "1 byte equals 8 bits."
      }
    ]
  },
  {
    id: "energy",
    name: "Energy",
    defaultConversionId: "energy-joules-calories",
    conversions: [
      {
        id: "energy-joules-calories",
        label: "Joules <-> Calories",
        fromUnit: { name: "Joules", unit: "J" },
        toUnit: { name: "Calories", unit: "cal" },
        transform: ratio(0.2390057361),
        note: "1 joule equals 0.2390057361 calories."
      }
    ]
  },
  {
    id: "engineering",
    name: "Engineering",
    defaultConversionId: "engineering-pressure-kpa-psi",
    conversions: [
      {
        id: "engineering-pressure-kpa-psi",
        label: "Kilopascals <-> PSI",
        fromUnit: { name: "Kilopascals", unit: "kPa" },
        toUnit: { name: "Pounds per Square Inch", unit: "psi" },
        transform: ratio(0.1450377377),
        note: "1 kilopascal equals 0.1450377377 psi."
      },
      {
        id: "engineering-speed-mps-knots",
        label: "Meters per Second <-> Knots",
        fromUnit: { name: "Meters per Second", unit: "m/s" },
        toUnit: { name: "Knots", unit: "kn" },
        transform: ratio(1.9438444924),
        note: "1 meter per second equals 1.9438444924 knots."
      }
    ]
  },
  {
    id: "imaginative",
    name: "Imaginative",
    defaultConversionId: "imaginative-espresso-allnighters",
    conversions: [
      {
        id: "imaginative-espresso-allnighters",
        label: "Espresso Shots <-> All-Nighters",
        fromUnit: { name: "Espresso Shots", unit: "shots" },
        toUnit: { name: "All-Nighters", unit: "nights" },
        transform: ratio(1 / 3.2),
        note: "Roughly 3.2 shots power one determined all-nighter."
      },
      {
        id: "imaginative-steps-spacewalks",
        label: "Office Steps <-> Spacewalk Laps",
        fromUnit: { name: "Office Steps", unit: "steps" },
        toUnit: { name: "Spacewalk Laps", unit: "laps" },
        transform: ratio(1 / 4800),
        note: "One full space station lap is just about 4,800 brisk steps."
      },
      {
        id: "imaginative-pizza-standups",
        label: "Pizza Slices <-> Stand-Up Meetings",
        fromUnit: { name: "Pizza Slices", unit: "slices" },
        toUnit: { name: "Stand-Up Meetings", unit: "meetings" },
        transform: ratio(1 / 6),
        note: "Every six slices fuel one high-energy stand-up."
      }
    ]
  }
];
