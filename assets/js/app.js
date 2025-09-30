import { conversionCatalog } from "./catalog.js";

const state = {
  categoryId: conversionCatalog[0]?.id ?? null,
  fromUnit: null,
  toUnit: null,
  lastEdited: "from"
};

const elements = {
  disciplineButtons: document.getElementById("discipline-buttons"),
  fromUnitButtons: document.getElementById("from-unit-buttons"),
  toUnitButtons: document.getElementById("to-unit-buttons"),
  reverseButton: document.getElementById("reverse-button"),
  fromValue: document.getElementById("from-value"),
  toValue: document.getElementById("to-value"),
  fromUnitDisplay: document.getElementById("from-unit-display"),
  toUnitDisplay: document.getElementById("to-unit-display"),
  note: document.getElementById("conversion-meta")
};

const getCategory = (id) => conversionCatalog.find((category) => category.id === id) ?? null;

const getAllUnitsForCategory = (category) => {
  return category.units || [];
};

const convertValue = (value, fromUnit, toUnit, category) => {
  // Handle same unit
  if (fromUnit.name === toUnit.name) {
    return value;
  }
  
  // Handle temperature separately (non-linear conversions)
  if (category.id === "temperature") {
    const baseValue = typeof fromUnit.toBase === 'function' 
      ? fromUnit.toBase(value) 
      : value * fromUnit.toBase;
    
    const result = typeof toUnit.fromBase === 'function'
      ? toUnit.fromBase(baseValue)
      : baseValue / toUnit.toBase;
    
    return result;
  }
  
  // Convert from source unit to base unit
  const baseValue = value * fromUnit.toBase;
  
  // Convert from base unit to target unit
  const result = baseValue / toUnit.toBase;
  
  return result;
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return "";
  }

  const absolute = Math.abs(value);
  
  // Use scientific notation for very large numbers (>= 1e9) or very small numbers (< 1e-6)
  if (absolute >= 1e9 || (absolute < 1e-6 && absolute !== 0)) {
    return value.toExponential(6);
  }
  
  // Determine appropriate decimal places based on magnitude
  let maximumFractionDigits;
  if (absolute >= 1000) {
    maximumFractionDigits = 3;
  } else if (absolute >= 100) {
    maximumFractionDigits = 4;
  } else if (absolute >= 10) {
    maximumFractionDigits = 5;
  } else if (absolute >= 1) {
    maximumFractionDigits = 6;
  } else if (absolute >= 0.1) {
    maximumFractionDigits = 7;
  } else if (absolute >= 0.01) {
    maximumFractionDigits = 8;
  } else {
    maximumFractionDigits = 9;
  }

  // Just return the basic formatted number for now - no fancy spacing
  return value.toLocaleString('en-US', {
    maximumFractionDigits,
    useGrouping: false
  });
};

const createDisciplineButtons = () => {
  elements.disciplineButtons.innerHTML = "";
  
  conversionCatalog.forEach(category => {
    const button = document.createElement("button");
    button.className = "discipline-btn";
    button.textContent = category.name;
    button.dataset.categoryId = category.id;
    
    if (category.id === state.categoryId) {
      button.classList.add("active");
    }
    
    button.addEventListener("click", () => handleDisciplineChange(category.id));
    elements.disciplineButtons.appendChild(button);
  });
};

const createUnitButtons = () => {
  const category = getCategory(state.categoryId);
  if (!category) return;
  
  const units = getAllUnitsForCategory(category);
  
  // Create from unit buttons
  elements.fromUnitButtons.innerHTML = "";
  units.forEach(unit => {
    const button = document.createElement("button");
    button.className = "unit-btn";
    button.textContent = unit.unit;
    button.title = unit.name;
    button.dataset.unitName = unit.name;
    button.dataset.unitSymbol = unit.unit;
    
    if (state.fromUnit && state.fromUnit.name === unit.name) {
      button.classList.add("active");
    }
    
    button.addEventListener("click", () => handleFromUnitChange(unit));
    elements.fromUnitButtons.appendChild(button);
  });
  
  // Create to unit buttons
  elements.toUnitButtons.innerHTML = "";
  units.forEach(unit => {
    const button = document.createElement("button");
    button.className = "unit-btn";
    button.textContent = unit.unit;
    button.title = unit.name;
    button.dataset.unitName = unit.name;
    button.dataset.unitSymbol = unit.unit;
    
    if (state.toUnit && state.toUnit.name === unit.name) {
      button.classList.add("active");
    }
    
    button.addEventListener("click", () => handleToUnitChange(unit));
    elements.toUnitButtons.appendChild(button);
  });
};

const updateDisplay = () => {
  // Update unit displays
  elements.fromUnitDisplay.textContent = state.fromUnit ? state.fromUnit.unit : "";
  elements.toUnitDisplay.textContent = state.toUnit ? state.toUnit.unit : "";
  
  // Update conversion note
  if (state.fromUnit && state.toUnit) {
    if (state.fromUnit.name === state.toUnit.name) {
      elements.note.textContent = "Same unit conversion (1:1 ratio)";
    } else {
      const category = getCategory(state.categoryId);
      const sampleValue = 1;
      const convertedValue = convertValue(sampleValue, state.fromUnit, state.toUnit, category);
      elements.note.textContent = `1 ${state.fromUnit.unit} = ${formatNumber(convertedValue)} ${state.toUnit.unit}`;
    }
  } else {
    elements.note.textContent = "";
  }
};

const syncValues = () => {
  if (!state.fromUnit || !state.toUnit) {
    return;
  }
  
  const category = getCategory(state.categoryId);
  const source = state.lastEdited;
  const reader = source === "from" ? elements.fromValue : elements.toValue;
  const writer = source === "from" ? elements.toValue : elements.fromValue;
  
  if (reader.value.trim() === "") {
    writer.value = "";
    return;
  }
  
  const sanitized = reader.value.replace(/,/g, "");
  const numeric = Number.parseFloat(sanitized);
  if (Number.isNaN(numeric)) {
    writer.value = "";
    return;
  }
  
  let result;
  if (source === "from") {
    result = convertValue(numeric, state.fromUnit, state.toUnit, category);
  } else {
    result = convertValue(numeric, state.toUnit, state.fromUnit, category);
  }
  
  writer.value = formatNumber(result);
};

const handleDisciplineChange = (categoryId) => {
  state.categoryId = categoryId;
  
  // Set default units for this category
  const category = getCategory(categoryId);
  if (category && category.units && category.units.length >= 2) {
    // Use first two units as defaults
    state.fromUnit = category.units[0];
    state.toUnit = category.units[1];
  } else {
    state.fromUnit = null;
    state.toUnit = null;
  }
  
  // Update active discipline button
  document.querySelectorAll('.discipline-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.categoryId === categoryId);
  });
  
  createUnitButtons();
  updateDisplay();
  
  // Set default value and calculate
  elements.fromValue.value = "1";
  state.lastEdited = "from";
  syncValues();
};

const handleFromUnitChange = (unit) => {
  state.fromUnit = unit;
  
  // Update active from unit button
  document.querySelectorAll('#from-unit-buttons .unit-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unitName === unit.name);
  });
  
  updateDisplay();
  
  // Recalculate from the current input
  if (state.lastEdited === "from" && elements.fromValue.value.trim() !== "") {
    syncValues();
  } else if (state.lastEdited === "to" && elements.toValue.value.trim() !== "") {
    syncValues();
  }
};

const handleToUnitChange = (unit) => {
  state.toUnit = unit;
  
  // Update active to unit button
  document.querySelectorAll('#to-unit-buttons .unit-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unitName === unit.name);
  });
  
  updateDisplay();
  
  // Recalculate from the current input
  if (state.lastEdited === "from" && elements.fromValue.value.trim() !== "") {
    syncValues();
  } else if (state.lastEdited === "to" && elements.toValue.value.trim() !== "") {
    syncValues();
  }
};

const handleReverse = () => {
  if (!state.fromUnit || !state.toUnit) return;
  
  // Swap units
  [state.fromUnit, state.toUnit] = [state.toUnit, state.fromUnit];
  
  // Swap values
  [elements.fromValue.value, elements.toValue.value] = [elements.toValue.value, elements.fromValue.value];
  
  // Update button states
  createUnitButtons();
  updateDisplay();
};

const clearValues = () => {
  elements.fromValue.value = "";
  elements.toValue.value = "";
};

const bindEvents = () => {
  elements.reverseButton.addEventListener("click", handleReverse);

  elements.fromValue.addEventListener("input", () => {
    state.lastEdited = "from";
    syncValues();
  });

  elements.toValue.addEventListener("input", () => {
    state.lastEdited = "to";
    syncValues();
  });

  elements.fromValue.addEventListener("focus", () => {
    state.lastEdited = "from";
  });

  elements.toValue.addEventListener("focus", () => {
    state.lastEdited = "to";
  });
};

const initialize = () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear().toString();
  }

  createDisciplineButtons();
  
  // Initialize with the first category and its default units
  if (state.categoryId) {
    const category = getCategory(state.categoryId);
    if (category && category.units && category.units.length >= 2) {
      state.fromUnit = category.units[0];
      state.toUnit = category.units[1];
    }
    
    createUnitButtons();
    updateDisplay();
    
    // Set initial value and calculate
    elements.fromValue.value = "1";
    state.lastEdited = "from";
    syncValues();
  }
  
  bindEvents();
};

initialize();

