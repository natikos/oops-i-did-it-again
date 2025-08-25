import 'reflect-metadata';

import { Application } from './src/Application';

const app = new Application();

const run = async () => {
  await app.init();
};

run().then(() =>
  app.listen(3000, () =>
    console.log(`Server is accessible on http://localhost:3000`)
  )
);
