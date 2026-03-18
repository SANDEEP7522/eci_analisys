/**
 * Static data for Indian states and union territories.
 * Maps state/UT codes (from TopoJSON) to display info and URL slugs.
 */

/** State code (id in TopoJSON) -> StateInfo */
export const STATE_CODE_TO_INFO = {
  AN: {
    code: "AN",
    name: "Andaman & Nicobar Islands",
    slug: "andaman-nicobar-islands",
    capital: "Port Blair",
    population: 434192,
    areaSqKm: 8249,
    districts: 3,
    districtNames: ["Nicobar", "North and Middle Andaman", "South Andaman"],
  },
  AP: {
    code: "AP",
    name: "Andhra Pradesh",
    slug: "andhra-pradesh",
    capital: "Amaravati",
    population: 49386799,
    areaSqKm: 162968,
    districts: 26,
    districtNames: ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "Alluri Sitharama Raju", "Anakapalli", "Annamayya", "Bapatla", "Eluru", "Kakinada", "Konaseema", "Nandyal", "NTR", "Palnadu", "Parvathipuram Manyam", "Sri Sathya Sai", "Tirupati"],
  },
  AR: {
    code: "AR",
    name: "Arunachal Pradesh",
    slug: "arunachal-pradesh",
    capital: "Itanagar",
    population: 1583323,
    areaSqKm: 83743,
    districts: 26,
    districtNames: ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Upper Siang", "Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding", "Kamle", "Leparada", "Pakke Kessang", "Shi Yomi", "Lower Siang", "Kra Daadi"],
  },
  AS: {
    code: "AS",
    name: "Assam",
    slug: "assam",
    capital: "Dispur",
    population: 31205576,
    areaSqKm: 78438,
    districts: 35,
    districtNames: ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  },
  BR: { code: "BR", name: "Bihar", slug: "bihar", capital: "Patna", population: 104099452, areaSqKm: 94163, districts: 38 },
  CT: { code: "CT", name: "Chhattisgarh", slug: "chhattisgarh", capital: "Raipur", population: 29436262, areaSqKm: 135192, districts: 33 },
  PY: { code: "PY", name: "Puducherry", slug: "puducherry", capital: "Puducherry", population: 1247953, areaSqKm: 479, districts: 4, districtNames: ["Puducherry", "Karaikal", "Mahe", "Yanam"] },
  PB: { code: "PB", name: "Punjab", slug: "punjab", capital: "Chandigarh", population: 27743338, areaSqKm: 50362, districts: 23 },
  RJ: { code: "RJ", name: "Rajasthan", slug: "rajasthan", capital: "Jaipur", population: 68548437, areaSqKm: 342239, districts: 33 },
  SK: { code: "SK", name: "Sikkim", slug: "sikkim", capital: "Gangtok", population: 657876, areaSqKm: 7096, districts: 4, districtNames: ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"] },
  TN: { code: "TN", name: "Tamil Nadu", slug: "tamil-nadu", capital: "Chennai", population: 72147030, areaSqKm: 130058, districts: 38 },
  CH: { code: "CH", name: "Chandigarh", slug: "chandigarh", capital: "Chandigarh", population: 1055450, areaSqKm: 114, districts: 1, districtNames: ["Chandigarh"] },
  TS: { code: "TS", name: "Telangana", slug: "telangana", capital: "Hyderabad", population: 35003674, areaSqKm: 112077, districts: 33 },
  TR: { code: "TR", name: "Tripura", slug: "tripura", capital: "Agartala", population: 3671032, areaSqKm: 10486, districts: 8 },
  UP: { code: "UP", name: "Uttar Pradesh", slug: "uttar-pradesh", capital: "Lucknow", population: 199812341, areaSqKm: 243286, districts: 75 },
  UK: { code: "UK", name: "Uttarakhand", slug: "uttarakhand", capital: "Dehradun", population: 10086292, areaSqKm: 53483, districts: 13 },
  WB: { code: "WB", name: "West Bengal", slug: "west-bengal", capital: "Kolkata", population: 91276115, areaSqKm: 88752, districts: 23 },
  OD: { code: "OD", name: "Odisha", slug: "odisha", capital: "Bhubaneswar", population: 41974218, areaSqKm: 155707, districts: 30 },
  DN: { code: "DN", name: "Dadra and Nagar Haveli", slug: "dadra-nagar-haveli", capital: "Silvassa", population: 586956, areaSqKm: 491, districts: 1, districtNames: ["Dadra and Nagar Haveli"] },
  DD: { code: "DD", name: "Daman and Diu", slug: "daman-diu", capital: "Daman", population: 585764, areaSqKm: 112, districts: 2, districtNames: ["Daman", "Diu"] },
  GA: { code: "GA", name: "Goa", slug: "goa", capital: "Panaji", population: 1458545, areaSqKm: 3702, districts: 2, districtNames: ["North Goa", "South Goa"] },
  GJ: { code: "GJ", name: "Gujarat", slug: "gujarat", capital: "Gandhinagar", population: 60439692, areaSqKm: 196024, districts: 33 },
  HR: { code: "HR", name: "Haryana", slug: "haryana", capital: "Chandigarh", population: 25351462, areaSqKm: 44212, districts: 22 },
  HP: { code: "HP", name: "Himachal Pradesh", slug: "himachal-pradesh", capital: "Shimla", population: 6864602, areaSqKm: 55673, districts: 12 },
  JK: { code: "JK", name: "Jammu & Kashmir", slug: "jammu-kashmir", capital: "Srinagar (Summer), Jammu (Winter)", population: 12267013, areaSqKm: 125535, districts: 20 },
  JH: { code: "JH", name: "Jharkhand", slug: "jharkhand", capital: "Ranchi", population: 32988134, areaSqKm: 79714, districts: 24 },
  KA: { code: "KA", name: "Karnataka", slug: "karnataka", capital: "Bengaluru", population: 61130704, areaSqKm: 191791, districts: 31 },
  KL: { code: "KL", name: "Kerala", slug: "kerala", capital: "Thiruvananthapuram", population: 33406061, areaSqKm: 38863, districts: 14 },
  LD: { code: "LD", name: "Lakshadweep", slug: "lakshadweep", capital: "Kavaratti", population: 64473, areaSqKm: 32, districts: 1, districtNames: ["Lakshadweep"] },
  MP: { code: "MP", name: "Madhya Pradesh", slug: "madhya-pradesh", capital: "Bhopal", population: 72626809, areaSqKm: 308245, districts: 55 },
  MH: { code: "MH", name: "Maharashtra", slug: "maharashtra", capital: "Mumbai", population: 112374333, areaSqKm: 307713, districts: 36 },
  MN: { code: "MN", name: "Manipur", slug: "manipur", capital: "Imphal", population: 2855794, areaSqKm: 22327, districts: 16 },
  ML: { code: "ML", name: "Meghalaya", slug: "meghalaya", capital: "Shillong", population: 2966889, areaSqKm: 22429, districts: 12 },
  MZ: { code: "MZ", name: "Mizoram", slug: "mizoram", capital: "Aizawl", population: 1097206, areaSqKm: 21081, districts: 11 },
  NL: { code: "NL", name: "Nagaland", slug: "nagaland", capital: "Kohima", population: 1978502, areaSqKm: 16579, districts: 16 },
  DL: { code: "DL", name: "NCT of Delhi", slug: "delhi", capital: "New Delhi", population: 16787941, areaSqKm: 1484, districts: 11 },
};

export const ALL_STATES = Object.values(STATE_CODE_TO_INFO);

export const SLUG_TO_STATE = Object.fromEntries(ALL_STATES.map((s) => [s.slug, s]));

export function getStateByTopoName(topoName) {
  if (!topoName) return undefined;
  const normalized = topoName.trim();
  return ALL_STATES.find(
    (s) =>
      s.name === normalized ||
      s.name.replace(/&/g, "&") === normalized ||
      (normalized === "Arunanchal Pradesh" && s.code === "AR") ||
      (normalized === "Dadara & Nagar Havelli" && s.code === "DN")
  );
}

export function getStateByCode(code) {
  return STATE_CODE_TO_INFO[code];
}

export function getStateBySlug(slug) {
  return SLUG_TO_STATE[slug];
}
