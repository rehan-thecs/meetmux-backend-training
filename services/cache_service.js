const redis = require('redis');

/*
|--------------------------------------------------------------------------
| Create Redis Client
|--------------------------------------------------------------------------
*/

const client = redis.createClient({

  url: 'redis://127.0.0.1:6379'
});

/*
|--------------------------------------------------------------------------
| Redis Connection Events
|--------------------------------------------------------------------------
*/

client.on('connect', () => {

  console.log('Redis Connected Successfully');
});

client.on('error', (error) => {

  console.log(
    'Redis Client Error:',
    error.message
  );
});

/*
|--------------------------------------------------------------------------
| Connect Redis
|--------------------------------------------------------------------------
*/

async function connectRedis() {

  if (!client.isOpen) {

    await client.connect();
  }
}

/*
|--------------------------------------------------------------------------
| Get Activities (Cache Aside Pattern)
|--------------------------------------------------------------------------
*/

async function getActivities() {

  await connectRedis();

  const cacheKey = 'popular_activities';

  /*
  |--------------------------------------------------------------------------
  | Step 1: Check Redis Cache
  |--------------------------------------------------------------------------
  */

  const cachedData = await client.get(cacheKey);

  /*
  |--------------------------------------------------------------------------
  | Cache Hit
  |--------------------------------------------------------------------------
  */

  if (cachedData) {

    console.log(
      'Cache Hit! Returning data from Redis...'
    );

    return JSON.parse(cachedData);
  }

  /*
  |--------------------------------------------------------------------------
  | Cache Miss
  |--------------------------------------------------------------------------
  */

  console.log(
    'Cache Miss. Fetching from Database...'
  );

  /*
  |--------------------------------------------------------------------------
  | Simulated Database Data
  |--------------------------------------------------------------------------
  */

  const dbData = [
    {
      id: 1,
      name: 'Mountain Hiking'
    },
    {
      id: 2,
      name: 'Tech Networking'
    },
    {
      id: 3,
      name: 'Startup Meetup'
    },
    {
      id: 4,
      name: 'Gaming Tournament'
    }
  ];

  /*
  |--------------------------------------------------------------------------
  | Store Data In Redis With TTL
  |--------------------------------------------------------------------------
  */

  await client.setEx(
    cacheKey,
    60,
    JSON.stringify(dbData)
  );

  console.log(
    'Data Cached Successfully'
  );

  return dbData;
}

/*
|--------------------------------------------------------------------------
| Update Activity & Invalidate Cache
|--------------------------------------------------------------------------
*/

async function updateActivity(id, newName) {

  await connectRedis();

  /*
  |--------------------------------------------------------------------------
  | Simulated Database Update
  |--------------------------------------------------------------------------
  */

  console.log(
    `Updated activity ${id} to ${newName}`
  );

  /*
  |--------------------------------------------------------------------------
  | Clear Redis Cache
  |--------------------------------------------------------------------------
  */

  await client.del('popular_activities');

  console.log(
    'Cache invalidated for popular_activities'
  );
}

/*
|--------------------------------------------------------------------------
| Execute Test Functions
|--------------------------------------------------------------------------
*/

async function runCacheDemo() {

  console.log('\nFIRST REQUEST\n');

  const firstResponse =
    await getActivities();

  console.log(firstResponse);

  console.log('\nSECOND REQUEST\n');

  const secondResponse =
    await getActivities();

  console.log(secondResponse);

  console.log('\nUPDATING DATA\n');

  await updateActivity(
    1,
    'Advanced Mountain Hiking'
  );

  console.log('\nTHIRD REQUEST AFTER INVALIDATION\n');

  const thirdResponse =
    await getActivities();

  console.log(thirdResponse);
}

/*
|--------------------------------------------------------------------------
| Run Application
|--------------------------------------------------------------------------
*/

runCacheDemo();