import fastify from 'fastify';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { DriversRecord } from './types';

interface Query {
  latitude: number;
  longitude: number;
  count: number;
}

function startServer() {
  const app = fastify();

  app.register(require('fastify-cors'), {
    origin: '*' 
  });

  app.get<{ Querystring: Query}>('/drivers', async (request, reply) => {
    const { latitude, longitude, count } = request.query;
    const limit = count ?? 20;
    let error;

    if (!longitude) {
      error = 'Missing longitude parameter'
    }

    if (!latitude) {
      error = 'Missing latitude parameter'
    }

    if (error) {
      reply.status(400).send({
        status: 400,
        error: `Invalid request. ${error}`
      });
      return;
    }

    try {
      const params = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        count: String(limit)
      }).toString();
      const response = await fetch(`https://qa-interview-test.splytech.dev/api/drivers?${params}`);
      const jsonData = await response.json() as DriversRecord;

      if (!jsonData || !jsonData.drivers.length) {
        reply.status(404).send({
          status: 404,
          error: 'Drivers not found'
        });
        return;
      }

      reply.status(200).send(jsonData.drivers);
    } catch(error: any) {
      reply.status(500).send({
        status: 500,
        error: `Failed while fetching drivers. ${error.message}`
      });
    }
  });

  app.listen(8000, 'localhost', (err, address) => {
    if (err) {
      console.error('Error during starting server', err);
      process.exit(1);
    }
    console.info(`Server listening on ${address}`);
  });
}

startServer();