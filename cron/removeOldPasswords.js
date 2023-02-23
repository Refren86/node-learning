const { CronJob } = require('cron');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

const { oldPasswordSchema } = require('../dataBase');

dayjs.extend(utc); // will keep server in Grinwitch timezone (0 UTC)

// NB! Stars is responsible for time (from left to right):
// Seconds: 0-59 - optional
// Minutes: 0-59
// Hours: 0-23
// Day of Month: 1-31
// Months: 0-11 (Jan-Dec)
// Day of Week: 0-6 (Sun-Sat)

module.exports = new CronJob(
  '* * * 1 * *', // every 1st day of month
  async function () {
    try {
      console.log('Deleting old passwords...');
      const yearAgo = dayjs().utc().subtract(1, 'year');

      // deletes passwords older than 1 year
      await oldPasswordSchema.deleteMany({
        createdAt: { $lte: yearAgo.toISOString() },
      });
      console.log('Finished old passwords deletion');
    } catch (error) {
      console.log('Error >', error.message);
      next(error);
    }
  }
);
// Use this if the 4th param is default value(false)
// job.start()
