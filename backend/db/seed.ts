export interface SeedDoctor {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
  bio_en: string;
  bio_hi: string;
  specialization_en: string;
  specialization_hi: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'DECLINED' | 'SUSPENDED';
  photoUrl: string | null;
}

export interface SeedService {
  id: string;
  name_en: string;
  name_hi: string;
  desc_en: string;
  desc_hi: string;
  defaultFee: number;
  problems: { id: string; name_en: string; name_hi: string; redFlag?: boolean }[];
}

export const SEED_DATA = {
  hospital: {
    name_en: "Prayag Eye Care & Laser Centre",
    name_hi: "प्रयाग आई केयर एवं लेजर सेंटर",
    address_en: "12/4 Civil Lines, Near MG Marg, Prayagraj, Uttar Pradesh 211001",
    address_hi: "12/4 सिविल लाइंस, एमजी मार्ग के पास, प्रयागराज, उत्तर प्रदेश 211001",
    phones: ["+91 98765 43210", "0532-2400112"],
    email: "info@prayageyecare.com",
    emergencyPhone: "+91 98765 43210",
    about_en: "Prayag Eye Care is a premier multi-specialty eye care institute equipped with micro-incision cataract surgery (MICS), advanced retina laser, and digital token appointment tracking.",
    about_hi: "प्रयाग आई केयर प्रयागराज का प्रमुख नेत्र चिकित्सा संस्थान है, जो अत्याधुनिक फेको मोतियाबिंद ऑपरेशन, रेटीना लेजर और डिजिटल टोकन प्रणाली से लैस है।",
    emergency24x7: true,
  },

  specializations: [
    { id: "spec-cataract", name_en: "Cataract & Refractive Surgery", name_hi: "मोतियाबिंद एवं दृष्टि सुधार" },
    { id: "spec-retina", name_en: "Vitreoretinal Diseases & Surgery", name_hi: "रेटीना (पर्दा) एवं कांच द्रव रोग" },
    { id: "spec-glaucoma", name_en: "Glaucoma & Intraocular Pressure", name_hi: "काला मोतिया (ग्लूकोमा)" },
    { id: "spec-cornea", name_en: "Cornea & External Eye Diseases", name_hi: "कॉर्निया एवं बाहरी आंख रोग" },
    { id: "spec-pediatric", name_en: "Pediatric Ophthalmology & Squint", name_hi: "बाल नेत्र रोग एवं भेंगापन" },
    { id: "spec-optometry", name_en: "Comprehensive Optometry & Contact Lenses", name_hi: "दृष्टि जांच एवं कॉन्टैक्ट लेंस" },
    { id: "spec-oculoplasty", name_en: "Oculoplasty & Eyelid Surgery", name_hi: "ऑकुलोप्लास्टी एवं पलक शल्य चिकित्सा" },
    { id: "spec-neuro", name_en: "Neuro-Ophthalmology", name_hi: "न्यूरो-ऑप्थल्मोलॉजी" },
  ],

  services: [
    {
      id: "srv-checkup",
      name_en: "General Eye Examination & Consultation",
      name_hi: "सामान्य नेत्र जांच एवं परामर्श",
      desc_en: "Comprehensive eye health screening, visual acuity measurement, and pressure check.",
      desc_hi: "सम्पूर्ण आंखों की जांच, दृष्टि मापन एवं आंख के दबाव की जांच।",
      defaultFee: 300,
      problems: [
        { id: "prob-1", name_en: "Blurred Vision / Diminished Sight", name_hi: "धुंधला दिखाई देना / कम दिखना" },
        { id: "prob-2", name_en: "Eye Redness & Irritation", name_hi: "आंखों में लाली एवं जलन" },
        { id: "prob-3", name_en: "Watering / Excessive Tears", name_hi: "आंखों से पानी बहना" },
        { id: "prob-4", name_en: "Dry Eyes & Fatigue", name_hi: "सूखी आंखें एवं थकावट" },
        { id: "prob-5", name_en: "Headache related to Vision", name_hi: "सिरदर्द व नजर की कमजोरी" },
      ],
    },
    {
      id: "srv-cataract",
      name_en: "Cataract Evaluation & Phaco Surgery",
      name_hi: "मोतियाबिंद जांच एवं फेको ऑपरेशन",
      desc_en: "Stitchless micro-incision cataract surgery with premium foldable IOL implantation.",
      desc_hi: "बिना टांके का फेको ऑपरेशन एवं आधुनिक फोल्डेबल लेंस प्रत्यारोपण।",
      defaultFee: 500,
      problems: [
        { id: "prob-6", name_en: "Cloudy or Hazed Vision", name_hi: "धुंधला या जाला सा दिखना" },
        { id: "prob-7", name_en: "Night Driving Glare & Halos", name_hi: "रात में तेज रोशनी से चकाचौंध" },
        { id: "prob-8", name_en: "Frequent Change in Glass Power", name_hi: "चश्मे का नंबर बार-बार बदलना" },
      ],
    },
    {
      id: "srv-retina",
      name_en: "Retinal Laser & Diabetic Eye Care",
      name_hi: "रेटीना (पर्दा) लेजर व डायबिटीज नेत्र जांच",
      desc_en: "OCT scan, fundus angiography, diabetic retinopathy screening, and retinal laser.",
      desc_hi: "ओसीटी स्कैन, डायबिटीज पर्दा जांच एवं रेटीना लेजर ट्रीटमेंट।",
      defaultFee: 600,
      problems: [
        { id: "prob-9", name_en: "Black Spots / Floaters in Vision", name_hi: "आंखों के आगे काले धब्बे (फ्लोटर्स)" },
        { id: "prob-10", name_en: "Light Flashes / Curtain Effect", name_hi: "रोशनी की लकीरें या पर्दा गिरना", redFlag: true },
        { id: "prob-11", name_en: "Diabetic Retinopathy Screening", name_hi: "शुगर (डायबिटीज) के मरीजों की पर्दा जांच" },
      ],
    },
    {
      id: "srv-emergency",
      name_en: "24x7 Ocular Trauma & Emergency Care",
      name_hi: "24 घंटे आंख की चोट व आपातकालीन उपचार",
      desc_en: "Immediate emergency evaluation for trauma, chemical splash, and sudden vision loss.",
      desc_hi: "चोट, केमिकल गिरने या अचानक रोशनी जाने पर तत्काल आपातकालीन उपचार।",
      defaultFee: 0,
      problems: [
        { id: "prob-12", name_en: "Chemical / Acid Injury", name_hi: "केमिकल या तेजाब गिरना", redFlag: true },
        { id: "prob-13", name_en: "Sudden Total Vision Loss", name_hi: "अचानक आंखों की रोशनी जाना", redFlag: true },
        { id: "prob-14", name_en: "Sharp Object Penetrating Trauma", name_hi: "नुकीली चीज से गंभीर चोट", redFlag: true },
        { id: "prob-15", name_en: "Severe Eye Pain & Swelling", name_hi: "असहनीय दर्द एवं सूजन", redFlag: true },
      ],
    },
    {
      id: "srv-optometry",
      name_en: "Optometry: Eye Number Check & Glasses Fitting",
      name_hi: "ऑप्टोमेट्री: चश्मा नंबर जांच एवं फिटिंग",
      desc_en: "Computerized refraction, contact lens fitting, and prescriptions for glasses or contact lenses.",
      desc_hi: "कंप्यूटरीकृत चश्मा नंबर जांच, कॉन्टैक्ट लेंस परामर्श एवं चश्मा फिटिंग।",
      defaultFee: 200,
      problems: [
        { id: "prob-16", name_en: "Glasses Power Check & Refraction", name_hi: "चश्मा नंबर जांच" },
        { id: "prob-17", name_en: "Contact Lens Fitting & Trial", name_hi: "कॉन्टैक्ट लेंस फिटिंग" },
        { id: "prob-18", name_en: "Reading Difficulty / Near Vision", name_hi: "पास का पढ़ने में दिक्कत" },
        { id: "prob-19", name_en: "Computer Eye Strain Evaluation", name_hi: "कंप्यूटर आंख थकावट जांच" },
      ],
    },
  ],

  doctors: [
    {
      id: "doc-1",
      fullName: "Dr. Suresh Kumar Sharma",
      email: "suresh.sharma@prayageyecare.com",
      mobile: "9876500001",
      qualification: "MBBS, MS (Ophthalmology), Fellowship in Cataract (AIIMS)",
      experienceYears: 18,
      consultationFee: 400,
      bio_en: "Senior Ophthalmologist specializing in MICS cataract surgery and premium multifocal lenses.",
      bio_hi: "वरिष्ठ नेत्र रोग विशेषज्ञ — फेको मोतियाबिंद ऑपरेशन एवं प्रीमियम लेंस प्रत्यारोपण में 18 वर्षों का अनुभव।",
      specialization_en: "Cataract & Refractive Surgery",
      specialization_hi: "मोतियाबिंद एवं दृष्टि सुधार",
      verificationStatus: "VERIFIED",
      photoUrl: null,
    },
    {
      id: "doc-2",
      fullName: "Dr. Ananya Srivastava",
      email: "ananya.srivastava@prayageyecare.com",
      mobile: "9876500002",
      qualification: "MBBS, MD (Ophthalmology), FVR (Retina Specialist)",
      experienceYears: 12,
      consultationFee: 500,
      bio_en: "Expert Retina surgeon specializing in diabetic retinopathy, macular degeneration, and retinal lasers.",
      bio_hi: "रेटीना (पर्दा) विशेषज्ञ — डायबिटीज पर्दा रोग, लेजर एवं कांच द्रव ऑपरेशन में 12 वर्षों का अनुभव।",
      specialization_en: "Vitreoretinal Diseases & Surgery",
      specialization_hi: "रेटीना (पर्दा) एवं कांच द्रव रोग",
      verificationStatus: "VERIFIED",
      photoUrl: null,
    },
    {
      id: "doc-3",
      fullName: "Dr. Rajeshwar Patel",
      email: "rajeshwar.patel@prayageyecare.com",
      mobile: "9876500003",
      qualification: "MBBS, DO, DNB (Glaucoma Care)",
      experienceYears: 15,
      consultationFee: 350,
      bio_en: "Glaucoma specialist dedicated to early diagnosis and medical/surgical intraocular pressure control.",
      bio_hi: "काला मोतिया (ग्लूकोमा) विशेषज्ञ — आंख के प्रेशर नियंत्रण एवं सुरक्षा उपचार विशेषज्ञ।",
      specialization_en: "Glaucoma & Intraocular Pressure",
      specialization_hi: "काला मोतिया (ग्लूकोमा)",
      verificationStatus: "VERIFIED",
      photoUrl: null,
    },
    {
      id: "doc-4",
      fullName: "Dr. Priyanka Gupta",
      email: "priyanka.gupta@prayageyecare.com",
      mobile: "9876500004",
      qualification: "MBBS, MS (Pediatric Ophthalmology)",
      experienceYears: 9,
      consultationFee: 300,
      bio_en: "Specialist in pediatric eye screening, squint correction, and lazy eye therapy.",
      bio_hi: "बाल नेत्र रोग विशेषज्ञ — बच्चों की आंखों की जांच, भेंगापन एवं चश्मा नंबर विशेषज्ञ।",
      specialization_en: "Pediatric Ophthalmology & Squint",
      specialization_hi: "बाल नेत्र रोग एवं भेंगापन",
      verificationStatus: "VERIFIED",
      photoUrl: null,
    },
    // Pending Doctor Registration Request
    {
      id: "doc-5",
      fullName: "Dr. Amit Vikram Roy",
      email: "amit.roy@gmail.com",
      mobile: "9876500005",
      qualification: "MBBS, MS (Cornea Specialist)",
      experienceYears: 7,
      consultationFee: 400,
      bio_en: "Corneal transplant and ocular surface specialist seeking verification.",
      bio_hi: "कॉर्निया एवं आंख की सतह विशेषज्ञ (सत्यापन प्रक्रिया जारी)।",
      specialization_en: "Cornea & External Eye Diseases",
      specialization_hi: "कॉर्निया एवं बाहरी आंख रोग",
      verificationStatus: "PENDING",
      photoUrl: null,
    },
  ] as SeedDoctor[],

  demoUsers: [
    { role: "OWNER", email: "owner@hospital.com", mobile: "9999900001", name: "Hospital Owner (Admin)" },
    { role: "DOCTOR", email: "doctor@hospital.com", mobile: "9999900002", name: "Dr. Suresh Sharma" },
    { role: "RECEPTION", email: "reception@hospital.com", mobile: "9999900003", name: "Reception Front Desk" },
    { role: "OPTOMETRIST", email: "optometry@hospital.com", mobile: "9999900004", name: "Optometrist Staff" },
    { role: "PHARMACY", email: "pharmacy@hospital.com", mobile: "9999900005", name: "Pharmacy Store Manager" },
    { role: "OPTICAL", email: "optical@hospital.com", mobile: "9999900006", name: "Chashma Ghar Staff" },
    { role: "OT", email: "ot@hospital.com", mobile: "9999900007", name: "OT & Surgery Staff" },
  ],
};
