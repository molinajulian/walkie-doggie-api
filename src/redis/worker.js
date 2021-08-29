const throng = require('throng');
const Queue = require('bull');

// Connect to a local redis instance locally, and the Heroku-provided URL in production
const { url } = require('../config').redis;

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;

const start = () => {
  // Connect to the named work queue
  const workQueue = new Queue('work', url);

  workQueue.process(maxJobsPerWorker, async job => {
    console.log(job);
  });
};

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
