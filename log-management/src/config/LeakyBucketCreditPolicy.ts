import {ConsumerCreditPolicy, CreditRequestWrapper} from 'rabbitmq-stream-js-client/dist/consumer_credit_policy';

export class LeakyBucketCreditPolicy extends ConsumerCreditPolicy {
  private lastLeakTime: number;
  private readonly leakRate: number;
  private readonly capacity: number;
  private currentLevel = 0;
  private readonly batchSize: number;

  constructor(
    leakRate: number,
    capacity: number,
    batchSize = 1,
    startFrom: number = batchSize,
  ) {
    super(startFrom);
    this.leakRate = leakRate;
    this.capacity = capacity;
    this.batchSize = batchSize;
    this.lastLeakTime = Date.now();
  }

  private leak(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastLeakTime) / 1000;
    const leakedAmount = elapsedSeconds * this.leakRate;
    this.currentLevel = Math.max(0, this.currentLevel - leakedAmount);
    this.lastLeakTime = now;
  }

  public async onChunkCompleted(requestWrapper: CreditRequestWrapper): Promise<void> {
    this.leak();

    if (this.currentLevel + this.batchSize <= this.capacity) {
      this.currentLevel += this.batchSize;
      await this.requestCredits(requestWrapper, this.batchSize);
    } else {
      const waitTime = ((this.currentLevel + this.batchSize - this.capacity) / this.leakRate) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      await this.onChunkCompleted(requestWrapper); 
    }
  }

  public onSubscription(): number {
    return this.batchSize;
  }
}