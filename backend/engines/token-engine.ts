export interface TokenAllocationInput {
  prefix: string;      // "A", "B", "W", "E"
  lastSeq: number;     // e.g. 17
  slotIndex: number;   // 1-indexed slot
  capacityPerSlot: number; // e.g. 3
  isOverflow?: boolean;
}

export interface TokenAllocationResult {
  tokenSeq: number;
  tokenLabel: string; // "A-018"
}

export function allocateToken(input: TokenAllocationInput): TokenAllocationResult {
  const nextSeq = input.lastSeq + 1;
  const seqPadded = nextSeq.toString().padStart(3, '0');
  const tokenLabel = `${input.prefix}-${seqPadded}`;

  return {
    tokenSeq: nextSeq,
    tokenLabel,
  };
}
