'use server';
import { prisma } from '@/lib/prisma';
import { SEED_DATA } from '@backend/db/seed';

export async function getOwnerDashboardData() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { user: true, specializations: true }
    });
    const services = await prisma.service.findMany({ where: { active: true } });
    const specializations = await prisma.specialization.findMany({ where: { active: true } });
    const users = await prisma.user.findMany({
      where: { role: { notIn: ['OWNER', 'DOCTOR'] } }
    });

    return { 
      success: true, 
      doctors: doctors.length > 0 ? doctors : SEED_DATA.doctors,
      services: services.length > 0 ? services : SEED_DATA.services,
      specializations: specializations.length > 0 ? specializations : SEED_DATA.specializations,
      staff: users.length > 0 ? users : SEED_DATA.demoUsers || []
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      doctors: SEED_DATA.doctors,
      services: SEED_DATA.services,
      specializations: SEED_DATA.specializations,
      staff: SEED_DATA.demoUsers || []
    };
  }
}
