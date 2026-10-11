'use server';

import { prisma } from '@/lib/prisma';
import { SEED_DATA } from '@backend/db/seed';

export async function getHospitalSettings() {
  try {
    const hospital = await prisma.hospital.findFirst({
      orderBy: { createdAt: 'asc' }
    });
    
    const [
      emergencySetting,
      timingSetting,
      closedDaySetting,
      freeCheckupSetting
    ] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'HOSPITAL_EMERGENCY_24X7' } }),
      prisma.setting.findUnique({ where: { key: 'HOSPITAL_TIMINGS' } }),
      prisma.setting.findUnique({ where: { key: 'HOSPITAL_CLOSED_DAYS' } }),
      prisma.setting.findUnique({ where: { key: 'HOSPITAL_FREE_CHECKUP' } })
    ]);

    const timingData = (timingSetting?.value as any) || {
      openTime: '09:00',
      closeTime: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00',
    };

    const closedDaysData = (closedDaySetting?.value as any) || {
      closedDay: 'Sunday', // Sunday, Monday, etc. or 'None'
      isCurrentlyClosed: false,
    };

    const freeCheckupData = (freeCheckupSetting?.value as any) || {
      enabled: true,
      day: 'Tuesday', // Tuesday, Thursday, Daily, etc.
      title_en: "Today's Free OPD Eye Checkup Available!",
      title_hi: "आज निःशुल्क सामान्य नेत्र जांच उपलब्ध है!",
      discountNote: "Every Tuesday Free OPD Consultation"
    };

    if (!hospital) {
      return { 
        success: true, 
        hospital: {
          name_en: SEED_DATA.hospital.name_en,
          name_hi: SEED_DATA.hospital.name_hi,
          address_en: SEED_DATA.hospital.address_en,
          address_hi: SEED_DATA.hospital.address_hi,
          email: SEED_DATA.hospital.email,
          phone1: SEED_DATA.hospital.phones[0] || '',
          phone2: SEED_DATA.hospital.phones[1] || '',
          emergencyPhone: SEED_DATA.hospital.emergencyPhone,
          emergency24x7: SEED_DATA.hospital.emergency24x7 as boolean,
          openTime: timingData.openTime,
          closeTime: timingData.closeTime,
          closedDay: closedDaysData.closedDay,
          freeCheckupDay: freeCheckupData.day,
          freeCheckupEnabled: freeCheckupData.enabled,
        }
      };
    }

    return { 
      success: true, 
      hospital: {
        name_en: hospital.name_en,
        name_hi: hospital.name_hi || hospital.name_en,
        address_en: hospital.address_en,
        address_hi: hospital.address_hi || hospital.address_en,
        email: hospital.email || '',
        phone1: hospital.phones[0] || '',
        phone2: hospital.phones[1] || '',
        emergencyPhone: hospital.emergencyPhone || '',
        emergency24x7: (emergencySetting ? emergencySetting.value : true) as boolean,
        openTime: timingData.openTime,
        closeTime: timingData.closeTime,
        closedDay: closedDaysData.closedDay,
        freeCheckupDay: freeCheckupData.day,
        freeCheckupEnabled: freeCheckupData.enabled,
      } 
    };
  } catch (error) {
    console.error('Failed to get hospital settings:', error);
    return { success: false, error: 'Failed to fetch settings' };
  }
}

export async function updateHospitalSettings(data: any) {
  try {
    let hospital = await prisma.hospital.findFirst({
      orderBy: { createdAt: 'asc' }
    });
    
    if (hospital) {
      await prisma.hospital.update({
        where: { id: hospital.id },
        data: {
          name_en: data.name_en,
          name_hi: data.name_hi,
          address_en: data.address_en,
          address_hi: data.address_hi || data.address_en,
          email: data.email,
          phones: [data.phone1, data.phone2].filter(Boolean),
          emergencyPhone: data.emergencyPhone,
        }
      });
    } else {
      await prisma.hospital.create({
        data: {
          name_en: data.name_en,
          name_hi: data.name_hi,
          address_en: data.address_en,
          address_hi: data.address_hi || data.address_en,
          email: data.email,
          phones: [data.phone1, data.phone2].filter(Boolean),
          emergencyPhone: data.emergencyPhone,
        }
      });
    }

    // 1. Emergency 24x7 Setting
    await prisma.setting.upsert({
      where: { key: 'HOSPITAL_EMERGENCY_24X7' },
      update: { value: Boolean(data.emergency24x7) },
      create: { key: 'HOSPITAL_EMERGENCY_24X7', value: Boolean(data.emergency24x7) }
    });

    // 2. Timings Setting (Opening & Closing times)
    await prisma.setting.upsert({
      where: { key: 'HOSPITAL_TIMINGS' },
      update: {
        value: {
          openTime: data.openTime || '09:00',
          closeTime: data.closeTime || '18:00',
        }
      },
      create: {
        key: 'HOSPITAL_TIMINGS',
        value: {
          openTime: data.openTime || '09:00',
          closeTime: data.closeTime || '18:00',
        }
      }
    });

    // 3. Closed Days Setting (Kis din aspatal band rahega)
    await prisma.setting.upsert({
      where: { key: 'HOSPITAL_CLOSED_DAYS' },
      update: {
        value: {
          closedDay: data.closedDay || 'Sunday',
        }
      },
      create: {
        key: 'HOSPITAL_CLOSED_DAYS',
        value: {
          closedDay: data.closedDay || 'Sunday',
        }
      }
    });

    // 4. Free Checkup Day Setting (Kis din Free jaanch hogi)
    await prisma.setting.upsert({
      where: { key: 'HOSPITAL_FREE_CHECKUP' },
      update: {
        value: {
          enabled: data.freeCheckupEnabled !== false,
          day: data.freeCheckupDay || 'Tuesday',
          title_en: `Free OPD Eye Checkup Day: Every ${data.freeCheckupDay || 'Tuesday'}!`,
          title_hi: `आज निःशुल्क सामान्य नेत्र जांच उपलब्ध है (प्रत्येक ${data.freeCheckupDay || 'मंगलवार'})!`
        }
      },
      create: {
        key: 'HOSPITAL_FREE_CHECKUP',
        value: {
          enabled: data.freeCheckupEnabled !== false,
          day: data.freeCheckupDay || 'Tuesday',
          title_en: `Free OPD Eye Checkup Day: Every ${data.freeCheckupDay || 'Tuesday'}!`,
          title_hi: `आज निःशुल्क सामान्य नेत्र जांच उपलब्ध है (प्रत्येक ${data.freeCheckupDay || 'मंगलवार'})!`
        }
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update hospital settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
