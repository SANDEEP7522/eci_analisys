'use client';

import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ── Colors: map to global gradient defs injected in page.js ───────────────────
const COLORS = {
  BJP: 'url(#grad-orange)', INC: 'url(#grad-blue)', SP: 'url(#grad-red)', TMC: 'url(#grad-green)',
  DMK: 'url(#grad-purple)', TDP: 'url(#grad-cyan)', JDU: 'url(#grad-blue)', SS: 'url(#grad-orange)',
  'CPI(M)': 'url(#grad-red)', AIADMK: 'url(#grad-cyan)', BSP: 'url(#grad-gray)',
  NCP: 'url(#grad-amber)', RJD: 'url(#grad-cyan)', JDS: 'url(#grad-red)', Others: 'url(#grad-gray)',
  NC: 'url(#grad-green)', YSRCP: 'url(#grad-purple)', JSP: 'url(#grad-cyan)',
};

const CSS_COLORS = {
  BJP: 'linear-gradient(135deg, #FF5500, #FFB347)',
  INC: 'linear-gradient(135deg, #1E50CC, #78AAFF)',
  SP: 'linear-gradient(135deg, #C82035, #FF6E7A)',
  TMC: 'linear-gradient(135deg, #0A8055, #3DE8A0)',
  DMK: 'linear-gradient(135deg, #7E2ECC, #CF9BFF)',
  TDP: 'linear-gradient(135deg, #0894AA, #5AE2F8)',
  JDU: 'linear-gradient(135deg, #1E50CC, #78AAFF)',
  SS: 'linear-gradient(135deg, #FF5500, #FFB347)',
  'CPI(M)': 'linear-gradient(135deg, #C82035, #FF6E7A)',
  AIADMK: 'linear-gradient(135deg, #0894AA, #5AE2F8)',
  NCP: 'linear-gradient(135deg, #C87A00, #FFD060)',
  BSP: 'linear-gradient(135deg, #506078, #A8BCCC)',
  Others: 'linear-gradient(135deg, #506078, #A8BCCC)',
  NC: 'linear-gradient(135deg, #0A8055, #3DE8A0)',
  YSRCP: 'linear-gradient(135deg, #7E2ECC, #CF9BFF)',
  JSP: 'linear-gradient(135deg, #0894AA, #5AE2F8)',
  RJD: 'linear-gradient(135deg, #1E50CC, #78AAFF)',
  JDS: 'linear-gradient(135deg, #C82035, #FF6E7A)',
};

const RAW_COLORS = {
  BJP: '#FF822D', INC: '#4271FE', SP: '#F04F5C', TMC: '#15B77E',
  DMK: '#B261EC', TDP: '#14C1D7', JDU: '#4271FE', SS: '#FF822D',
  'CPI(M)': '#F04F5C', AIADMK: '#20BFA9', BSP: '#8E9CAE',
  NCP: '#F5A623', RJD: '#22d3ee', JDS: '#f43f5e', Others: '#8E9CAE',
};

// ── Constituency data per state (Lok Sabha 2024) ──────────────────────────────
const CONST_DATA = {
  UP: [
    ['Saharanpur','BJP'],['Kairana','SP'],['Muzaffarnagar','BJP'],['Bijnor','SP'],
    ['Nagina','Others'],['Moradabad','SP'],['Rampur','SP'],['Sambhal','SP'],
    ['Amroha','BJP'],['Meerut','BJP'],['Baghpat','BJP'],['Ghaziabad','BJP'],
    ['Gautam Buddha Nagar','BJP'],['Bulandshahr','BJP'],['Aligarh','BJP'],['Hathras','BJP'],
    ['Mathura','BJP'],['Agra','BJP'],['Fatehpur Sikri','BJP'],['Firozabad','SP'],
    ['Mainpuri','SP'],['Etah','BJP'],['Badaun','SP'],['Aonla','BJP'],
    ['Bareilly','BJP'],['Pilibhit','SP'],['Shahjahanpur','BJP'],['Kheri','SP'],
    ['Dhaurahra','SP'],['Sitapur','SP'],['Hardoi','BJP'],['Misrikh','BJP'],
    ['Unnao','SP'],['Mohanlalganj','BJP'],['Lucknow','BJP'],['Rae Bareli','INC'],
    ['Amethi','BJP'],['Sultanpur','BJP'],['Pratapgarh','SP'],['Farrukhabad','BJP'],
    ['Etawah','SP'],['Kannauj','SP'],['Kanpur','BJP'],['Akbarpur','SP'],
    ['Jalaun','BJP'],['Jhansi','BJP'],['Hamirpur','BJP'],['Banda','SP'],
    ['Fatehpur','SP'],['Kaushambi','SP'],['Allahabad','BJP'],['Phulpur','SP'],
    ['Ambedkar Nagar','SP'],['Shrawasti','SP'],['Domariyaganj','SP'],['Basti','BJP'],
    ['Sant Kabir Nagar','BJP'],['Maharajganj','BJP'],['Gorakhpur','BJP'],['Kushi Nagar','SP'],
    ['Deoria','BJP'],['Bansgaon','SP'],['Lalganj','SP'],['Azamgarh','SP'],
    ['Ghosi','SP'],['Salempur','BJP'],['Ballia','BJP'],['Jaunpur','SP'],
    ['Machhlishahr','SP'],['Ghazipur','SP'],['Chandauli','BJP'],['Varanasi','BJP'],
    ['Bhadohi','Others'],['Mirzapur','Others'],['Robertsganj','BJP'],['Gonda','SP'],
    ['Faizabad','SP'],['Barabanki','INC'],['Bahraich','SP'],['Kaiserganj','Others'],
  ],
  MH: [
    ['Nandurbar','INC'],['Dhule','BJP'],['Jalgaon','BJP'],['Raver','BJP'],
    ['Buldhana','SS'],['Akola','BJP'],['Amravati','INC'],['Wardha','BJP'],
    ['Ramtek','INC'],['Nagpur','BJP'],['Bhandara-Gondiya','BJP'],['Gadchiroli-Chimur','BJP'],
    ['Chandrapur','BJP'],['Yavatmal-Washim','BJP'],['Hingoli','SS'],['Nanded','INC'],
    ['Osmanabad','Others'],['Latur','BJP'],['Solapur','BJP'],['Madha','BJP'],
    ['Sangli','INC'],['Satara','SS'],['Ratnagiri-Sindhudurg','SS'],['Kolhapur','Others'],
    ['Hatkanangle','Others'],['Shirur','INC'],['Ahmednagar','BJP'],['Shirdi','Others'],
    ['Beed','Others'],['Jalna','BJP'],['Aurangabad','SS'],['Dindori','BJP'],
    ['Nashik','SS'],['Palghar','BJP'],['Bhiwandi','INC'],['Kalyan','SS'],
    ['Thane','SS'],['Mumbai North','BJP'],['Mumbai NW','BJP'],['Mumbai North Central','BJP'],
    ['Mumbai North East','BJP'],['Mumbai South Central','INC'],['Mumbai South','BJP'],['Maval','BJP'],
    ['Pune','BJP'],['Baramati','INC'],['Indapur','INC'],['Sholapur','BJP'],
  ],
  WB: [
    ['Cooch Behar','BJP'],['Alipurduars','BJP'],['Jalpaiguri','BJP'],['Darjeeling','BJP'],
    ['Raiganj','BJP'],['Balurghat','BJP'],['Maldaha Uttar','INC'],['Maldaha Dakshin','TMC'],
    ['Jangipur','TMC'],['Murshidabad','TMC'],['Berhampore','TMC'],['Krishnanagar','TMC'],
    ['Ranaghat','BJP'],['Bangaon','BJP'],['Barrackpore','TMC'],['Dum Dum','TMC'],
    ['Barasat','TMC'],['Basirhat','TMC'],['Joynagar','TMC'],['Mathurapur','TMC'],
    ['Diamond Harbour','TMC'],['Jadavpur','TMC'],['Kolkata Dakshin','TMC'],['Kolkata Uttar','TMC'],
    ['Howrah','TMC'],['Uluberia','TMC'],['Srerampur','TMC'],['Hooghly','BJP'],
    ['Arambag','TMC'],['Tamluk','TMC'],['Kanthi','BJP'],['Ghatal','TMC'],
    ['Jhargram','BJP'],['Medinipur','BJP'],['Purulia','BJP'],['Bankura','BJP'],
    ['Bishnupur','TMC'],['Bardhaman Durgapur','TMC'],['Bardhaman Purba','TMC'],['Bolpur','TMC'],
    ['Birbhum','TMC'],['Asansol','TMC'],
  ],
  BR: [
    ['Valmiki Nagar','BJP'],['Paschim Champaran','BJP'],['Purvi Champaran','BJP'],['Sheohar','BJP'],
    ['Sitamarhi','BJP'],['Madhubani','BJP'],['Jhanjharpur','JDU'],['Supaul','JDU'],
    ['Araria','BJP'],['Kishanganj','INC'],['Katihar','BJP'],['Purnia','Others'],
    ['Madhepura','Others'],['Darbhanga','BJP'],['Muzaffarpur','BJP'],['Vaishali','JDU'],
    ['Gopalganj','BJP'],['Siwan','BJP'],['Maharajganj','JDU'],['Saran','BJP'],
    ['Hajipur','JDU'],['Ujiarpur','JDU'],['Samastipur','JDU'],['Begusarai','BJP'],
    ['Khagaria','JDU'],['Bhagalpur','BJP'],['Banka','Others'],['Munger','JDU'],
    ['Nalanda','JDU'],['Patna Sahib','BJP'],['Patliputra','INC'],['Arwal','Others'],
    ['Jahanabad','Others'],['Aurangabad','Others'],['Gaya','JDU'],['Nawada','Others'],
    ['Jamui','Others'],['Buxar','BJP'],['Sasaram','INC'],['Karakat','Others'],
  ],
  TN: [
    ['Thiruvallur','DMK'],['Chennai North','DMK'],['Chennai South','DMK'],['Chennai Central','DMK'],
    ['Sriperumbudur','DMK'],['Kancheepuram','DMK'],['Arakkonam','DMK'],['Vellore','DMK'],
    ['Krishnagiri','DMK'],['Dharmapuri','DMK'],['Tiruvannamalai','DMK'],['Arani','DMK'],
    ['Viluppuram','DMK'],['Kallakurichi','DMK'],['Salem','DMK'],['Namakkal','DMK'],
    ['Erode','INC'],['Tiruppur','INC'],['Nilgiris','INC'],['Coimbatore','INC'],
    ['Pollachi','INC'],['Dindigul','DMK'],['Karur','INC'],['Tiruchirappalli','INC'],
    ['Perambalur','DMK'],['Cuddalore','DMK'],['Chidambaram','INC'],['Mayiladuthurai','DMK'],
    ['Nagapattinam','DMK'],['Thanjavur','DMK'],['Sivaganga','INC'],['Madurai','DMK'],
    ['Theni','AIADMK'],['Virudhunagar','DMK'],['Ramanathapuram','Others'],['Thoothukudi','DMK'],
    ['Tirunelveli','INC'],['Kanniyakumari','INC'],['Tenkasi','Others'],
  ],
  GJ: [
    ['Kutch','BJP'],['Banaskantha','BJP'],['Patan','BJP'],['Mahesana','BJP'],
    ['Sabarkantha','BJP'],['Gandhi Nagar','BJP'],['Ahmedabad East','BJP'],['Ahmedabad West','BJP'],
    ['Surendranagar','BJP'],['Rajkot','BJP'],['Porbandar','BJP'],['Jamnagar','BJP'],
    ['Junagadh','BJP'],['Amreli','BJP'],['Bhavnagar','BJP'],['Anand','BJP'],
    ['Kheda','BJP'],['Panchmahal','BJP'],['Dahod','BJP'],['Vadodara','BJP'],
    ['Chhota Udaipur','BJP'],['Bharuch','BJP'],['Bardoli','BJP'],['Surat','BJP'],
    ['Navsari','BJP'],['Valsad','BJP'],
  ],
  RJ: [
    ['Ganganagar','BJP'],['Bikaner','BJP'],['Churu','BJP'],['Jhunjhunu','INC'],
    ['Sikar','INC'],['Jaipur Rural','BJP'],['Jaipur','BJP'],['Alwar','INC'],
    ['Bharatpur','INC'],['Karauli-Dholpur','INC'],['Dausa','INC'],['Tonk-Sawai Madhopur','INC'],
    ['Ajmer','BJP'],['Nagaur','Others'],['Pali','BJP'],['Jodhpur','BJP'],
    ['Barmer','INC'],['Jalore','BJP'],['Udaipur','BJP'],['Banswara','Others'],
    ['Chittorgarh','BJP'],['Rajsamand','BJP'],['Bhilwara','BJP'],['Kota','BJP'],
    ['Jhalawar-Baran','BJP'],
  ],
  KL: [
    ['Kasaragod','INC'],['Kannur','INC'],['Vadakara','INC'],['Wayanad','INC'],
    ['Kozhikode','INC'],['Malappuram','Others'],['Ponnani','Others'],['Palakkad','INC'],
    ['Alathur','INC'],['Thrissur','BJP'],['Chalakudy','INC'],['Ernakulam','INC'],
    ['Idukki','INC'],['Kottayam','Others'],['Alappuzha','INC'],['Mavelikkara','INC'],
    ['Pathanamthitta','INC'],['Kollam','INC'],['Attingal','INC'],['Thiruvananthapuram','INC'],
  ],
  KA: [
    ['Chikkaballapur','INC'],['Bangalore Rural','JDS'],['Kolar','INC'],['Chikodi','INC'],
    ['Belgaum','BJP'],['Bagalkot','BJP'],['Bijapur','BJP'],['Gulbarga','INC'],
    ['Raichur','INC'],['Bidar','INC'],['Koppal','BJP'],['Bellary','INC'],
    ['Haveri','BJP'],['Dharwad','BJP'],['Uttara Kannada','BJP'],['Davanagere','BJP'],
    ['Shimoga','BJP'],['Udupi Chikmagalur','BJP'],['Hassan','JDS'],['Dakshina Kannada','BJP'],
    ['Chitradurga','BJP'],['Tumkur','BJP'],['Mandya','INC'],['Mysore','BJP'],
    ['Chamarajanagar','INC'],['Bangalore North','BJP'],['Bangalore Central','BJP'],['Bangalore South','BJP'],
  ],
  MP: [
    ['Morena','BJP'],['Bhind','BJP'],['Gwalior','BJP'],['Guna','BJP'],
    ['Sagar','BJP'],['Tikamgarh','BJP'],['Damoh','BJP'],['Khajuraho','BJP'],
    ['Satna','BJP'],['Rewa','BJP'],['Sidhi','BJP'],['Shahdol','BJP'],
    ['Jabalpur','BJP'],['Mandla','BJP'],['Balaghat','BJP'],['Chhindwara','INC'],
    ['Hoshangabad','BJP'],['Vidisha','BJP'],['Bhopal','BJP'],['Rajgarh','BJP'],
    ['Dewas','BJP'],['Ujjain','BJP'],['Mandsour','BJP'],['Ratlam','BJP'],
    ['Dhar','BJP'],['Indore','BJP'],['Betul','BJP'],['Harda','BJP'],
    ['Khandwa','BJP'],
  ],
  OD: [
    ['Bargarh','BJP'],['Sundargarh','BJP'],['Sambalpur','BJP'],['Keonjhar','BJP'],
    ['Mayurbhanj','BJP'],['Balasore','BJP'],['Bhadrak','BJP'],['Jajpur','BJP'],
    ['Dhenkanal','BJP'],['Bolangir','BJP'],['Kalahandi','BJP'],['Nabarangpur','BJP'],
    ['Kandhamal','BJP'],['Cuttack','BJP'],['Kendrapara','BJP'],['Jagatsinghpur','BJP'],
    ['Puri','BJP'],['Bhubaneswar','BJP'],['Aska','BJP'],['Berhampur','BJP'],
    ['Koraput','BJP'],
  ],
  AS: [
    ['Karimganj','INC'],['Silchar','BJP'],['Autonomous District','BJP'],['Dhubri','Others'],
    ['Kokrajhar','Others'],['Barpeta','INC'],['Gauhati','BJP'],['Mangaldoi','BJP'],
    ['Tezpur','BJP'],['Nowgong','BJP'],['Kaliabor','BJP'],['Jorhat','BJP'],
    ['Dibrugarh','BJP'],['Lakhimpur','BJP'],
  ],
  HR: [
    ['Ambala','BJP'],['Kurukshetra','BJP'],['Sirsa','BJP'],['Hisar','BJP'],
    ['Bhiwani-Mahendragarh','BJP'],['Gurgaon','BJP'],['Faridabad','BJP'],
    ['Rohtak','INC'],['Sonipat','INC'],['Karnal','BJP'],
  ],
  DL: [
    ['Chandni Chowk','BJP'],['North East Delhi','BJP'],['East Delhi','BJP'],
    ['New Delhi','BJP'],['North West Delhi','BJP'],['West Delhi','BJP'],['South Delhi','BJP'],
  ],
  PB: [
    ['Gurdaspur','BJP'],['Amritsar','INC'],['Khadoor Sahib','Others'],['Jalandhar','INC'],
    ['Hoshiarpur','BJP'],['Anandpur Sahib','INC'],['Ludhiana','INC'],
    ['Fatehgarh Sahib','INC'],['Faridkot','Others'],['Firozpur','BJP'],
    ['Bathinda','INC'],['Sangrur','Others'],['Patiala','INC'],
  ],
  TS: [
    ['Adilabad','BJP'],['Peddapalle','INC'],['Karimnagar','BJP'],['Nizamabad','INC'],
    ['Zahirabad','INC'],['Medak','INC'],['Malkajgiri','INC'],['Secunderabad','BJP'],
    ['Hyderabad','Others'],['Chevella','INC'],['Mahbubnagar','INC'],['Nagarkurnool','INC'],
    ['Nalgonda','INC'],['Bhongir','INC'],['Warangal','INC'],['Mahabubabad','Others'],
    ['Khammam','INC'],
  ],
  AP: [
    ['Araku','TDP'],['Srikakulam','TDP'],['Vizianagaram','TDP'],['Visakhapatnam','TDP'],
    ['Anakapalle','TDP'],['Kakinada','TDP'],['Amalapuram','TDP'],['Rajamahendravaram','TDP'],
    ['Narasapuram','TDP'],['Eluru','TDP'],['Machilipatnam','TDP'],['Vijayawada','TDP'],
    ['Guntur','TDP'],['Narasaraopeta','TDP'],['Bapatla','TDP'],['Ongole','TDP'],
    ['Nandyal','TDP'],['Kurnool','INC'],['Anantapur','TDP'],['Hindupur','TDP'],
    ['Kadapa','Others'],['Nellore','TDP'],['Tirupati','INC'],['Rajampet','TDP'],
    ['Chittoor','TDP'],
  ],
};

// ── Generate synthetic data for unlisted states ───────────────────────────────
function generateFromState(s, rich) {
  if (!s) return [];
  const total = s.seats || 10;
  const rows  = [];
  if (rich) {
    let c = 1;
    Object.entries(rich).forEach(([k, v]) => {
      if (k !== 'state' && k !== 'region') {
        for (let i = 0; i < v; i++) { rows.push([`${s.id}-${c++}`, k]); }
      }
    });
    // Fill remaining seats as others if there's any deficit
    while (c <= total) { rows.push([`${s.id}-Oth-${c++}`, 'Others']); }
    return rows;
  }
  
  // Fallback to simplistic single party + Others logic if no rich data
  const won   = Math.min(s.won || Math.round(total * 0.5), total);
  const party = s.party || 'Others';
  for (let i = 0; i < won;          i++) rows.push([`${s.id}-${i + 1}`,       party]);
  for (let i = 0; i < total - won;  i++) rows.push([`${s.id}-Oth-${i + 1}`,   'Others']);
  return rows;
}

// ── Bubble chart data per year ────────────────────────────────────────────────
// x = vote share %, y = seats won, z = bubble size (seats, drives radius)
const BUBBLE_BY_YEAR = {
  '1999': [
    { party: 'BJP',    x: 23.7, y: 182, z: 182 },
    { party: 'INC',    x: 28.3, y: 114, z: 114 },
    { party: 'TDP',    x: 3.4,  y: 29,  z: 29  },
    { party: 'SP',     x: 4.1,  y: 26,  z: 26  },
    { party: 'SS',     x: 1.6,  y: 15,  z: 15  },
    { party: 'BSP',    x: 4.2,  y: 14,  z: 14  },
    { party: 'DMK',    x: 1.4,  y: 12,  z: 12  },
    { party: 'Others', x: 33.3, y: 151, z: 151 },
  ],
  '2004': [
    { party: 'INC',    x: 26.5, y: 145, z: 145 },
    { party: 'BJP',    x: 22.2, y: 138, z: 138 },
    { party: 'SP',     x: 4.6,  y: 36,  z: 36  },
    { party: 'BSP',    x: 5.3,  y: 19,  z: 19  },
    { party: 'DMK',    x: 1.8,  y: 16,  z: 16  },
    { party: 'NCP',    x: 1.8,  y: 9,   z: 9   },
    { party: 'Others', x: 37.8, y: 180, z: 180 },
  ],
  '2009': [
    { party: 'INC',    x: 28.6, y: 206, z: 206 },
    { party: 'BJP',    x: 18.8, y: 116, z: 116 },
    { party: 'SP',     x: 3.2,  y: 23,  z: 23  },
    { party: 'BSP',    x: 6.2,  y: 21,  z: 21  },
    { party: 'JDU',    x: 1.5,  y: 20,  z: 20  },
    { party: 'DMK',    x: 1.7,  y: 18,  z: 18  },
    { party: 'TMC',    x: 2.2,  y: 19,  z: 19  },
    { party: 'Others', x: 37.8, y: 120, z: 120 },
  ],
  '2014': [
    { party: 'BJP',    x: 31.0, y: 282, z: 282 },
    { party: 'INC',    x: 19.3, y: 44,  z: 44  },
    { party: 'AIADMK', x: 3.3,  y: 37,  z: 37  },
    { party: 'TMC',    x: 3.8,  y: 34,  z: 34  },
    { party: 'TDP',    x: 2.6,  y: 16,  z: 16  },
    { party: 'SP',     x: 3.4,  y: 5,   z: 5   },
    { party: 'JDU',    x: 1.5,  y: 2,   z: 2   },
    { party: 'Others', x: 35.2, y: 123, z: 123 },
  ],
  '2019': [
    { party: 'BJP',    x: 37.4, y: 303, z: 303 },
    { party: 'INC',    x: 19.5, y: 52,  z: 52  },
    { party: 'DMK',    x: 2.3,  y: 23,  z: 23  },
    { party: 'TMC',    x: 4.1,  y: 22,  z: 22  },
    { party: 'SS',     x: 2.1,  y: 18,  z: 18  },
    { party: 'JDU',    x: 1.5,  y: 16,  z: 16  },
    { party: 'SP',     x: 2.5,  y: 5,   z: 5   },
    { party: 'Others', x: 30.7, y: 104, z: 104 },
  ],
  '2024': [
    { party: 'BJP',    x: 36.6, y: 240, z: 240 },
    { party: 'INC',    x: 21.2, y: 99,  z: 99  },
    { party: 'SP',     x: 4.6,  y: 37,  z: 37  },
    { party: 'TMC',    x: 4.4,  y: 29,  z: 29  },
    { party: 'DMK',    x: 3.2,  y: 22,  z: 22  },
    { party: 'TDP',    x: 2.0,  y: 16,  z: 16  },
    { party: 'JDU',    x: 1.8,  y: 12,  z: 12  },
    { party: 'SS',     x: 1.5,  y: 7,   z: 7   },
    { party: 'Others', x: 24.7, y: 81,  z: 81  },
  ],
};

const BubbleTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[var(--t-bgCardSolid)] border border-[var(--t-border)] rounded px-2 py-1.5 text-[10px]">
      <div className="font-bold mb-0.5" style={{ color: COLORS[d.party] || '#fff' }}>{d.party}</div>
      <div className="text-[var(--t-textSec)]">Vote Share: {d.x}%</div>
      <div className="text-[var(--t-textSec)]">Seats Won: {d.y}</div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function ConstituencyScatter({ selectedState, richState, selectedYear }) {
  const [hov, setHov] = useState(null);

  // ── No state selected: show bubble chart ─────────────────────────────────
  if (!selectedState) {
    const bubbleData = BUBBLE_BY_YEAR[selectedYear] || BUBBLE_BY_YEAR['2024'];
    const maxSeats   = Math.max(...bubbleData.map(d => d.y));
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 8, bottom: 14, left: -16 }}>
          <XAxis dataKey="x" type="number" name="Vote %" domain={[0, 42]} unit="%" tick={{ fontSize: 9, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} label={{ value: 'Vote Share %', position: 'insideBottom', offset: -2, fontSize: 8, fill: 'var(--t-textMut)' }} />
          <YAxis dataKey="y" type="number" name="Seats" domain={[0, maxSeats + 30]} tick={{ fontSize: 9, fill: 'var(--t-textMut)' }} axisLine={false} tickLine={false} />
          <ZAxis dataKey="z" range={[60, 1100]} />
          <Tooltip content={<BubbleTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'var(--t-border)' }} />
          <Scatter data={bubbleData} fillOpacity={0.75}>
            {bubbleData.map((d, i) => (
              <Cell key={i} fill={COLORS[d.party] || '#8E9CAE'} stroke={COLORS[d.party] || '#8E9CAE'} strokeWidth={1} strokeOpacity={0.4} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  // ── State selected: show constituency waffle grid ─────────────────────────
  const rawData = CONST_DATA[selectedState.id] || generateFromState(selectedState, richState);
  const seats   = rawData.map(([name, party], i) => ({ id: i, name, party }));

  // Party seat summary
  const summary = {};
  seats.forEach(s => { summary[s.party] = (summary[s.party] || 0) + 1; });
  const summaryEntries = Object.entries(summary).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col h-full gap-1.5 overflow-hidden">

      {/* State name + total */}
      <div className="flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-black text-[var(--t-text)] truncate">{selectedState.name}</span>
        <span className="text-[9px] text-[var(--t-textSec)] font-medium">{seats.length} seats</span>
      </div>

      {/* Waffle grid */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-[2px] content-start">
          {seats.map(s => (
            <div
              key={s.id}
              className="rounded-[2px] cursor-pointer transition-all duration-150 hover:scale-125 hover:z-10 relative"
              style={{
                width: 13, height: 13,
                background: CSS_COLORS[s.party] || '#8E9CAE',
                opacity: hov && hov.party !== s.party ? 0.2 : 1,
                boxShadow: hov?.id === s.id ? `0 0 6px ${RAW_COLORS[s.party] || '#fff'}` : 'none',
              }}
              onMouseEnter={() => setHov(s)}
              onMouseLeave={() => setHov(null)}
            />
          ))}
        </div>
      </div>

      {/* Hover tooltip */}
      <div
        className="flex-shrink-0 rounded px-2 py-1 text-[9px] transition-all min-h-[22px]"
        style={{ background: 'var(--t-bgCard)', border: '1px solid var(--t-border)' }}
      >
        {hov ? (
          <>
            <span className="font-bold" style={{ color: RAW_COLORS[hov.party] || '#fff' }}>{hov.party}</span>
            <span className="text-[var(--t-textSec)] ml-1.5">{hov.name}</span>
          </>
        ) : (
          <span className="text-[var(--t-textSec)] font-bold">Hover a cell to see constituency</span>
        )}
      </div>

      {/* Party summary bar */}
      <div className="flex-shrink-0 border-t border-[var(--t-border)] pt-1 flex flex-wrap gap-x-2.5 gap-y-0.5">
        {summaryEntries.map(([party, count]) => (
          <div key={party} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: CSS_COLORS[party] || '#8E9CAE' }} />
            <span className="text-[9px] font-bold" style={{ color: RAW_COLORS[party] || '#8E9CAE' }}>{party}</span>
            <span className="text-[9px] text-[var(--t-textSec)] font-black">{count}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
