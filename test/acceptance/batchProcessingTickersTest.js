import { expect } from 'chai';
import requestPromise from 'request-promise';
import server from '../../src/server';
import mongodbStub from '../stub/mongo/TickersWithoutChromosomeMongoStub';
import RedisSpy from '../stub/redis/RedisSpy';

describe('Tests for behaviors that process all un-decorated tickers', () => {

  before(() => {

    const redisSpy = new RedisSpy();
    return server.start(mongodbStub, redisSpy);
  });

  after(() => {

    server.stop();
  });

  describe('When orchestrating the decoration of tickers', () => {

    it('Then only tickers without a chromosome are processed', () => {

      return batchProcessTickers().then((responseBody) => {

        const expectedChromsomeIds = mongodbStub.MongoClient.getDatabase().collection()
          .find()
          .toArray()
          .map((ticker) => {

            // eslint-disable-next-line no-underscore-dangle
            return ticker._id;
          });

        const processedTickers = JSON.parse(responseBody);
        expect(processedTickers).to.have.deep.members(expectedChromsomeIds);
      });
    });
  });
});

async function batchProcessTickers() {

  const processResponse = await processTickers();
  return getProcessedTickers(processResponse);
}

function processTickers() {

  const options = {
    method: 'POST',
    uri: 'http://localhost:8080/chromosomes',
  };

  const tickersProcessed = requestPromise(options).then((data) => {

    return JSON.parse(data);
  }).catch((err) => {

    console.error(err.toString());
  });

  return tickersProcessed;
}

function getProcessedTickers(resourceId) {

  const options = {
    method: 'GET',
    uri: `http://localhost:8080/chromosomes/${resourceId}`,
  };

  return requestPromise(options).then((data) => {

    return data;
  }).catch((err) => {

    console.error(err.toString());
  });
}

