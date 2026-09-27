'use server';

import { prisma } from '@/lib/prisma';
import { SEED_DATA } from '@backend/db/seed';

export async function getHospitalSettings() {
  try {
    const hospital = await prisma.hospital.findFirst();
    const emergencySetting = await prisma.setting.findUnique({
      where: { key: 'HOSPITAL_EMERGENCY_24X7' }
    });

    if (!hospital) {
      // Return default if DB is empty
      return { 
        success: true, 
        hospital: {
          name_en: SEED_DATA.hospital.name_en,
          name_hi: SEED_DATA.hospital.name_hi,
          address_en: SEED_DATA.hospital.address_en,
          email: SEED_DATA.hospital.email,
          phone1: SEED_DATA.hospital.phones[0] || '',
          phone2: SEED_DATA.hospital.phones[1] || '',
          emergencyPhone: SEED_DATA.hospital.emergencyPhone,
          emergency24x7: SEED_DATA.hospital.emergency24x7 as boolean,
        }
      };
    }

    return { 
      success: true, 
      hospital: {
        name_en: hospital.name_en,
        name_hi: hospital.name_hi || '',
        address_en: hospital.address_en,
        email: hospital.email || '',
        phone1: hospital.phones[0] || '',
        phone2: hospital.phones[1] || '',
        emergencyPhone: hospital.emergencyPhone || '',
        emergency24x7: (emergencySetting ? emergencySetting.value : true) as boolean,
      } 
    };
  } catch (error) {
    console.error('Failed to get hospital settings:', error);
    return { success: false, error: 'Failed to fetch settings' };
  }
}

export async function updateHospitalSettings(data: any) {
  try {
    let hospital = await prisma.hospital.findFirst();
    
    if (hospital) {
      await prisma.hospital.update({
        where: { id: hospital.id },
        data: {
          name_en: data.name_en,
          name_hi: data.name_hi,
          address_en: data.address_en,
          email: data.email,
          phones: [data.phone1, data.phone2].filter(Boolean),
          emergencyPhone: data.emergencyPhone,
        }
      });
    } else {
      // Create if it doesn't exist
      await prisma.hospital.create({
        data: {
          name_en: data.name_en,
          name_hi: data.name_hi,
          address_en: data.address_en,
          email: data.email,
          phones: [data.phone1, data.phone2].filter(Boolean),
          emergencyPhone: data.emergencyPhone,
        }
      });
    }

    await prisma.setting.upsert({
      where: { key: 'HOSPITAL_EMERGENCY_24X7' },
      update: { value: data.emergency24x7 },
      create: { key: 'HOSPITAL_EMERGENCY_24X7', value: data.emergency24x7 }
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update hospital settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
