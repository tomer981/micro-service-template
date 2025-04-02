import {ConsumerCreditPolicy, CreditRequestWrapper} from 'rabbitmq-stream-js-client/dist/consumer_credit_policy';

export class TokenBucketCreditPolicy extends ConsumerCreditPolicy {
  private tokens: number;
  private lastRefillTime: number;
  private readonly capacity: number;
  private readonly refillRate: number;
  private readonly batchSize: number;

  constructor(
    capacity: number,
    refillRate: number,
    batchSize = 1,
    startFrom: number = batchSize,
  ) {
    super(startFrom);
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.batchSize = batchSize;
    this.tokens = capacity;
    this.lastRefillTime = Date.now();
  }

  private refillTokens(): void {
    const now = Date.now();
    const elapsedSeconds = (now - this.lastRefillTime) / 1000;
    const tokensToAdd = elapsedSeconds * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  public async onChunkCompleted(requestWrapper: CreditRequestWrapper): Promise<void> {
    this.refillTokens();

    if (this.tokens >= this.batchSize) {
      this.tokens -= this.batchSize;
      await this.requestCredits(requestWrapper, this.batchSize);
    } else {
      const waitTime = ((this.batchSize - this.tokens) / this.refillRate) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      await this.onChunkCompleted(requestWrapper);
    }
  }

  public onSubscription(): number {
    return this.batchSize;
  }
}