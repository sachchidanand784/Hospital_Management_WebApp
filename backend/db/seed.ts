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
    name_en: "M S Memorial Netralaya",
    name_hi: "एम एस मेमोरियल नेत्रालय",
    address_en: "Dildarnagar Tarighat Road, Bangalapar, Dildarnagar, Ghazipur, Uttar Pradesh 232326",
    address_hi: "दिलदारनगर ताड़ीघाट रोड, बंगलापार, दिलदारनगर, गाजीपुर, उत्तर प्रदेश 232326",
    phones: ["+91 80048 00688", "+91 80048 00699"],
    email: "info@msmemorialnetralaya.com",
    emergencyPhone: "+91 80048 00688",
    about_en: "Welcome to M S Memorial Netralaya, a trusted destination for comprehensive eyecare services. Established in 2008 in Dildarnagar, Ghazipur, our core mission is to serve with world-class Phaco cataract surgery, advanced Vitreo-Retina care, and modern digital token tracking.",
    about_hi: "एम एस मेमोरियल नेत्रालय, दिलदारनगर (गाजीपुर) का प्रमुख नेत्र चिकित्सालय है, जिसकी स्थापना 2008 में हुई। यहां आधुनिक फेको मोतियाबिंद ऑपरेशन, विट्रियो-रेटिना लेजर व डिजिटल टोकन प्रणाली द्वारा विश्वस्तरीय नेत्र चिकित्सा प्रदान की जाती है।",
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
      name_en: "Vitreo Retinal Laser & Surgery",
      name_hi: "विट्रियो रेटिना लेजर व शल्य चिकित्सा",
      desc_en: "OCT scan, fundus angiography, diabetic retinopathy screening, and retinal laser.",
      desc_hi: "ओसीटी स्कैन, डायबिटीज पर्दा जांच एवं आधुनिक विट्रियो-रेटिना लेजर ट्रीटमेंट।",
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
      fullName: "Dr. Madhav Mukund",
      email: "madhav.mukund@msmemorialnetralaya.com",
      mobile: "8004800688",
      qualification: "MBBS (KGMC Lucknow), MS (GSVM Kanpur)",
      experienceYears: 16,
      consultationFee: 400,
      bio_en: "Founder & Chief Eye Specialist. Highly experienced in advanced Phaco cataract surgery, glaucoma, laser treatments, and patient care.",
      bio_hi: "संस्थापक एवं मुख्य नेत्र रोग विशेषज्ञ — केजीएमसी लखनऊ एवं जीएसवीएम कानपुर से प्रशिक्षित। फेको मोतियाबिंद, ग्लूकोमा व लेजर उपचार में 16+ वर्षों का अनुभव।",
      specialization_en: "Cataract & Comprehensive Eye Surgery",
      specialization_hi: "मोतियाबिंद एवं सम्पूर्ण नेत्र शल्य चिकित्सा",
      verificationStatus: "VERIFIED",
      photoUrl: "/images/doctors/dr-madhav-mukund.jpg",
    },
    {
      id: "doc-2",
      fullName: "Dr. Kshitij Aaditya",
      email: "kshitij.aaditya@msmemorialnetralaya.com",
      mobile: "8004800699",
      qualification: "M.B.B.S., DNB, FVRS (Retina), FICO (LONDON), FRCS II (GLASGOW)",
      experienceYears: 12,
      consultationFee: 500,
      bio_en: "Senior Vitreo-Retina & ROP Specialist. Expert in diabetic retinopathy, retinal laser surgery, and complex vitreoretinal disorders.",
      bio_hi: "वरिष्ठ रेटिना एवं ROP स्पेशलिस्ट — लंदन एवं ग्लासगो से फेलोशिप प्राप्त। डायबिटीज पर्दा रोग, रेटिना लेजर एवं जटिल पर्दा शल्य चिकित्सा विशेषज्ञ।",
      specialization_en: "Vitreo-Retina & ROP Specialist",
      specialization_hi: "विट्रियो-रेटिना एवं पर्दा विशेषज्ञ",
      verificationStatus: "VERIFIED",
      photoUrl: "/images/doctors/dr-kshitij-aaditya.jpg",
    },
    {
      id: "doc-3",
      fullName: "Dr. Arvind Gautam",
      email: "arvind.gautam@msmemorialnetralaya.com",
      mobile: "8004800688",
      qualification: "MBBS, MS (Ophthalmology)",
      experienceYears: 14,
      consultationFee: 350,
      bio_en: "Renowned Ophthalmologist specializing in Glaucoma management, anterior segment, and comprehensive eye care.",
      bio_hi: "वरिष्ठ नेत्र रोग विशेषज्ञ — ग्लूकोमा (काला मोतिया), कॉर्निया एवं व्यापक नेत्र रोगों के कुशल सर्जन।",
      specialization_en: "Glaucoma & Anterior Segment",
      specialization_hi: "काला मोतिया (ग्लूकोमा) एवं नेत्र शल्य चिकित्सा",
      verificationStatus: "VERIFIED",
      photoUrl: "/images/doctors/dr-arvind-gautam.jpg",
    },
    {
      id: "doc-4",
      fullName: "Dr. Priyanka Gupta",
      email: "priyanka.gupta@msmemorialnetralaya.com",
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

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed Hospital Settings
  await prisma.hospital.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name_en: SEED_DATA.hospital.name_en,
      name_hi: SEED_DATA.hospital.name_hi,
      address_en: SEED_DATA.hospital.address_en,
      address_hi: SEED_DATA.hospital.address_hi,
      email: SEED_DATA.hospital.email,
      phones: SEED_DATA.hospital.phones,
      emergencyPhone: SEED_DATA.hospital.emergencyPhone,
      about_en: SEED_DATA.hospital.about_en,
      about_hi: SEED_DATA.hospital.about_hi,
    }
  });

  // Seed Services
  for (const srv of SEED_DATA.services) {
    await prisma.service.upsert({
      where: { id: srv.id },
      update: {},
      create: {
        id: srv.id,
        name_en: srv.name_en,
        name_hi: srv.name_hi,
        desc_en: srv.desc_en,
        desc_hi: srv.desc_hi,
        problems: {
          create: srv.problems.map(p => ({
            id: p.id,
            name_en: p.name_en,
            name_hi: p.name_hi,
            redFlag: p.redFlag || false
          }))
        }
      }
    });
  }

  // Seed Doctors
  for (const doc of SEED_DATA.doctors) {
    await prisma.doctor.upsert({
      where: { id: doc.id },
      update: {},
      create: {
        id: doc.id,
        fullName: doc.fullName,
        email: doc.email,
        mobile: doc.mobile,
        qualification: doc.qualification,
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        bio_en: doc.bio_en,
        bio_hi: doc.bio_hi,
        verificationStatus: doc.verificationStatus,
        user: {
          create: {
            email: doc.email,
            mobile: doc.mobile,
            passwordHash: 'mock_password_hash',
            role: 'DOCTOR',
          }
        }
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
