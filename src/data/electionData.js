/**
 * State-wise election / ruling party data.
 * Used by the State-wise Election Results Map.
 */
const data = {
  states: [
    { name: "Andaman & Nicobar Islands", code: "AN", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 0, rulingSeats: 0, cm: "N/A" },
    { name: "Andhra Pradesh", code: "AP", party: "TDP", alliance: "NDA", colorParty: "#FFD700", colorAlliance: "#FF9933", totalSeats: 175, rulingSeats: 164, cm: "N. Chandrababu Naidu" },
    { name: "Arunachal Pradesh", code: "AR", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 60, rulingSeats: 46, cm: "Pema Khandu" },
    { name: "Assam", code: "AS", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 126, rulingSeats: 61, cm: "Himanta Biswa Sarma" },
    { name: "Bihar", code: "BR", party: "JD(U)", alliance: "NDA", colorParty: "#00008B", colorAlliance: "#FF9933", totalSeats: 243, rulingSeats: 128, cm: "Nitish Kumar" },
    { name: "Chhattisgarh", code: "CT", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 90, rulingSeats: 54, cm: "Vishnu Deo Sai" },
    { name: "Puducherry", code: "PY", party: "AINRC", alliance: "NDA", colorParty: "#FF6600", colorAlliance: "#FF9933", totalSeats: 30, rulingSeats: 10, cm: "N. Rangaswamy" },
    { name: "Punjab", code: "PB", party: "AAP", alliance: "INDIA", colorParty: "#0066CC", colorAlliance: "#00BFFF", totalSeats: 117, rulingSeats: 92, cm: "Bhagwant Mann" },
    { name: "Rajasthan", code: "RJ", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 200, rulingSeats: 115, cm: "Bhajan Lal Sharma" },
    { name: "Sikkim", code: "SK", party: "SKM", alliance: "Others", colorParty: "#8B4513", colorAlliance: "#FF0000", totalSeats: 32, rulingSeats: 31, cm: "Prem Singh Tamang" },
    { name: "Tamil Nadu", code: "TN", party: "DMK", alliance: "INDIA", colorParty: "#FF0000", colorAlliance: "#00BFFF", totalSeats: 234, rulingSeats: 133, cm: "M.K. Stalin" },
    { name: "Chandigarh", code: "CH", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 0, rulingSeats: 0, cm: "N/A" },
    { name: "Telangana", code: "TS", party: "INC", alliance: "INDIA", colorParty: "#00BFFF", colorAlliance: "#00BFFF", totalSeats: 119, rulingSeats: 64, cm: "Revanth Reddy" },
    { name: "Tripura", code: "TR", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 60, rulingSeats: 32, cm: "Manik Saha" },
    { name: "Uttar Pradesh", code: "UP", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 403, rulingSeats: 255, cm: "Yogi Adityanath" },
    { name: "Uttarakhand", code: "UK", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 70, rulingSeats: 47, cm: "Pushkar Singh Dhami" },
    { name: "West Bengal", code: "WB", party: "AITC", alliance: "INDIA", colorParty: "#008000", colorAlliance: "#00BFFF", totalSeats: 294, rulingSeats: 215, cm: "Mamata Banerjee" },
    { name: "Odisha", code: "OD", party: "BJD", alliance: "Others", colorParty: "#FF6600", colorAlliance: "#FF0000", totalSeats: 147, rulingSeats: 112, cm: "Mohan Charan Majhi" },
    { name: "Dadra and Nagar Haveli", code: "DN", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 0, rulingSeats: 0, cm: "N/A" },
    { name: "Daman and Diu", code: "DD", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 0, rulingSeats: 0, cm: "N/A" },
    { name: "Goa", code: "GA", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 40, rulingSeats: 28, cm: "Pramod Sawant" },
    { name: "Gujarat", code: "GJ", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 182, rulingSeats: 156, cm: "Bhupendra Patel" },
    { name: "Haryana", code: "HR", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 90, rulingSeats: 41, cm: "Nayab Singh Saini" },
    { name: "Himachal Pradesh", code: "HP", party: "INC", alliance: "INDIA", colorParty: "#00BFFF", colorAlliance: "#00BFFF", totalSeats: 68, rulingSeats: 40, cm: "Sukhvinder Singh Sukhu" },
    { name: "Jammu & Kashmir", code: "JK", party: "No Legislature", alliance: "No Legislature", colorParty: "#666666", colorAlliance: "#666666", totalSeats: 0, rulingSeats: 0, cm: "N/A" },
    { name: "Jharkhand", code: "JH", party: "JMM", alliance: "INDIA", colorParty: "#228B22", colorAlliance: "#00BFFF", totalSeats: 81, rulingSeats: 29, cm: "Champai Soren" },
    { name: "Karnataka", code: "KA", party: "INC", alliance: "INDIA", colorParty: "#00BFFF", colorAlliance: "#00BFFF", totalSeats: 224, rulingSeats: 135, cm: "Siddaramaiah" },
    { name: "Kerala", code: "KL", party: "CPI(M)", alliance: "INDIA", colorParty: "#CC0000", colorAlliance: "#00BFFF", totalSeats: 140, rulingSeats: 62, cm: "Pinarayi Vijayan" },
    { name: "Lakshadweep", code: "LD", party: "NCP", alliance: "NDA", colorParty: "#0066CC", colorAlliance: "#FF9933", totalSeats: 0, rulingSeats: 0, cm: "N/A" },
    { name: "Madhya Pradesh", code: "MP", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 230, rulingSeats: 163, cm: "Mohan Yadav" },
    { name: "Maharashtra", code: "MH", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 288, rulingSeats: 105, cm: "Eknath Shinde" },
    { name: "Manipur", code: "MN", party: "BJP", alliance: "NDA", colorParty: "#FF9933", colorAlliance: "#FF9933", totalSeats: 60, rulingSeats: 37, cm: "N. Biren Singh" },
    { name: "Meghalaya", code: "ML", party: "NPP", alliance: "NDA", colorParty: "#006400", colorAlliance: "#FF9933", totalSeats: 60, rulingSeats: 26, cm: "Conrad Sangma" },
    { name: "Mizoram", code: "MZ", party: "ZPM", alliance: "Others", colorParty: "#FFD700", colorAlliance: "#FF0000", totalSeats: 40, rulingSeats: 27, cm: "Lalduhoma" },
    { name: "Nagaland", code: "NL", party: "NDPP", alliance: "NDA", colorParty: "#006400", colorAlliance: "#FF9933", totalSeats: 60, rulingSeats: 25, cm: "Neiphiu Rio" },
    { name: "NCT of Delhi", code: "DL", party: "AAP", alliance: "INDIA", colorParty: "#0066CC", colorAlliance: "#00BFFF", totalSeats: 70, rulingSeats: 62, cm: "Arvind Kejriwal" },
  ],
};

export const ELECTION_STATES = data.states;

/** State code -> election state object */
export const ELECTION_BY_CODE = Object.fromEntries(
  data.states.map((s) => [s.code, s])
);
