import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const translations = {
  English: {
    brand_sub: "Digital Fraud Intelligence",
    search_placeholder: "Search cases, indicators, voice hashes, or mule accounts...",
    welcome: "Welcome back, Analyst",
    welcome_sub: "Trace. Analyse. Reveal the Truth.",
    your_cases: "YOUR CASES",
    create_new_case: "CREATE NEW CASE",
    risks: "Risks",
    reports: "Reports",
    settings: "Settings",
    logout: "Logout",
    back_to_cases: "Back to Cases",
    add_evidence: "+ ADD EVIDENCE FILE",
    uploading_evidence: "UPLOADING TO SYSTEM...",
    upload_hint: "Upload local file from your system (.wav, .pdf, .mp4, .jpg)",
    add_description: "ADD DESCRIPTION",
    save_description: "SAVE DESCRIPTION",
    saved_notebook: "SAVED TO SYSTEM NOTEBOOK!",
    download_notebook: "📓 DOWNLOAD NOTEBOOK (.TXT)",
    evidences_provided: "EVIDENCES PROVIDED",
    no_audio: "No audio evidence uploaded yet",
    no_video: "No video evidence uploaded yet",
    no_doc: "No document evidence uploaded yet",
    no_image: "No image evidence uploaded yet",
    upload_short: "+ Upload",
    courtroom: "COURTROOM",
    courtroom_desc: "Review all collected evidence and prepare for legal proceedings.",
    graphical_analysis: "GRAPHICAL ANALYSIS",
    graphical_desc: "Visualise evidence metrics and risk distributions across categories.",
    open_analysis: "OPEN ANALYSIS",
    enter_courtroom: "ENTER COURTROOM",
    ai_analysis_room: "AI ANALYSIS ROOM",
    ai_room_sub: "Trace connections. Reveal evidence. Let AI uncover the pattern.",
    ai_analysis_active: "AI ANALYSIS ACTIVE",
    awaiting_upload: "AWAITING EVIDENCE UPLOAD",
    click_to_expand: "CLICK TO EXPAND",
    reveal_pattern: "REVEAL PATTERN ANOMALY",
    pattern_anomaly: "PATTERN ANOMALY",
    graphical_summary: "Graphical Summary",
    export_report: "EXPORT REPORT",
    percentage_fairness: "Percentage Fairness (%)",
    insights_anomalies: "INSIGHTS & ANOMALIES",
    privacy_redacted: "Rule 81 PII Masked",
    privacy_active: "Rule 81 Active",
    rule81_tooltip: "Toggle PII Redaction"
  },
  "Hindi (हिंदी)": {
    brand_sub: "डिजिटल धोखाधड़ी जांच इंटेलीजेंस",
    search_placeholder: "मामले, संकेतक, वॉइस हैश या खच्चर खाते खोजें...",
    welcome: "वापसी पर स्वागत है, विश्लेषक",
    welcome_sub: "सुराग खोजें। विश्लेषण करें। सत्य उजागर करें।",
    your_cases: "आपके मामले",
    create_new_case: "नया मामला दर्ज करें",
    risks: "जोखिम",
    reports: "रिपोर्ट्स",
    settings: "सेटिंग्स",
    logout: "लॉगआउट",
    back_to_cases: "मामलों पर वापस जाएं",
    add_evidence: "+ साक्ष्य फ़ाइल जोड़ें",
    uploading_evidence: "सिस्टम में अपलोड हो रहा है...",
    upload_hint: "अपने सिस्टम से स्थानीय फ़ाइल अपलोड करें (.wav, .pdf, .mp4, .jpg)",
    add_description: "विवरण जोड़ें",
    save_description: "विवरण सुरक्षित करें",
    saved_notebook: "सिस्टम नोटबुक में सुरक्षित!",
    download_notebook: "📓 नोटबुक डाउनलोड करें (.TXT)",
    evidences_provided: "प्रस्तुत साक्ष्य",
    no_audio: "कोई ऑडियो साक्ष्य अपलोड नहीं हुआ",
    no_video: "कोई वीडियो साक्ष्य अपलोड नहीं हुआ",
    no_doc: "कोई दस्तावेज़ साक्ष्य अपलोड नहीं हुआ",
    no_image: "कोई छवि साक्ष्य अपलोड नहीं हुआ",
    upload_short: "+ अपलोड",
    courtroom: "कोर्टरूम (न्यायालय)",
    courtroom_desc: "एकत्रित साक्ष्यों की समीक्षा करें और कानूनी कार्यवाही की तैयारी करें।",
    graphical_analysis: "ग्राफिकल विश्लेषण",
    graphical_desc: "साक्ष्य मैट्रिक्स और जोखिम वितरण का दृश्य विश्लेषण करें।",
    open_analysis: "विश्लेषण खोलें",
    enter_courtroom: "कोर्टरूम में प्रवेश करें",
    ai_analysis_room: "एआई विश्लेषण कक्ष",
    ai_room_sub: "संबंध ट्रेस करें। साक्ष्य उजागर करें। एआई को पैटर्न खोजने दें।",
    ai_analysis_active: "एआई विश्लेषण सक्रिय",
    awaiting_upload: "साक्ष्य अपलोड की प्रतीक्षा",
    click_to_expand: "विस्तार के लिए क्लिक करें",
    reveal_pattern: "पैटर्न विसंगति प्रकट करें",
    pattern_anomaly: "पैटर्न विसंगति",
    graphical_summary: "ग्राफिकल सारांश",
    export_report: "रिपोर्ट निर्यात करें",
    percentage_fairness: "निष्पक्षता प्रतिशत (%)",
    insights_anomalies: "अंतर्दृष्टि और विसंगतियां",
    privacy_redacted: "नियम 81 व्यक्तिगत डेटा छिपा हुआ",
    privacy_active: "नियम 81 सक्रिय",
    rule81_tooltip: "व्यक्तिगत डेटा टॉगल करें"
  },
  "Marathi (मराठी)": {
    brand_sub: "डिजिटल फसवणूक तपास इंटेलिजन्स",
    search_placeholder: "प्रकरणे, निर्देशक, व्हॉइस हॅश किंवा संशयित खाती शोधा...",
    welcome: "परत स्वागत आहे, विश्लेषक",
    welcome_sub: "शोध घ्या. विश्लेषण करा. सत्य उघड करा.",
    your_cases: "तुमची प्रकरणे",
    create_new_case: "नवीन प्रकरण नोंदवा",
    risks: "जोखीम",
    reports: "अहवाल",
    settings: "सेटिंग्ज",
    logout: "लॉगआउट",
    back_to_cases: "प्रकरणांवर परत जा",
    add_evidence: "+ पुरावा फाईल जोडा",
    uploading_evidence: "सिस्टीममध्ये अपलोड होत आहे...",
    upload_hint: "तुमच्या सिस्टीमवरून स्थानिक फाईल अपलोड करा (.wav, .pdf, .mp4, .jpg)",
    add_description: "वर्णन जोडा",
    save_description: "वर्णन जतन करा",
    saved_notebook: "सिस्टीम नोंदवहीत जतन केले!",
    download_notebook: "📓 नोंदवही डाउनलोड करा (.TXT)",
    evidences_provided: "सादर केलेले पुरावे",
    no_audio: "कोणताही ऑडिओ पुरावा अपलोड केला नाही",
    no_video: "कोणताही व्हिडिओ पुरावा अपलोड केला नाही",
    no_doc: "कोणताही दस्तऐवज पुरावा अपलोड केला नाही",
    no_image: "कोणताही इमेज पुरावा अपलोड केला नाही",
    upload_short: "+ अपलोड",
    courtroom: "कोर्टरूम (न्यायालय)",
    courtroom_desc: "गोळा केलेल्या पुराव्यांचे पुनरावलोकन करा आणि कायदेशीर कार्यवाहीची तयारी करा.",
    graphical_analysis: "ग्राफिकल विश्लेषण",
    graphical_desc: "पुरावा मॅट्रिक्स आणि जोखीम वितरणाचे दृश्य विश्लेषण करा.",
    open_analysis: "विश्लेषण उघडा",
    enter_courtroom: "कोर्टरूममध्ये प्रवेश करा",
    ai_analysis_room: "एआय विश्लेषण कक्ष",
    ai_room_sub: "संबंध शोधा. पुरावे उघड करा. एआय ला नमुना शोधू द्या.",
    ai_analysis_active: "एआय विश्लेषण सक्रिय",
    awaiting_upload: "पुरावा अपलोडची वाट पाहत आहे",
    click_to_expand: "विस्तारासाठी क्लिक करा",
    reveal_pattern: "नमुना विसंगती उघड करा",
    pattern_anomaly: "नमुना विसंगती",
    graphical_summary: "ग्राफिकल सारांश",
    export_report: "अहवाल निर्यात करा",
    percentage_fairness: "निष्पक्षता टक्केवारी (%)",
    insights_anomalies: "आंतरदृष्टी आणि विसंगती",
    privacy_redacted: "नियम 81 वैयक्तिक डेटा लपविला",
    privacy_active: "नियम 81 सक्रिय",
    rule81_tooltip: "वैयक्तिक डेटा टॉगल करा"
  }
};

export function ThemeProvider({ children }) {
  const [privacyRedacted, setPrivacyRedacted] = useState(true);
  const [language, setLanguage] = useState('English');

  const togglePrivacy = () => setPrivacyRedacted(prev => !prev);

  const t = (key) => {
    const langDict = translations[language] || translations['English'];
    return langDict[key] || translations['English'][key] || key;
  };

  return (
    <ThemeContext.Provider value={{ privacyRedacted, togglePrivacy, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
