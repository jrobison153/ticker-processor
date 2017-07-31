export default class DecoratorService {

  constructor(redis) {

    let host = 'localhost';

    if (process.env.HOPPER_REDIS_CONNECTION_HOST) {

      host = process.env.HOPPER_REDIS_CONNECTION_HOST;
    }

    let port = '6379';

    if (process.env.HOPPER_REDIS_CONNECTION_PORT) {

      port = process.env.HOPPER_REDIS_CONNECTION_PORT;
    }

    this.redisClient = redis.createClient(host, port);
  }

  decorateTicker(ticker) {

    this.redisClient.rpush('UNDECORATED_TICKERS', JSON.stringify(ticker));
  }
}

