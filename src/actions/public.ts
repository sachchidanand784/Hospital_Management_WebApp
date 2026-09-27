'use server';

import { prisma } from '@/lib/prisma';
import { SEED_DATA } from '@backend/db/seed';

export async function getPublicServices() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      include: { problems: true }
    });
    // Fallback to seed data if DB is empty
    return { success: true, services: services.length > 0 ? services : SEED_DATA.services };
  } catch (error) {
    console.error('Error fetching public services:', error);
    return { success: false, services: SEED_DATA.services };
  }
}

export async function getPublicDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      where: { verificationStatus: 'VERIFIED' },
      include: { specializations: true }
    });
    // Fallback to seed data if DB is empty
    return { success: true, doctors: doctors.length > 0 ? doctors : SEED_DATA.doctors.filter(d => d.verificationStatus === 'VERIFIED') };
  } catch (error) {
    console.error('Error fetching public doctors:', error);
    return { success: false, doctors: SEED_DATA.doctors.filter(d => d.verificationStatus === 'VERIFIED') };
  }
}

export async function getPublicSpecializations() {
  try {
    const specializations = await prisma.specialization.findMany({
      where: { active: true }
    });
    return { success: true, specializations: specializations.length > 0 ? specializations : SEED_DATA.specializations };
  } catch (error) {
    console.error('Error fetching public specializations:', error);
    return { success: false, specializations: SEED_DATA.specializations };
  }
}
