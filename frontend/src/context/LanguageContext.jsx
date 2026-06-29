import { createContext, useContext, useState } from 'react';

export const T = {
  en: {
    // Navbar
    home:'Home', browsePlants:'Browse Plants', trackOrder:'Track Order',
    contact:'Contact', cart:'Cart', logout:'Logout',
    dashboard:'Dashboard', plants:'Plants', orders:'Orders', reports:'Reports',

    // Home Hero
    heroBadge:'🌱 Quality Saplings • Healthy Growth',
    heroTitle:'Sri Devi Chilli Nursery',
    heroAccent:"Andhra Pradesh's Trusted Choice",
    heroSub:'High-yield seedlings, grafted plants & hybrid varieties — grown with care, trusted by local farmers across Andhra Pradesh since 2023.',
    browseBtn:'🌶️ Browse Plants', trackBtn:'📦 Track Order',
    varieties:'50+ Varieties', farmersServed:'500+ Farmers Served', survivalRate:'98% Survival Rate',

    // How to Order
    howToOrder:'How to Order', simpleSteps:'Simple steps, no app needed',
    step:'Step',
    s1title:'Browse Plants', s1desc:'Search and filter varieties that suit your farm.',
    s2title:'Add to Cart',   s2desc:'Pick quantity and add plants to your cart.',
    s3title:'Place Order',   s3desc:'Enter your name, phone, and village address.',
    s4title:'Get Delivery',  s4desc:'We confirm, prepare, and deliver to you.',

    // Featured
    featuredPlants:'Featured Plants', featuredSub:'Our most popular varieties this season',
    viewAll:'View All →', orderNow:'Order Now',
    inStock:'✅ In Stock', lowStock:'⚠️ Only', outOfStock:'❌ Out of Stock',
    left:'left', sapling:'/sapling',

    // Why Us
    whyUs:'Why Farmers Trust Us',
    f1title:'Healthy Roots',  f1desc:'Every plant is hardened off and disease-free before delivery.',
    f2title:'Fair Prices',    f2desc:'Direct from nursery to farmer — no middlemen, honest pricing.',
    f3title:'Easy Ordering',  f3desc:'Works on any basic smartphone. No app download needed.',

    // CTA
    ctaTitle:'Ready to grow your farm? 🌶️',
    ctaSub:'Browse our full collection of chilli varieties and place your order today.',
    startBrowsing:'Start Browsing',

    // Footer
    footerSub:'Quality saplings, healthy growth — serving local farmers in Andhra Pradesh since 2023.',
    quickLinks:'Quick Links', contactUs:'Contact Us',
    copyright:'© 2024 Sri Devi Chilli Nursery, Andhra Pradesh. All rights reserved.',

    // Browse
    browseTitle:'🌶️ Browse Plants',
    loadingText:'Loading…',
    varietiesAvailable:'varieties available',
    searchPlaceholder:'Search plant name…',
    maxPrice:'Max budget (₹)',
    clearFilters:'Clear Filters', clear:'✕ Clear',
    noPlantsFound:'No plants found', tryAdjusting:'Try adjusting your search or filters',

    // PlantCard
    perSapling:'/ sapling', soldOut:'Sold Out', addToCart:'+ Add',
    outOfStockBadge:'Out of Stock', onlyLeft:'Only', leftBadge:'left',
    howManyPlants:'How many plants?',
    noOfPlants:'No. of Plants',
    aboutVariety:'About this variety',
    growingTipsLabel:'🌱 Growing Tips',
    inStockCount:'In stock',
    perPlant:'per plant',
    addedToCart:'✓ Added to Cart!',
    addToCartFull:'🛒 Add to Cart',
    viewCart:'View Cart →',
    back:'← Back',
    soldOutLabel:'Sold out',

    // Plant type filter chips
    typeAll:'All', typeSeedling:'Seedling', typeGrafted:'Grafted',
    typeHybrid:'Hybrid', typeOpenPollinated:'Open Pollinated', typeOther:'Other',

    // Cart
    yourCart:'🛒 Your Cart',
    item:'item', items:'items',
    cartEmpty:'Your cart is empty',
    cartEmptySub:'Browse our plant varieties and add some to your cart',
    yourDetails:'📝 Your Details',
    yourName:'Your Name *', namePlaceholder:'e.g. Ravi Kumar',
    phone:'Phone Number *', phonePlaceholder:'e.g. 9876543210',
    address:'Village / Address *', addressPlaceholder:'e.g. Krishnapuram Village, Tirunelveli',
    deliveryOption:'Delivery Option',
    pickup:'🏪 Pickup from Nursery', delivery:'🚚 Home Delivery',
    notes:'Notes (optional)', notesPlaceholder:'Any special requests…',
    placeOrder:'Place Order — ₹', placingOrder:'Placing Order…',
    orderSummary:'Order Summary', total:'Total',
    pickupNote:'🏪 Pickup at nursery', deliveryNote:'🚚 Delivery to your address',

    // Track
    trackTitle:'📦 Track Your Orders',
    trackSub:'Enter your mobile number to see all your orders',
    trackPlaceholder:'Enter your 10-digit mobile number', track:'Track Orders',
    orderId:'Order ID', name:'Name', plantsLabel:'Plants', totalLabel:'Total', date:'Date',
    noOrdersFound:'No orders found for this number',
    ordersFound:'orders found for',
    statusPending:'⏳ Pending', statusConfirmed:'✅ Confirmed', statusReady:'📦 Ready to Pickup', statusDelivered:'🎉 Delivered',
    deliveryPickup:'Pickup from Nursery', deliveryHome:'Home Delivery',
    yourOrders:'Your Orders',

    // Contact
    contactTitle:'📞 Contact Us',
    contactSub:"We're here to help you choose the right plants for your farm",
    callUs:'Call Us', tapToCall:'Tap to call directly',
    whatsapp:'WhatsApp', whatsappMsg:'Message us on WhatsApp',
    location:'Location',
    findOnMap:'Find Us on the Map', openInMaps:'Open in Google Maps →',
  },

  te: {
    home:'హోమ్', browsePlants:'మొక్కలు చూడండి', trackOrder:'ఆర్డర్ ట్రాక్',
    contact:'సంప్రదించండి', cart:'కార్ట్', logout:'లాగ్అవుట్',
    dashboard:'డాష్‌బోర్డ్', plants:'మొక్కలు', orders:'ఆర్డర్లు', reports:'నివేదికలు',

    heroBadge:'🌱 నాణ్యమైన మొక్కలు • ఆరోగ్యకరమైన వృద్ధి',
    heroTitle:'శ్రీ దేవి చిల్లీ నర్సరీ',
    heroAccent:'ఆంధ్రప్రదేశ్ రైతుల విశ్వాసం',
    heroSub:'అధిక దిగుబడి మొక్కలు, అంటుకట్టిన మొక్కలు & హైబ్రిడ్ రకాలు — శ్రద్ధతో పెంచబడ్డాయి, 2023 నుండి ఆంధ్రప్రదేశ్ రైతులచే విశ్వసించబడింది.',
    browseBtn:'🌶️ మొక్కలు చూడండి', trackBtn:'📦 ఆర్డర్ ట్రాక్',
    varieties:'50+ రకాలు', farmersServed:'500+ రైతులకు సేవ', survivalRate:'98% మనుగడ రేటు',

    howToOrder:'ఆర్డర్ ఎలా చేయాలి', simpleSteps:'సులభమైన దశలు, యాప్ అవసరం లేదు',
    step:'దశ',
    s1title:'మొక్కలు చూడండి', s1desc:'మీ పొలానికి అనుకూలమైన రకాలను వెతకండి.',
    s2title:'కార్ట్‌కు జోడించండి', s2desc:'పరిమాణాన్ని ఎంచుకుని మొక్కలను కార్ట్‌కు జోడించండి.',
    s3title:'ఆర్డర్ చేయండి', s3desc:'మీ పేరు, ఫోన్, మరియు గ్రామ చిరునామా నమోదు చేయండి.',
    s4title:'డెలివరీ పొందండి', s4desc:'మేము నిర్ధారిస్తాము, సిద్ధం చేసి మీకు డెలివరీ చేస్తాము.',

    featuredPlants:'ముఖ్యమైన మొక్కలు', featuredSub:'ఈ సీజన్‌లో మా అత్యంత ప్రజాదరణ పొందిన రకాలు',
    viewAll:'అన్నీ చూడండి →', orderNow:'ఇప్పుడే ఆర్డర్',
    inStock:'✅ స్టాక్ ఉంది', lowStock:'⚠️ కేవలం', outOfStock:'❌ స్టాక్ అయిపోయింది',
    left:'మిగిలాయి', sapling:'/మొక్క',

    whyUs:'రైతులు మాపై ఎందుకు నమ్మకం ఉంచుతారు',
    f1title:'ఆరోగ్యకరమైన వేర్లు', f1desc:'ప్రతి మొక్క డెలివరీకి ముందు రోగ-నిరోధకంగా తయారు చేయబడుతుంది.',
    f2title:'న్యాయమైన ధరలు', f2desc:'నర్సరీ నుండి నేరుగా రైతుకు — మధ్యవర్తులు లేరు.',
    f3title:'సులభమైన ఆర్డర్', f3desc:'ఏ స్మార్ట్‌ఫోన్‌లోనైనా పని చేస్తుంది. యాప్ అవసరం లేదు.',

    ctaTitle:'మీ పొలం పెంచడానికి సిద్ధంగా ఉన్నారా? 🌶️',
    ctaSub:'మా పూర్తి మిరప రకాల సేకరణను చూసి ఈరోజే ఆర్డర్ చేయండి.',
    startBrowsing:'చూడటం ప్రారంభించండి',

    footerSub:'నాణ్యమైన మొక్కలు — 2023 నుండి ఆంధ్రప్రదేశ్ రైతులకు సేవ చేస్తున్నాం.',
    quickLinks:'త్వరిత లింకులు', contactUs:'సంప్రదించండి',
    copyright:'© 2024 శ్రీ దేవి చిల్లీ నర్సరీ, ఆంధ్రప్రదేశ్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',

    browseTitle:'🌶️ మొక్కలు చూడండి',
    loadingText:'లోడ్ అవుతోంది…',
    varietiesAvailable:'రకాలు అందుబాటులో ఉన్నాయి',
    searchPlaceholder:'మొక్క పేరు వెతకండి…',
    maxPrice:'గరిష్ట బడ్జెట్ (₹)',
    clearFilters:'ఫిల్టర్లు తీసివేయి', clear:'✕ క్లియర్',
    noPlantsFound:'మొక్కలు కనుగొనబడలేదు', tryAdjusting:'మీ శోధన లేదా ఫిల్టర్లను మార్చండి',

    perSapling:'/ మొక్క', soldOut:'అమ్ముడైంది', addToCart:'+ జోడించు',
    outOfStockBadge:'స్టాక్ లేదు', onlyLeft:'కేవలం', leftBadge:'మిగిలాయి',
    howManyPlants:'ఎన్ని మొక్కలు కావాలి?',
    noOfPlants:'మొక్కల సంఖ్య',
    aboutVariety:'ఈ రకం గురించి',
    growingTipsLabel:'🌱 పెంపకం చిట్కాలు',
    inStockCount:'స్టాక్‌లో ఉంది',
    perPlant:'మొక్కకు',
    addedToCart:'✓ కార్ట్‌కు జోడించబడింది!',
    addToCartFull:'🛒 కార్ట్‌కు జోడించు',
    viewCart:'కార్ట్ చూడండి →',
    back:'← వెనక్కు',
    soldOutLabel:'అమ్ముడైంది',

    // Plant type filter chips
    typeAll:'అన్నీ', typeSeedling:'మొలక', typeGrafted:'అంటుకట్టిన',
    typeHybrid:'హైబ్రిడ్', typeOpenPollinated:'ఓపెన్ పొలినేటెడ్', typeOther:'ఇతర',

    yourCart:'🛒 మీ కార్ట్',
    item:'వస్తువు', items:'వస్తువులు',
    cartEmpty:'మీ కార్ట్ ఖాళీగా ఉంది',
    cartEmptySub:'మా మొక్కల రకాలు చూసి కొన్ని కార్ట్‌కు జోడించండి',
    yourDetails:'📝 మీ వివరాలు',
    yourName:'మీ పేరు *', namePlaceholder:'ఉదా. రవి కుమార్',
    phone:'ఫోన్ నంబర్ *', phonePlaceholder:'ఉదా. 9876543210',
    address:'గ్రామం / చిరునామా *', addressPlaceholder:'ఉదా. కృష్ణాపురం గ్రామం',
    deliveryOption:'డెలివరీ ఎంపిక',
    pickup:'🏪 నర్సరీలో పిక్అప్', delivery:'🚚 హోమ్ డెలివరీ',
    notes:'గమనికలు (ఐచ్ఛికం)', notesPlaceholder:'ఏదైనా ప్రత్యేక అభ్యర్థన…',
    placeOrder:'ఆర్డర్ చేయండి — ₹', placingOrder:'ఆర్డర్ చేస్తున్నాం…',
    orderSummary:'ఆర్డర్ సారాంశం', total:'మొత్తం',
    pickupNote:'🏪 నర్సరీలో పిక్అప్', deliveryNote:'🚚 మీ చిరునామాకు డెలివరీ',

    // Track
    trackTitle:'📦 మీ ఆర్డర్లు ట్రాక్ చేయండి',
    trackSub:'మీ ఆర్డర్లు చూడటానికి మీ మొబైల్ నంబర్ నమోదు చేయండి',
    trackPlaceholder:'మీ 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి', track:'ఆర్డర్లు ట్రాక్',
    orderId:'ఆర్డర్ ID', name:'పేరు', plantsLabel:'మొక్కలు', totalLabel:'మొత్తం', date:'తేదీ',
    noOrdersFound:'ఈ నంబర్‌కు ఆర్డర్లు కనుగొనబడలేదు',
    ordersFound:'ఆర్డర్లు కనుగొనబడ్డాయి',
    statusPending:'⏳ పెండింగ్', statusConfirmed:'✅ నిర్ధారించబడింది', statusReady:'📦 తీసుకోవడానికి సిద్ధంగా ఉంది', statusDelivered:'🎉 డెలివరీ అయింది',
    deliveryPickup:'నర్సరీ నుండి తీసుకోండి', deliveryHome:'ఇంటి డెలివరీ',
    yourOrders:'మీ ఆర్డర్లు',

    contactTitle:'📞 సంప్రదించండి',
    contactSub:'మీ పొలానికి సరైన మొక్కలు ఎంచుకోవడానికి మేము సహాయం చేస్తాం',
    callUs:'మాకు కాల్ చేయండి', tapToCall:'నేరుగా కాల్ చేయడానికి నొక్కండి',
    whatsapp:'వాట్సాప్', whatsappMsg:'వాట్సాప్‌లో మాకు మెసేజ్ చేయండి',
    location:'స్థానం',
    findOnMap:'మ్యాప్‌లో మాకు కనుగొనండి', openInMaps:'గూగుల్ మ్యాప్‌లో తెరవండి →',
  },

  hi: {
    home:'होम', browsePlants:'पौधे देखें', trackOrder:'ऑर्डर ट्रैक',
    contact:'संपर्क करें', cart:'कार्ट', logout:'लॉगआउट',
    dashboard:'डैशबोर्ड', plants:'पौधे', orders:'ऑर्डर', reports:'रिपोर्ट',

    heroBadge:'🌱 गुणवत्ता पौधे • स्वस्थ विकास',
    heroTitle:'श्री देवी चिल्ली नर्सरी',
    heroAccent:'आंध्र प्रदेश किसानों की पसंद',
    heroSub:'अधिक उपज वाले पौधे, ग्राफ्टेड पौधे और हाइब्रिड किस्में — 2023 से आंध्र प्रदेश के किसानों का विश्वास।',
    browseBtn:'🌶️ पौधे देखें', trackBtn:'📦 ऑर्डर ट्रैक',
    varieties:'50+ किस्में', farmersServed:'500+ किसानों की सेवा', survivalRate:'98% जीवित दर',

    howToOrder:'ऑर्डर कैसे करें', simpleSteps:'सरल कदम, कोई ऐप नहीं चाहिए',
    step:'चरण',
    s1title:'पौधे देखें', s1desc:'अपने खेत के लिए उपयुक्त किस्में खोजें।',
    s2title:'कार्ट में जोड़ें', s2desc:'मात्रा चुनें और पौधे कार्ट में जोड़ें।',
    s3title:'ऑर्डर दें', s3desc:'अपना नाम, फोन और गाँव का पता दर्ज करें।',
    s4title:'डिलीवरी पाएं', s4desc:'हम पुष्टि करते हैं, तैयार करते हैं और आपको डिलीवरी करते हैं।',

    featuredPlants:'विशेष पौधे', featuredSub:'इस सीजन में हमारी सबसे लोकप्रिय किस्में',
    viewAll:'सभी देखें →', orderNow:'अभी ऑर्डर करें',
    inStock:'✅ स्टॉक में है', lowStock:'⚠️ केवल', outOfStock:'❌ स्टॉक खत्म',
    left:'बचे हैं', sapling:'/पौधा',

    whyUs:'किसान हम पर क्यों भरोसा करते हैं',
    f1title:'स्वस्थ जड़ें', f1desc:'डिलीवरी से पहले हर पौधे को रोग-मुक्त किया जाता है।',
    f2title:'उचित कीमतें', f2desc:'नर्सरी से सीधे किसान तक — कोई बिचौलिया नहीं।',
    f3title:'आसान ऑर्डर', f3desc:'किसी भी स्मार्टफोन पर काम करता है। कोई ऐप डाउनलोड नहीं।',

    ctaTitle:'अपना खेत बढ़ाने के लिए तैयार हैं? 🌶️',
    ctaSub:'हमारी मिर्च किस्मों का पूरा संग्रह देखें और आज ही ऑर्डर करें।',
    startBrowsing:'देखना शुरू करें',

    footerSub:'गुणवत्ता पौधे — 2023 से आंध्र प्रदेश के किसानों की सेवा में।',
    quickLinks:'त्वरित लिंक', contactUs:'संपर्क करें',
    copyright:'© 2024 श्री देवी चिल्ली नर्सरी, आंध्र प्रदेश। सर्वाधिकार सुरक्षित।',

    browseTitle:'🌶️ पौधे देखें',
    loadingText:'लोड हो रहा है…',
    varietiesAvailable:'किस्में उपलब्ध हैं',
    searchPlaceholder:'पौधे का नाम खोजें…',
    maxPrice:'अधिकतम बजट (₹)',
    clearFilters:'फ़िल्टर साफ़ करें', clear:'✕ साफ़ करें',
    noPlantsFound:'कोई पौधा नहीं मिला', tryAdjusting:'अपनी खोज या फ़िल्टर बदलें',

    perSapling:'/ पौधा', soldOut:'बिक गया', addToCart:'+ जोड़ें',
    outOfStockBadge:'स्टॉक नहीं', onlyLeft:'केवल', leftBadge:'बचे हैं',
    howManyPlants:'कितने पौधे चाहिए?',
    noOfPlants:'पौधों की संख्या',
    aboutVariety:'इस किस्म के बारे में',
    growingTipsLabel:'🌱 उगाने के सुझाव',
    inStockCount:'स्टॉक में',
    perPlant:'प्रति पौधा',
    addedToCart:'✓ कार्ट में जोड़ा!',
    addToCartFull:'🛒 कार्ट में जोड़ें',
    viewCart:'कार्ट देखें →',
    back:'← वापस',
    soldOutLabel:'बिक गया',

    // Plant type filter chips
    typeAll:'सभी', typeSeedling:'पौध', typeGrafted:'ग्राफ्टेड',
    typeHybrid:'हाइब्रिड', typeOpenPollinated:'खुला परागण', typeOther:'अन्य',

    yourCart:'🛒 आपकी कार्ट',
    item:'वस्तु', items:'वस्तुएं',
    cartEmpty:'आपकी कार्ट खाली है',
    cartEmptySub:'हमारी पौधों की किस्में देखें और कुछ कार्ट में जोड़ें',
    yourDetails:'📝 आपकी जानकारी',
    yourName:'आपका नाम *', namePlaceholder:'जैसे रवि कुमार',
    phone:'फोन नंबर *', phonePlaceholder:'जैसे 9876543210',
    address:'गाँव / पता *', addressPlaceholder:'जैसे कृष्णापुरम गाँव',
    deliveryOption:'डिलीवरी विकल्प',
    pickup:'🏪 नर्सरी से पिकअप', delivery:'🚚 घर पर डिलीवरी',
    notes:'नोट्स (वैकल्पिक)', notesPlaceholder:'कोई विशेष अनुरोध…',
    placeOrder:'ऑर्डर दें — ₹', placingOrder:'ऑर्डर दे रहे हैं…',
    orderSummary:'ऑर्डर सारांश', total:'कुल',
    pickupNote:'🏪 नर्सरी से पिकअप', deliveryNote:'🚚 आपके पते पर डिलीवरी',

    // Track
    trackTitle:'📦 अपने ऑर्डर ट्रैक करें',
    trackSub:'अपने सभी ऑर्डर देखने के लिए अपना मोबाइल नंबर दर्ज करें',
    trackPlaceholder:'अपना 10 अंक का मोबाइल नंबर दर्ज करें', track:'ऑर्डर खोजें',
    orderId:'ऑर्डर ID', name:'नाम', plantsLabel:'पौधे', totalLabel:'कुल', date:'तारीख',
    noOrdersFound:'इस नंबर पर कोई ऑर्डर नहीं मिला',
    ordersFound:'ऑर्डर मिले',
    statusPending:'⏳ पेंडिंग', statusConfirmed:'✅ पुष्टि हुई', statusReady:'📦 लेने के लिए तैयार', statusDelivered:'🎉 डिलिवर हो गया',
    deliveryPickup:'नर्सरी से लें', deliveryHome:'घर पर डिलिवरी',
    yourOrders:'आपके ऑर्डर',

    contactTitle:'📞 संपर्क करें',
    contactSub:'हम आपके खेत के लिए सही पौधे चुनने में मदद करेंगे',
    callUs:'हमें कॉल करें', tapToCall:'सीधे कॉल करने के लिए दबाएं',
    whatsapp:'व्हाट्सएप', whatsappMsg:'व्हाट्सएप पर संदेश भेजें',
    location:'स्थान',
    findOnMap:'नक्शे पर हमें खोजें', openInMaps:'गूगल मैप्स में खोलें →',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('nursery-lang') || 'en');
  const t = (key) => T[lang]?.[key] ?? T.en[key] ?? key;
  const switchLang = (code) => { setLang(code); localStorage.setItem('nursery-lang', code); };
  return (
    <LanguageContext.Provider value={{ lang, t, switchLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be inside LanguageProvider');
  return ctx;
}
