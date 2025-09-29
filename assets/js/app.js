import { conversionCatalog } from "./catalog.js";

const state = {
  categoryId: conversionCatalog[0]?.id ?? null,
  conversionId: conversionCatalog[0]?.defaultConversionId ?? null,
  reversed: false,
  syncing: false,
  lastEdited: "from"
};

const elements = {
  categorySelect: document.getElementById("category-select"),
  conversionSelect: document.getElementById("conversion-select"),
  reverseButton: document.getElementById("reverse-button"),
  fromLabel: document.getElementById("from-label"),
  fromUnit: document.getElementById("from-unit"),
  fromValue: document.getElementById("from-value"),
  toLabel: document.getElementById("to-label"),
  toUnit: document.getElementById("to-unit"),
  toValue: document.getElementById("to-value"),
  note: document.getElementById("conversion-meta"),
  totalCount: document.getElementById("conversion-count")
};

const getCategory = (id) => conversionCatalog.find((category) => category.id === id) ?? null;

const getConversion = (category, conversionId) =>
  category?.conversions.find((conversion) => conversion.id === conversionId) ?? null;

const getActiveContext = () => {
  const category = getCategory(state.categoryId);
  const conversion = getConversion(category, state.conversionId);
  if (!category || !conversion) {
    return null;
  }

  if (!state.reversed) {
    return {
      category,
      conversion,
      fromUnit: conversion.fromUnit,
      toUnit: conversion.toUnit,
      forward: conversion.transform.forward,
      reverse: conversion.transform.reverse
    };
  }

  return {
    category,
    conversion,
    fromUnit: conversion.toUnit,
    toUnit: conversion.fromUnit,
    forward: conversion.transform.reverse,
    reverse: conversion.transform.forward
  };
};

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return "";
  }

  const absolute = Math.abs(value);
  let maximumFractionDigits = 6;

  if (absolute >= 1000) {
    maximumFractionDigits = 2;
  } else if (absolute >= 1) {
    maximumFractionDigits = 4;
  }


  return value.toLocaleString(undefined, {
    maximumFractionDigits,
    useGrouping: false
  });
};

const populateCategorySelect = () => {
  elements.categorySelect.innerHTML = "";
  conversionCatalog.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    elements.categorySelect.appendChild(option);
  });
};

const populateConversionSelect = (category) => {
  elements.conversionSelect.innerHTML = "";
  if (!category) {
    return;
  }

  category.conversions.forEach((conversion) => {
    const option = document.createElement("option");
    option.value = conversion.id;
    option.textContent = conversion.label;
    elements.conversionSelect.appendChild(option);
  });
};

const updateConversionMeta = () => {
  const context = getActiveContext();
  elements.note.textContent = context?.conversion.note ?? "";
};

const renderConversionDetails = () => {
  const context = getActiveContext();
  elements.reverseButton.setAttribute("aria-pressed", String(state.reversed));

  if (!context) {
    elements.fromLabel.textContent = "Select a conversion";
    elements.toLabel.textContent = "";
    elements.fromUnit.textContent = "";
    elements.toUnit.textContent = "";
    elements.note.textContent = "";
    return;
  }

  elements.fromLabel.textContent = context.fromUnit.name;
  elements.fromUnit.textContent = context.fromUnit.unit;
  elements.toLabel.textContent = context.toUnit.name;
  elements.toUnit.textContent = context.toUnit.unit;

  updateConversionMeta();
};

const syncValues = (source) => {
  const context = getActiveContext();
  if (!context) {
    return;
  }

  const reader = source === "from" ? elements.fromValue : elements.toValue;
  const writer = source === "from" ? elements.toValue : elements.fromValue;
  const converter = source === "from" ? context.forward : context.reverse;

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

  const raw = converter(numeric);
  writer.value = formatNumber(raw);
};

const resetInputs = () => {
  state.lastEdited = "from";
  elements.fromValue.value = "1";
  syncValues("from");
};

const handleCategoryChange = (categoryId) => {
  const category = getCategory(categoryId);
  if (!category) {
    return;
  }

  state.categoryId = category.id;
  state.conversionId = category.defaultConversionId ?? category.conversions[0]?.id ?? null;
  state.reversed = false;

  populateConversionSelect(category);
  elements.categorySelect.value = state.categoryId;
  elements.conversionSelect.value = state.conversionId ?? "";

  renderConversionDetails();
  resetInputs();
};

const handleConversionChange = (conversionId) => {
  const category = getCategory(state.categoryId);
  if (!category) {
    return;
  }

  const conversion = getConversion(category, conversionId);
  if (!conversion) {
    return;
  }

  state.conversionId = conversion.id;
  elements.conversionSelect.value = conversion.id;

  renderConversionDetails();
  resetInputs();
};

const handleReverse = () => {
  const previousFrom = elements.fromValue.value;
  const previousTo = elements.toValue.value;

  state.reversed = !state.reversed;
  renderConversionDetails();

  elements.fromValue.value = previousTo;
  elements.toValue.value = previousFrom;

  if (state.lastEdited === "from") {
    syncValues("from");
  } else {
    syncValues("to");
  }
};

const bindEvents = () => {
  elements.categorySelect.addEventListener("change", (event) => {
    handleCategoryChange(event.target.value);
  });

  elements.conversionSelect.addEventListener("change", (event) => {
    handleConversionChange(event.target.value);
  });

  elements.reverseButton.addEventListener("click", () => {
    handleReverse();
  });

  elements.fromValue.addEventListener("input", () => {
    if (state.syncing) {
      return;
    }
    state.syncing = true;
    state.lastEdited = "from";
    syncValues("from");
    state.syncing = false;
  });

  elements.toValue.addEventListener("input", () => {
    if (state.syncing) {
      return;
    }
    state.syncing = true;
    state.lastEdited = "to";
    syncValues("to");
    state.syncing = false;
  });

  elements.fromValue.addEventListener("focus", () => {
    state.lastEdited = "from";
  });

  elements.toValue.addEventListener("focus", () => {
    state.lastEdited = "to";
  });
};

const updateConversionCount = () => {
  const count = conversionCatalog.reduce((total, category) => total + category.conversions.length, 0);
  if (elements.totalCount) {
    elements.totalCount.textContent = count.toString();
  }
};

const initialize = () => {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear().toString();
  }

  populateCategorySelect();
  const initialCategoryId = state.categoryId ?? conversionCatalog[0]?.id ?? null;
  const category = getCategory(initialCategoryId);
  populateConversionSelect(category);

  handleCategoryChange(initialCategoryId);
  bindEvents();
  updateConversionCount();
};

initialize();

