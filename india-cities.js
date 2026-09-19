// ========================================================
// Clubr.online — Comprehensive India States & Cities Directory
// All 28 States & 8 Union Territories with exhaustive cities & towns
// ========================================================

var INDIA_STATE_DIRECTORY = {
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Nashik", "Chhatrapati Sambhaji Nagar (Aurangabad)", "Thane", 
    "Navi Mumbai", "Pimpri-Chinchwad", "Kolhapur", "Solapur", "Amravati", "Nanded", "Akola", 
    "Yavatmal", "Chandrapur", "Dhule", "Jalgaon", "Latur", "Satara", "Sangli", "Ahmednagar", 
    "Parbhani", "Jalna", "Bhusawal", "Beed", "Gondia", "Baramati", "Wardha", "Osmanabad (Dharashiv)", 
    "Ratnagiri", "Sindhudurg", "Palghar", "Panvel", "Kalyan-Dombivli", "Vasai-Virar", "Mira-Bhayandar", 
    "Ichalkaranji", "Malegaon", "Alibaug", "Shirdi", "Chiplun", "Karad", "Pandharpur", "Bhandara"
  ],
  "Delhi NCR": [
    "New Delhi", "North Delhi", "South Delhi", "West Delhi", "East Delhi", "Central Delhi", 
    "Noida", "Greater Noida", "Gurgaon (Gurugram)", "Ghaziabad", "Faridabad", "Sonipat", 
    "Manesar", "Bahadurgarh", "Dwarka", "Rohini", "Saket", "Connaught Place", "Karol Bagh"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru (Mysore)", "Hubballi-Dharwad", "Mangaluru (Mangalore)", "Belagavi (Belgaum)", 
    "Davanagere", "Kalaburagi (Gulbarga)", "Udupi", "Shivamogga (Shimoga)", "Ballari (Bellary)", 
    "Tumakuru (Tumkur)", "Vijayapura (Bijapur)", "Bidar", "Hospet", "Gadag-Betageri", "Robertsonpet (KGF)", 
    "Hassan", "Bhadravati", "Chitradurga", "Kolar", "Mandya", "Chikkamagaluru", "Gangavathi", 
    "Bagalkot", "Ranebennuru", "Karwar", "Sirsi", "Madikeri (Coorg)", "Ramanagara", "Yadgir"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara (Baroda)", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", 
    "Junagadh", "Anand", "Navsari", "Morbi", "Nadiad", "Surendranagar", "Bharuch", "Mehsana", 
    "Bhuj", "Porbandar", "Palanpur", "Valsad", "Vapi", "Gondal", "Veraval", "Godhra", "Patan", 
    "Kalol", "Dahod", "Botad", "Amreli", "Deesa", "Jetpur", "Ankleshwar", "Modasa", "Gandhidham"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj (Allahabad)", "Meerut", "Bareilly", 
    "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Greater Noida", "Firozabad", 
    "Jhansi", "Muzaffarnagar", "Mathura", "Ayodhya (Faizabad)", "Rampur", "Shahjahanpur", 
    "Farrukhabad", "Mau", "Hapur", "Etawah", "Mirzapur", "Bulandshahr", "Sambhal", "Amroha", 
    "Hardoi", "Fatehpur", "Raebareli", "Orai", "Sitapur", "Bahraich", "Modinagar", "Unnao", 
    "Jaunpur", "Lakhimpur", "Hathras", "Banda", "Pilibhit", "Barabanki", "Khurja", "Gonda", "Mainpuri", "Basti"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli (Trichy)", "Salem", "Tirunelveli", 
    "Tiruppur", "Vellore", "Erode", "Thoothukudi (Tuticorin)", "Dindigul", "Thanjavur", 
    "Ranipet", "Sivakasi", "Karur", "Udhagamandalam (Ooty)", "Hosur", "Nagercoil", "Kanchipuram", 
    "Kumarapalayam", "Karaikkudi", "Neyveli", "Cuddalore", "Kumbakonam", "Tiruvannamalai", 
    "Pollachi", "Rajapalayam", "Gudiyatham", "Pudukkottai", "Vaniyambadi", "Ambur", "Nagapattinam"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", 
    "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Siddipet", "Jagtial", "Mancherial", 
    "Kothagudem", "Bodhan", "Palwancha", "Kamareddy", "Sircilla", "Wanaparthy", "Vikarabad"
  ],
  "Andhra Pradesh": [
    "Visakhapatnam (Vizag)", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", 
    "Tirupati", "Kadapa (Cuddapah)", "Kakinada", "Anantapur", "Vizianagaram", "Eluru", 
    "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", 
    "Hindupur", "Bhimavaram", "Madanapalle", "Guntakal", "Dharmavaram", "Gudivada", "Srikakulam", "Narasaraopet"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", 
    "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Kishangarh", "Baran", "Dholpur", 
    "Tonk", "Beawar", "Hanumangarh", "Sawai Madhopur", "Churu", "Jhunjhunu", "Barmer", 
    "Gangapur", "Hindaun", "Bhiwadi", "Nagaur", "Makrana", "Sujangarh", "Jaisalmer", "Mount Abu"
  ],
  "Madhya Pradesh": [
    "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", 
    "Ratlam", "Rewa", "Murwara (Katni)", "Singrauli", "Burhanpur", "Khandwa", "Bhind", 
    "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", 
    "Khargone", "Neemuch", "Pithampur", "Hoshangabad (Narmadapuram)", "Itarsi", "Sehore", "Betul", "Seoni", "Datia"
  ],
  "West Bengal": [
    "Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur", "Bardhaman (Burdwan)", "Malda", 
    "Baharampur", "Habra", "Kharagpur", "Shantipur", "Dankuni", "Dhulian", "Ranaghat", 
    "Haldia", "Raiganj", "Krishnanagar", "Nabadwip", "Midnapore", "Balurghat", "Basirhat", 
    "Bankura", "Chakdaha", "Darjeeling", "Alipurduar", "Purulia", "Jalpaiguri", "Cooch Behar"
  ],
  "Punjab": [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali (SAS Nagar)", 
    "Hoshiarpur", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna", 
    "Phagwara", "Muktsar", "Barnala", "Rajpura", "Firozpur", "Kapurthala", "Sangrur", 
    "Fazilka", "Gobindgarh", "Mansa", "Rupnagar (Ropar)", "Nawanshahr", "Tarn Taran"
  ],
  "Haryana": [
    "Gurgaon (Gurugram)", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", 
    "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa", "Bahadurgarh", 
    "Jind", "Thanesar (Kurukshetra)", "Kaithal", "Rewari", "Palwal", "Hansi", "Narnaul", 
    "Fatehabad", "Tohana", "Narwana", "Mandi Dabwali", "Charkhi Dadri", "Jagadhri"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", 
    "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa", 
    "Sasaram", "Hajipur", "Dehri", "Siwan", "Motihari", "Nawada", "Bagaha", "Buxar", 
    "Kishanganj", "Sitamarhi", "Jamalpur", "Jehanabad", "Aurangabad", "Lakhisarai", "Madhubani", "Samastipur"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Deoghar", "Phusro", 
    "Hazaribagh", "Giridih", "Ramgarh", "Medininagar (Daltonganj)", "Chirkunda", 
    "Chaibasa", "Jhumri Telaiya", "Sahibganj", "Dumka", "Pakur", "Ghatshila", "Simdega", "Gumla", "Lohardaga"
  ],
  "Kerala": [
    "Thiruvananthapuram (Trivandrum)", "Kochi (Cochin)", "Kozhikode (Calicut)", "Kollam (Quilon)", 
    "Thrissur", "Kannur", "Alappuzha (Alleppey)", "Kottayam", "Palakkad", "Manjeri", 
    "Thalassery", "Ponnani", "Vatakara", "Kanhangad", "Payyanur", "Koyilandy", "Kasaragod", 
    "Malappuram", "Nedumangad", "Tirur", "Changanassery", "Attingal", "Idukki", "Wayanad (Kalpetta)"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", 
    "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Rayagada", "Bolangir", 
    "Angul", "Dhenkanal", "Kendujhar (Keonjhar)", "Paradeep", "Jajpur", "Kendrapara", "Bhawanipatna"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", 
    "Bongaigaon", "Karimganj", "Dhubri", "Diphu", "North Lakhimpur", "Goalpara", 
    "Sivasagar", "Barpeta", "Mangaldai", "Lumding", "Haflong", "Golaghat", "Hailakandi"
  ],
  "Chhattisgarh": [
    "Raipur", "Bhilai-Durg", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", 
    "Ambikapur", "Dhamtari", "Mahasamund", "Kanker", "Kawardha", "Chirmiri", "Bhatapara", 
    "Dalli-Rajhara", "Naila Janjgir", "Tilda Newra", "Dongargarh", "Mungeli"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani-Kathgodam", "Rudrapur", "Kashipur", 
    "Rishikesh", "Pithoragarh", "Ramnagar", "Kichha", "Manglaur", "Nainital", "Mussoorie", 
    "Almora", "Kotdwar", "Tehri", "Chamoli (Gopeshwar)", "Uttarkashi", "Srinagar (Garhwal)"
  ],
  "Goa": [
    "Panaji (Panjim)", "Margao (Madgaon)", "Vasco da Gama", "Mapusa", "Ponda", 
    "Bicholim", "Curchorem", "Cuncolim", "Valpoi", "Sanquelim", "Canacona", "Pernem"
  ],
  "Himachal Pradesh": [
    "Shimla", "Dharamshala", "Solan", "Mandi", "Palampur", "Baddi", "Nahan", 
    "Paonta Sahib", "Sundarnagar", "Kullu", "Manali", "Hamirpur", "Una", "Bilaspur", "Chamba"
  ],
  "Jammu & Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua", "Sopore", 
    "Ganderbal", "Pulwama", "Kupwara", "Kulgam", "Rajouri", "Poonch", "Doda", "Reasi", "Kishtwar"
  ],
  "Ladakh": [
    "Leh", "Kargil", "Diskit", "Padum", "Nubra Valley", "Drass"
  ],
  "Chandigarh": [
    "Chandigarh", "Sector 1-20", "Sector 21-40", "Sector 41-60", "Manimajra", "IT Park"
  ],
  "Puducherry": [
    "Puducherry (Pondicherry)", "Karaikal", "Yanam", "Mahe", "Ozhukarai"
  ],
  "Tripura": [
    "Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Belonia", "Khowai", "Teliamura", "Ambassa"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar", "Baghmara", "Cherrapunji (Sohra)", "Mairang"
  ],
  "Manipur": [
    "Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Kakching", "Ukhrul", "Senapati", "Tamenglong"
  ],
  "Nagaland": [
    "Dimapur", "Kohima", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Saitual", "Mamit"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Tezu", "Bomdila", "Aalo (Along)", "Roing"
  ],
  "Sikkim": [
    "Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam", "Rangpo", "Jorethang", "Ravangla"
  ],
  "Andaman & Nicobar": [
    "Port Blair", "Garacharma", "Prothrapur", "Havelock Island (Swaraj Dweep)", "Neil Island", "Diglipur", "Car Nicobar"
  ],
  "Dadra & Nagar Haveli & Daman & Diu": [
    "Daman", "Silvassa", "Diu", "Amli", "Bhimpore", "Kachigam"
  ],
  "Lakshadweep": [
    "Kavaratti", "Agatti", "Andrott", "Amini", "Minicoy", "Kalpeni"
  ]
};

// Constant for custom city fallback
const OTHER_CITY_OPTION = "__OTHER__";
const OTHER_CITY_LABEL = "➕ Other (Enter My City / Town)";

function getStatesList() {
  return Object.keys(INDIA_STATE_DIRECTORY);
}

function getCitiesForState(state) {
  if (!state || !INDIA_STATE_DIRECTORY[state]) {
    // Return all cities flattened if state is 'All' or empty
    if (state === 'All') {
      const all = [];
      Object.values(INDIA_STATE_DIRECTORY).forEach(arr => all.push(...arr));
      return all;
    }
    return INDIA_STATE_DIRECTORY["Maharashtra"] || [];
  }
  return INDIA_STATE_DIRECTORY[state];
}

function getStateForCity(city) {
  if (!city || city === 'All India') return 'Maharashtra';
  const cleanCity = city.trim().toLowerCase();
  for (const [st, cities] of Object.entries(INDIA_STATE_DIRECTORY)) {
    if (cities.some(c => c.toLowerCase() === cleanCity || cleanCity.includes(c.toLowerCase()) || c.toLowerCase().includes(cleanCity))) {
      return st;
    }
  }
  return 'Maharashtra';
}

if (typeof window !== 'undefined') {
  window.INDIA_STATE_DIRECTORY = INDIA_STATE_DIRECTORY;
  window.OTHER_CITY_OPTION = OTHER_CITY_OPTION;
  window.OTHER_CITY_LABEL = OTHER_CITY_LABEL;
  window.getStatesList = getStatesList;
  window.getCitiesForState = getCitiesForState;
  window.getStateForCity = getStateForCity;
}

// Export for Node/CommonJS or attach to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    INDIA_STATE_DIRECTORY,
    OTHER_CITY_OPTION,
    OTHER_CITY_LABEL,
    getStatesList,
    getCitiesForState,
    getStateForCity
  };
}
