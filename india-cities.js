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

// Top Popular Indian Metros for 1-Tap Selection
var POPULAR_METROS = [
  { city: 'Pune', state: 'Maharashtra', emoji: '📍', badge: 'Popular' },
  { city: 'Mumbai', state: 'Maharashtra', emoji: '🏙️', badge: 'Metro' },
  { city: 'Delhi NCR', state: 'Delhi NCR', emoji: '🏛️', badge: 'Capital' },
  { city: 'Bengaluru', state: 'Karnataka', emoji: '💻', badge: 'Tech Hub' },
  { city: 'Hyderabad', state: 'Telangana', emoji: '💎', badge: 'Metro' },
  { city: 'Ahmedabad', state: 'Gujarat', emoji: '🪁', badge: 'Commercial' },
  { city: 'Kolkata', state: 'West Bengal', emoji: '🚋', badge: 'Metro' },
  { city: 'Chennai', state: 'Tamil Nadu', emoji: '🌊', badge: 'Coastal' },
  { city: 'Jaipur', state: 'Rajasthan', emoji: '🏰', badge: 'Heritage' },
  { city: 'Lucknow', state: 'Uttar Pradesh', emoji: '🕌', badge: 'Cultural' },
  { city: 'Indore', state: 'Madhya Pradesh', emoji: '✨', badge: 'Clean City' },
  { city: 'Chandigarh', state: 'Punjab & Haryana', emoji: '🌳', badge: 'Tri-City' }
];

// Pre-flattened city catalog for lightning-fast sub-millisecond search
var ALL_CITIES_FLAT = [];
for (var stKey in INDIA_STATE_DIRECTORY) {
  var cityArr = INDIA_STATE_DIRECTORY[stKey];
  for (var cIdx = 0; cIdx < cityArr.length; cIdx++) {
    ALL_CITIES_FLAT.push({
      city: cityArr[cIdx],
      state: stKey,
      cleanCity: cityArr[cIdx].toLowerCase(),
      cleanState: stKey.toLowerCase()
    });
  }
}

// Live Autocomplete Search across all 700+ Indian cities
function searchCities(query, limit) {
  if (!query) return [];
  var q = query.trim().toLowerCase();
  limit = limit || 12;
  var exactCity = [];
  var prefixCity = [];
  var containsCity = [];
  var stateMatch = [];
  var seen = {};

  for (var i = 0; i < ALL_CITIES_FLAT.length; i++) {
    var item = ALL_CITIES_FLAT[i];
    var k = item.city + '::' + item.state;
    if (seen[k]) continue;

    if (item.cleanCity === q) {
      exactCity.push(item);
      seen[k] = true;
    } else if (item.cleanCity.indexOf(q) === 0) {
      prefixCity.push(item);
      seen[k] = true;
    } else if (item.cleanCity.indexOf(q) > 0) {
      containsCity.push(item);
      seen[k] = true;
    } else if (item.cleanState.indexOf(q) !== -1) {
      stateMatch.push(item);
      seen[k] = true;
    }
  }
  var merged = exactCity.concat(prefixCity, containsCity, stateMatch);
  return merged.slice(0, limit);
}

// 6-Digit PIN Code Instant Auto-Detection (Official India Post Database)
var _pincodeCache = {};

async function lookupPincode(pincode) {
  var cleanPin = String(pincode || '').replace(/\D/g, '').trim();
  if (cleanPin.length !== 6) {
    return { success: false, message: 'Please enter a valid 6-digit PIN code' };
  }
  if (_pincodeCache[cleanPin]) {
    return _pincodeCache[cleanPin];
  }
  try {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timeoutId = controller ? setTimeout(function() { controller.abort(); }, 6000) : null;
    var res = await fetch('https://api.postalpincode.in/pincode/' + cleanPin, {
      signal: controller ? controller.signal : undefined
    });
    if (timeoutId) clearTimeout(timeoutId);
    var data = await res.json();
    if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
      var poList = data[0].PostOffice;
      var first = poList[0];
      var district = first.District || first.Block || first.Division || '';
      var state = first.State || '';
      var localities = [];
      var seenLoc = {};
      for (var i = 0; i < poList.length; i++) {
        var name = poList[i].Name;
        if (name && !seenLoc[name.toLowerCase()]) {
          seenLoc[name.toLowerCase()] = true;
          localities.push(name);
        }
      }
      var result = {
        success: true,
        pincode: cleanPin,
        city: district,
        district: district,
        state: state,
        localities: localities,
        primaryLocality: localities[0] || district
      };
      _pincodeCache[cleanPin] = result;
      return result;
    } else {
      return { success: false, message: 'PIN code not found in postal directory' };
    }
  } catch (err) {
    return { success: false, message: 'PIN fetch unavailable: ' + (err.message || 'Network error') };
  }
}

// 1-Tap Browser GPS Location Detection
async function detectCurrentLocationGps() {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return { success: false, message: 'Geolocation is not supported by your browser' };
  }
  return new Promise(function(resolve) {
    navigator.geolocation.getCurrentPosition(
      async function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        try {
          var res = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=10&addressdetails=1', {
            headers: { 'Accept': 'application/json' }
          });
          var data = await res.json();
          if (data && data.address) {
            var addr = data.address;
            var city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Pune';
            var state = addr.state || 'Maharashtra';
            resolve({
              success: true,
              city: city,
              state: state,
              lat: lat,
              lon: lon
            });
            return;
          }
        } catch (e) {}
        resolve({
          success: true,
          city: 'Pune',
          state: 'Maharashtra',
          lat: lat,
          lon: lon
        });
      },
      function(error) {
        var msg = 'Location permission denied. Please allow location access or search your city.';
        resolve({ success: false, message: msg });
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}

// Global Location API
var ClubrLocation = {
  POPULAR_METROS: POPULAR_METROS,
  ALL_CITIES_FLAT: ALL_CITIES_FLAT,
  searchCities: searchCities,
  lookupPincode: lookupPincode,
  detectCurrentLocationGps: detectCurrentLocationGps,
  getStateForCity: getStateForCity,
  getCitiesForState: getCitiesForState,
  getStatesList: getStatesList
};

if (typeof window !== 'undefined') {
  window.INDIA_STATE_DIRECTORY = INDIA_STATE_DIRECTORY;
  window.OTHER_CITY_OPTION = OTHER_CITY_OPTION;
  window.OTHER_CITY_LABEL = OTHER_CITY_LABEL;
  window.POPULAR_METROS = POPULAR_METROS;
  window.ALL_CITIES_FLAT = ALL_CITIES_FLAT;
  window.ClubrLocation = ClubrLocation;
  window.getStatesList = getStatesList;
  window.getCitiesForState = getCitiesForState;
  window.getStateForCity = getStateForCity;
  window.searchCities = searchCities;
  window.lookupPincode = lookupPincode;
  window.detectCurrentLocationGps = detectCurrentLocationGps;
}

// Export for Node/CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    INDIA_STATE_DIRECTORY,
    OTHER_CITY_OPTION,
    OTHER_CITY_LABEL,
    POPULAR_METROS,
    ALL_CITIES_FLAT,
    ClubrLocation,
    getStatesList,
    getCitiesForState,
    getStateForCity,
    searchCities,
    lookupPincode,
    detectCurrentLocationGps
  };
}
