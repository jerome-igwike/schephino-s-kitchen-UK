import { sql } from 'drizzle-orm';

export interface TrackingIdGenerator {
  generate(): Promise<string>;
}

export class DatabaseTrackingIdGenerator implements TrackingIdGenerator {
  constructor(private db: any) {}

  async generate(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    // Use database transaction to ensure atomicity
    const result = await this.db.transaction(async (tx: any) => {
      // Try to get existing sequence for today
      const existing = await tx.query.trackingSequence.findFirst({
        where: (seq: any, { eq }: any) => eq(seq.date, dateStr),
      });

      let sequence: number;
      if (existing) {
        // Increment sequence
        sequence = existing.sequence + 1;
        await tx.execute(
          sql`UPDATE tracking_sequence SET sequence = ${sequence}, updated_at = NOW() WHERE date = ${dateStr}`
        );
      } else {
        // Create new sequence for today
        sequence = 1;
        await tx.execute(
          sql`INSERT INTO tracking_sequence (id, date, sequence, updated_at) VALUES ('default', ${dateStr}, ${sequence}, NOW())
              ON CONFLICT (id) DO UPDATE SET date = ${dateStr}, sequence = ${sequence}, updated_at = NOW()`
        );
      }

      return sequence;
    });

    // Format: SK-YYYYMMDD-NNNN
    const paddedSequence = result.toString().padStart(4, '0');
    return `SK-${dateStr}-${paddedSequence}`;
  }
}

export class MemoryTrackingIdGenerator implements TrackingIdGenerator {
  private sequences: Map<string, number> = new Map();

  async generate(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    const current = this.sequences.get(dateStr) || 0;
    const next = current + 1;
    this.sequences.set(dateStr, next);

    // Format: SK-YYYYMMDD-NNNN
    const paddedSequence = next.toString().padStart(4, '0');
    return `SK-${dateStr}-${paddedSequence}`;
  }
}
