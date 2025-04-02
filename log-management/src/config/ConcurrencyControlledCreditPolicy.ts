import {ConsumerCreditPolicy, CreditRequestWrapper} from 'rabbitmq-stream-js-client/dist/consumer_credit_policy';

export class ConcurrencyControlledCreditPolicy extends ConsumerCreditPolicy {
  private activeOperations = 0;
  private readonly maxConcurrent: number;
  private readonly batchSize: number;
  private readonly queue: (() => void)[] = [];

  constructor(
    maxConcurrent: number,
    batchSize = 1,
    startFrom: number = batchSize,
  ) {
    super(startFrom);
    this.maxConcurrent = maxConcurrent;
    this.batchSize = batchSize;
  }

  private async acquireSlot(): Promise<void> {
    if (this.activeOperations < this.maxConcurrent) {
      this.activeOperations++;
      return;
    }

    await new Promise<void>(resolve => this.queue.push(resolve));
  }

  private releaseSlot(): void {
    this.activeOperations--;
    const nextResolver = this.queue.shift();
    if (nextResolver) {
      this.activeOperations++;
      nextResolver();
    }
  }

  public async onChunkCompleted(requestWrapper: CreditRequestWrapper): Promise<void> {
    try {
      await this.acquireSlot();
      await this.requestCredits(requestWrapper, this.batchSize);
    } finally {
      this.releaseSlot();
    }
  }

  public onSubscription(): number {
    return this.batchSize; // Initial credit request
  }
}