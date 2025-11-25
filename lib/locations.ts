// Bangladesh location data for dropdowns
export const bangladeshLocations = {
  divisions: [
    "Dhaka",
    "Chattogram",
    "Rajshahi",
    "Khulna",
    "Barishal",
    "Sylhet",
    "Rangpur",
    "Mymensingh"
  ],
  
  districts: {
    Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Munshiganj", "Manikganj", "Narsingdi", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur", "Kishoreganj"],
    Chattogram: ["Chattogram", "Cox's Bazar", "Rangamati", "Bandarban", "Khagrachari", "Feni", "Lakshmipur", "Comilla", "Noakhali", "Brahmanbaria", "Chandpur"],
    Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Sirajganj", "Natore", "Naogaon", "Chapainawabganj", "Joypurhat"],
    Khulna: ["Khulna", "Jessore", "Satkhira", "Bagerhat", "Jhenaidah", "Magura", "Narail", "Chuadanga", "Kushtia", "Meherpur"],
    Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur", "Jhalokathi", "Barguna"],
    Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
    Rangpur: ["Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Thakurgaon"],
    Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
  },
  
  thanas: {
    // Dhaka District - All Thanas
    Dhaka: ["Adabor", "Badda", "Banani", "Bangshal", "Bhashantek", "Cantonment", "Chackbazar", "Dakshinkhan", "Darus Salam", "Demra", "Dhanmondi", "Gendaria", "Gulshan", "Hazaribagh", "Jatrabari", "Kafrul", "Kalabagan", "Kamrangirchar", "Khilgaon", "Khilkhet", "Kotwali", "Lalbagh", "Mirpur", "Mohammadpur", "Motijheel", "New Market", "Pallabi", "Paltan", "Ramna", "Rampura", "Sabujbagh", "Shah Ali", "Shahbag", "Shahjahanpur", "Sher-e-Bangla Nagar", "Shyampur", "Sutrapur", "Tejgaon", "Tejgaon Industrial Area", "Turag", "Uttara", "Uttara West", "Uttar Khan", "Vatara", "Wari"],
    
    // Gazipur District
    Gazipur: ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj", "Tongi"],
    
    // Narayanganj District
    Narayanganj: ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar", "Siddhirganj"],
    
    // Tangail District
    Tangail: ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari"],
    
    // Munshiganj District
    Munshiganj: ["Munshiganj Sadar", "Sreenagar", "Sirajdikhan", "Louhajang", "Gazaria", "Tongibari"],
    
    // Manikganj District
    Manikganj: ["Manikganj Sadar", "Singair", "Shibalaya", "Saturia", "Harirampur", "Ghior", "Daulatpur"],
    
    // Narsingdi District
    Narsingdi: ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"],
    
    // Faridpur District
    Faridpur: ["Faridpur Sadar", "Alfadanga", "Boalmari", "Sadarpur", "Nagarkanda", "Bhanga", "Charbhadrasan", "Madhukhali", "Saltha"],
    
    // Gopalganj District
    Gopalganj: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
    
    // Madaripur District
    Madaripur: ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar"],
    
    // Rajbari District
    Rajbari: ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"],
    
    // Shariatpur District
    Shariatpur: ["Shariatpur Sadar", "Naria", "Zanjira", "Damudya", "Bhedarganj", "Gosairhat"],
    
    // Kishoreganj District
    Kishoreganj: ["Kishoreganj Sadar", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail", "Austagram"],
    
    // Chattogram District - All Thanas
    Chattogram: ["Akbar Shah", "Anwara", "Bakalia", "Bandar", "Bayazid Bostami", "Boalkhali", "Chandgaon", "Chandanaish", "Chittagong Port", "Double Mooring", "EPZ", "Fatikchhari", "Halishahar", "Hathazari", "Karnaphuli", "Khulshi", "Kotwali", "Lohagara", "Mirsharai", "Pahartali", "Panchlaish", "Patiya", "Patenga", "Rangunia", "Raozan", "Sadarghat", "Sandwip", "Satkania", "Sitakunda"],
    
    // Cox's Bazar District
    "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Kutubdia", "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia"],
    
    // Rangamati District
    Rangamati: ["Rangamati Sadar", "Baghaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"],
    
    // Bandarban District
    Bandarban: ["Bandarban Sadar", "Alikadam", "Lama", "Naikhongchhari", "Rowangchhari", "Ruma", "Thanchi"],
    
    // Khagrachari District
    Khagrachari: ["Khagrachari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh"],
    
    // Feni District
    Feni: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Fulgazi", "Parshuram", "Sonagazi"],
    
    // Lakshmipur District
    Lakshmipur: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
    
    // Comilla District
    Comilla: ["Comilla Sadar", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Meghna", "Muradnagar", "Nangalkot", "Titas", "Monohargonj", "Sadar South"],
    
    // Noakhali District
    Noakhali: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabirhat", "Senbagh", "Sonaimuri", "Subarnachar"],
    
    // Brahmanbaria District
    Brahmanbaria: ["Brahmanbaria Sadar", "Akhaura", "Ashuganj", "Bancharampur", "Bijoynagar", "Kasba", "Nabinagar", "Nasirnagar", "Sarail"],
    
    // Chandpur District
    Chandpur: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
    
    // Rajshahi District
    Rajshahi: ["Rajshahi Sadar", "Bagha", "Bagmara", "Charghat", "Durgapur", "Godagari", "Mohanpur", "Paba", "Puthia", "Tanore"],
    
    // Bogura District
    Bogura: ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur", "Shibganj", "Sonatala"],
    
    // Pabna District
    Pabna: ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
    
    // Sirajganj District
    Sirajganj: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"],
    
    // Natore District
    Natore: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Naldanga", "Singra"],
    
    // Naogaon District
    Naogaon: ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
    
    // Chapainawabganj District
    Chapainawabganj: ["Chapainawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
    
    // Joypurhat District
    Joypurhat: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
    
    // Khulna District
    Khulna: ["Khulna Sadar", "Batiaghata", "Dacope", "Daulatpur", "Dighalia", "Dumuria", "Khalishpur", "Khan Jahan Ali", "Koyra", "Paikgachha", "Phultala", "Rupsa", "Sonadanga", "Terokhada"],
    
    // Jessore District
    Jessore: ["Jessore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
    
    // Satkhira District
    Satkhira: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"],
    
    // Bagerhat District
    Bagerhat: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
    
    // Jhenaidah District
    Jhenaidah: ["Jhenaidah Sadar", "Harinakunda", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
    
    // Magura District
    Magura: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
    
    // Narail District
    Narail: ["Narail Sadar", "Kalia", "Lohagara"],
    
    // Chuadanga District
    Chuadanga: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
    
    // Kushtia District
    Kushtia: ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"],
    
    // Meherpur District
    Meherpur: ["Meherpur Sadar", "Gangni", "Mujibnagar"],
    
    // Barishal District
    Barishal: ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
    
    // Patuakhali District
    Patuakhali: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali"],
    
    // Bhola District
    Bhola: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
    
    // Pirojpur District
    Pirojpur: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad", "Zianagar"],
    
    // Jhalokathi District
    Jhalokathi: ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
    
    // Barguna District
    Barguna: ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"],
    
    // Sylhet District
    Sylhet: ["Sylhet Sadar", "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Zakiganj"],
    
    // Moulvibazar District
    Moulvibazar: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"],
    
    // Habiganj District
    Habiganj: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Shayestaganj"],
    
    // Sunamganj District
    Sunamganj: ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Shalla", "Sunamganj Sadar", "Tahirpur"],
    
    // Rangpur District
    Rangpur: ["Rangpur Sadar", "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
    
    // Dinajpur District
    Dinajpur: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
    
    // Gaibandha District
    Gaibandha: ["Gaibandha Sadar", "Fulchhari", "Gabtali", "Gobindaganj", "Palashbari", "Sadullapur", "Sundarganj"],
    
    // Kurigram District
    Kurigram: ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Nageshwari", "Rajarhat", "Raomari", "Ulipur"],
    
    // Lalmonirhat District
    Lalmonirhat: ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
    
    // Nilphamari District
    Nilphamari: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"],
    
    // Panchagarh District
    Panchagarh: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
    
    // Thakurgaon District
    Thakurgaon: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"],
    
    // Mymensingh District
    Mymensingh: ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Trishal", "Tara Khanda"],
    
    // Jamalpur District
    Jamalpur: ["Jamalpur Sadar", "Baksiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
    
    // Netrokona District
    Netrokona: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Khaliajuri", "Madan", "Mohanganj", "Purbadhala"],
    
    // Sherpur District
    Sherpur: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
  }
};

// Helper function to get districts by division
export function getDistrictsByDivision(division: string): string[] {
  return bangladeshLocations.districts[division as keyof typeof bangladeshLocations.districts] || [];
}

// Helper function to get thanas by district
export function getThanasByDistrict(district: string): string[] {
  return bangladeshLocations.thanas[district as keyof typeof bangladeshLocations.thanas] || [];
}

// Blood groups
export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodGroup = typeof bloodGroups[number];

// Urgency levels
export const urgencyLevels = ["CRITICAL", "URGENT_6H", "URGENT_12H", "HIGH", "NORMAL"] as const;
export type UrgencyLevel = typeof urgencyLevels[number];
