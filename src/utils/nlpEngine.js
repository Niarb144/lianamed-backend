import stringSimilarity from "string-similarity";

// -------------------------
// GREETING DETECTOR
// -------------------------
const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
export function detectGreeting(message) {
  return greetings.some(g => message.includes(g));
}

// -------------------------
// HELP INTENT
// -------------------------
export function detectHelp(message) {
  return message.includes("help") || message.includes("assist");
}

// -------------------------
// ORDER ID (numeric)
// -------------------------
export function detectOrderId(message) {
  const match = message.match(/\b\d{4,}\b/);
  return match ? match[0] : null;
}

// -------------------------
// ORDER STATUS DETECTION
// -------------------------
const statusWords = {
  delivered: ["delivered", "completed"],
  pending: ["pending", "processing", "awaiting"],
  shipped: ["shipped", "in transit", "on the way"],
  cancelled: ["cancelled", "canceled"]
};

export function detectOrderStatus(message) {
  for (const [status, keywords] of Object.entries(statusWords)) {
    if (keywords.some(k => message.includes(k))) return status;
  }
  return null;
}

// -------------------------
// PRODUCT SEARCH DETECTOR
// -------------------------
const productSearchPatterns = [
  /find (.+)/i,
  /search (.+)/i,
  /look for (.+)/i,
  /have (.+)/i,
  /need (.+)/i,
  /want (.+)/i,
  /get (.+)/i,
  /buy (.+)/i
];

export function detectProductName(message) {
  for (let p of productSearchPatterns) {
    const match = message.match(p);
    if (match) return match[1].trim();
  }
  return null;
}

// -------------------------
// CATEGORY DETECTOR
// -------------------------
const categories = [
  "pain",
  "cold",
  "flu",
  "malaria",
  "diabetes",
  "antibiotic",
  "allergy",
  "vitamin",
  "supplement",
  "ulcer",
  "sexual health",
  "chronic",
  "cancer"
];

export function detectCategory(message) {
  return categories.find(cat => message.includes(cat));
}

// -------------------------
// FUZZY MATCHING FOR PRODUCTS
// -------------------------
export function fuzzyMatchProduct(input, productList) {
  const names = productList.map(p => p.name);
  const best = stringSimilarity.findBestMatch(input, names);

  if (best.bestMatch.rating > 0.4) {
    return productList.find(p => p.name === best.bestMatch.target);
  }

  return null;
}
