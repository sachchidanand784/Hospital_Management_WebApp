const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const hospitalData = {
  name_en: "M S Memorial Netralaya",
  name_hi: "एम एस मेमोरियल नेत्रालय",
  address_en: "Dildarnagar Tarighat Road, Bangalapar, Dildarnagar, Ghazipur, Uttar Pradesh 232326",
  address_hi: "दिलदारनगर ताड़ीघाट रोड, बंगलापार, दिलदारनगर, गाजीपुर, उत्तर प्रदेश 232326",
  phones: ["+91 80048 00688", "+91 80048 00699"],
  email: "info@msmemorialnetralaya.com",
  emergencyPhone: "+91 80048 00688",
  about_en: "Welcome to M S Memorial Netralaya, a trusted destination for comprehensive eyecare services. Established in 2008 in Dildarnagar, Ghazipur, our core mission is to serve with world-class Phaco cataract surgery, advanced Vitreo-Retina care, and modern digital token tracking.",
  about_hi: "एम एस मेमोरियल नेत्रालय, दिलदारनगर (गाजीपुर) का प्रमुख नेत्र चिकित्सालय है, जिसकी स्थापना 2008 में हुई। यहां आधुनिक फेको मोतियाबिंद ऑपरेशन, विट्रियो-रेटिना लेजर व डिजिटल टोकन प्रणाली द्वारा विश्वस्तरीय नेत्र चिकित्सा प्रदान की जाती है।",
  logo: "/images/logo.png"
};

const doctorsData = [
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
    photoUrl: "/images/doctors/dr-madhav-mukund.jpg"
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
    photoUrl: "/images/doctors/dr-kshitij-aaditya.jpg"
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
    photoUrl: "/images/doctors/dr-arvind-gautam.jpg"
  }
];

async function syncLiveDb() {
  console.log('Connecting to Live Database via Prisma...');

  // 1. Hospital record
  const existing = await prisma.hospital.findFirst({
    orderBy: { createdAt: 'asc' }
  });

  if (existing) {
    console.log(`Found existing hospital: "${existing.name_en}" (ID: ${existing.id})`);
    const updated = await prisma.hospital.update({
      where: { id: existing.id },
      data: hospitalData
    });
    console.log(`✓ Updated Hospital to: "${updated.name_en}"`);
  } else {
    console.log('No existing hospital record found. Creating new...');
    const created = await prisma.hospital.create({
      data: hospitalData
    });
    console.log(`✓ Created Hospital: "${created.name_en}"`);
  }

  // 2. Settings (Emergency, Timings, Closed Days, Free Checkup)
  await prisma.setting.upsert({
    where: { key: 'HOSPITAL_EMERGENCY_24X7' },
    update: { value: true },
    create: { key: 'HOSPITAL_EMERGENCY_24X7', value: true }
  });

  await prisma.setting.upsert({
    where: { key: 'HOSPITAL_TIMINGS' },
    update: {
      value: {
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '13:00',
        breakEnd: '14:00',
      }
    },
    create: {
      key: 'HOSPITAL_TIMINGS',
      value: {
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '13:00',
        breakEnd: '14:00',
      }
    }
  });

  await prisma.setting.upsert({
    where: { key: 'HOSPITAL_CLOSED_DAYS' },
    update: {
      value: {
        closedDay: 'Sunday',
        isCurrentlyClosed: false,
      }
    },
    create: {
      key: 'HOSPITAL_CLOSED_DAYS',
      value: {
        closedDay: 'Sunday',
        isCurrentlyClosed: false,
      }
    }
  });

  await prisma.setting.upsert({
    where: { key: 'HOSPITAL_FREE_CHECKUP' },
    update: {
      value: {
        enabled: true,
        day: 'Tuesday',
        title_en: "Today's Special Eye OPD Consultation Available!",
        title_hi: "आज विशेष नेत्र परामर्श उपलब्ध है!",
        discountNote: "Every Tuesday Special OPD Consultation"
      }
    },
    create: {
      key: 'HOSPITAL_FREE_CHECKUP',
      value: {
        enabled: true,
        day: 'Tuesday',
        title_en: "Today's Special Eye OPD Consultation Available!",
        title_hi: "आज विशेष नेत्र परामर्श उपलब्ध है!",
        discountNote: "Every Tuesday Special OPD Consultation"
      }
    }
  });
  console.log('✓ Upserted hospital settings in Live DB');

  // 3. Update doctors
  for (const d of doctorsData) {
    try {
      const doc = await prisma.doctor.findUnique({ where: { id: d.id } });
      if (doc) {
        await prisma.doctor.update({
          where: { id: d.id },
          data: {
            fullName: d.fullName,
            qualification: d.qualification,
            bio_en: d.bio_en,
            bio_hi: d.bio_hi,
            consultationFee: d.consultationFee,
            experienceYears: d.experienceYears,
            photoUrl: d.photoUrl,
          }
        });
        console.log(`✓ Updated Doctor in Live DB: ${d.fullName}`);
      }
    } catch (e) {
      console.warn(`Could not update doctor ${d.id}:`, e.message);
    }
  }

  console.log('✓ All Live Database changes committed successfully!');
}

syncLiveDb()
  .catch((err) => {
    console.error('Error syncing live DB:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
