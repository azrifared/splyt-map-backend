import fastify from 'fastify';

async function startServer() {
  const app = fastify();

  app.register(require('fastify-cors'), {
    origin: '*'
  });

  app.listen(8000, 'localhost', (err, address) => {
    if (err) {
      console.error('Error during starting server', err);
      process.exit(1);
    }
  })
}

startServer().then(() => {
  console.info(`Server listening on localhost:8000`);
});