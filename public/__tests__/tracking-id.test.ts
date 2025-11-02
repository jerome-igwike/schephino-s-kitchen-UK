import { MemoryTrackingIdGenerator } from '../server/utils/tracking-id';

describe('Tracking ID Generator', () => {
  it('should generate tracking IDs in correct format SK-YYYYMMDD-NNNN', async () => {
    const generator = new MemoryTrackingIdGenerator();
    const trackingId = await generator.generate();

    expect(trackingId).toMatch(/^SK-\d{8}-\d{4}$/);
  });

  it('should generate sequential tracking IDs on the same day', async () => {
    const generator = new MemoryTrackingIdGenerator();
    
    const id1 = await generator.generate();
    const id2 = await generator.generate();
    const id3 = await generator.generate();

    // Extract the sequence numbers
    const seq1 = parseInt(id1.split('-')[2]);
    const seq2 = parseInt(id2.split('-')[2]);
    const seq3 = parseInt(id3.split('-')[2]);

    expect(seq2).toBe(seq1 + 1);
    expect(seq3).toBe(seq2 + 1);
  });

  it('should pad sequence numbers with zeros', async () => {
    const generator = new MemoryTrackingIdGenerator();
    const trackingId = await generator.generate();

    const sequencePart = trackingId.split('-')[2];
    expect(sequencePart).toHaveLength(4);
    expect(sequencePart[0]).toMatch(/[0-9]/);
  });

  it('should include current date in format YYYYMMDD', async () => {
    const generator = new MemoryTrackingIdGenerator();
    const trackingId = await generator.generate();

    const today = new Date();
    const expectedDate = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    expect(trackingId).toContain(expectedDate);
  });
});
