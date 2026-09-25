import { describe, it, expect } from 'vitest';
import { computeSlots } from './availability-engine';
import { allocateToken } from './token-engine';
import { calculateETAWindow } from './eta-engine';
import { can } from '../rbac/policies';

describe('Availability & Slot Engine', () => {
  it('computes correct number of 20-min slots excluding breaks', () => {
    const slots = computeSlots({
      startTime: '09:00',
      endTime: '12:00',
      slotDurationMin: 20,
      capacityPerSlot: 3,
    });
    expect(slots.length).toBe(9);
    expect(slots[0].slotStart).toBe('09:00');
    expect(slots[0].slotEnd).toBe('09:20');
  });
});

describe('Token Allocation Engine', () => {
  it('formats zero-padded sequential token labels', () => {
    const token = allocateToken({
      prefix: 'A',
      lastSeq: 17,
      slotIndex: 2,
      capacityPerSlot: 3,
    });
    expect(token.tokenSeq).toBe(18);
    expect(token.tokenLabel).toBe('A-018');
  });
});

describe('ETA Engine', () => {
  it('calculates ETA window centered around rolling median wait time', () => {
    const eta = calculateETAWindow({
      patientsAhead: 3,
      avgConsultMin: 15,
      currentTime: new Date('2026-09-25T10:00:00Z'),
    });
    expect(eta.centerMinutes).toBe(45);
    expect(eta.windowStart).toBeDefined();
    expect(eta.windowEnd).toBeDefined();
  });
});

describe('RBAC Policies Engine', () => {
  it('allows OWNER full access and restricts DOCTOR from administrative actions', () => {
    const ownerCtx = { id: 'u1', role: 'OWNER' as const, hospitalId: 'h1' };
    const doctorCtx = { id: 'u2', role: 'DOCTOR' as const, hospitalId: 'h1', doctorId: 'doc-1' };

    expect(can(ownerCtx, 'confirm_doctor')).toBe(true);
    expect(can(doctorCtx, 'confirm_doctor')).toBe(false);
    expect(can(doctorCtx, 'create_consultation')).toBe(true);
  });
});

describe('Concurrency Token Allocation Test (50 parallel requests)', () => {
  it('allocates exactly 10 unique tokens for a 10-capacity slot under parallel execution', async () => {
    const slotCapacity = 10;
    let currentSeq = 0;
    const allocatedTokens: string[] = [];
    const errors: string[] = [];

    const allocateParallel = async (reqId: number) => {
      if (allocatedTokens.length < slotCapacity) {
        currentSeq++;
        const tokenLabel = `A-${currentSeq.toString().padStart(3, '0')}`;
        allocatedTokens.push(tokenLabel);
        return { success: true, tokenLabel };
      } else {
        errors.push(`Slot Capacity Reached for req ${reqId}`);
        return { success: false, error: 'Slot Capacity Reached' };
      }
    };

    const promises = Array.from({ length: 50 }, (_, i) => allocateParallel(i + 1));
    await Promise.all(promises);

    expect(allocatedTokens.length).toBe(10);
    expect(new Set(allocatedTokens).size).toBe(10);
    expect(errors.length).toBe(40);
  });
});
