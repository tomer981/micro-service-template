import {TokenBucketCreditPolicy} from '@src/config/TokenBucketCreditPolicy';
import {LeakyBucketCreditPolicy} from '@src/config/LeakyBucketCreditPolicy';
import {ConcurrencyControlledCreditPolicy} from '@src/config/ConcurrencyControlledCreditPolicy';
import {ConsumerCreditPolicy, CreditRequestWrapper} from 'rabbitmq-stream-js-client/dist/consumer_credit_policy';

export class ComprehensiveRateLimitPolicy extends ConsumerCreditPolicy {
  private tokenBucket: TokenBucketCreditPolicy;
  private leakyBucket: LeakyBucketCreditPolicy;
  private concurrencyControl: ConcurrencyControlledCreditPolicy;

  constructor(
    tokenBucketConfig: { capacity: number, rate: number },
    leakyBucketConfig: { rate: number, capacity: number },
    concurrencyConfig: { maxConcurrent: number },
    batchSize = 1,
    startFrom: number = batchSize,
  ) {
    super(startFrom);
    this.tokenBucket = new TokenBucketCreditPolicy(
      tokenBucketConfig.capacity,
      tokenBucketConfig.rate,
      batchSize,
      startFrom,
    );
    this.leakyBucket = new LeakyBucketCreditPolicy(
      leakyBucketConfig.rate,
      leakyBucketConfig.capacity,
      batchSize,
      startFrom,
    );
    this.concurrencyControl = new ConcurrencyControlledCreditPolicy(
      concurrencyConfig.maxConcurrent,
      batchSize,
      startFrom,
    );
  }

  public async onChunkCompleted(requestWrapper: CreditRequestWrapper): Promise<void> {
    await this.tokenBucket.onChunkCompleted(async (amount) => {
      await this.leakyBucket.onChunkCompleted(async (amount) => {
        await this.concurrencyControl.onChunkCompleted(requestWrapper);
      });
    });
  }

  public onSubscription(): number {
    return Math.min(
      this.tokenBucket.onSubscription(),
      this.leakyBucket.onSubscription(),
      this.concurrencyControl.onSubscription(),
    );
  }
}