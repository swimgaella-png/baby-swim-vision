/**
 * Baby Swim Vision - Server-side & Persistence Cache Sanitizer
 * 
 * Inspects all persistent database and cache files in `.server_data/`,
 * checks for corruption or malformed JSON, and automatically repairs them.
 */

const fs = require('fs');
const path = require('path');

const SERVER_DATA_DIR = path.join(__dirname, '..', '.server_data');

const DEFAULT_ARRAY_FILES = [
  'articles.json',
  'exercises.json',
  'clubs.json',
  'orders.json',
  'demo_videos.json',
  'deleted_articles.json',
  'deleted_club_ids.json',
  'deleted_demo_videos.json',
  'vip_redemptions.json',
  'club_submission_notifications.json',
  'processed_stripe_events.json'
];

const DEFAULT_OBJECT_FILES = [
  'users.json',
  'settings.json',
  'geocoding_cache.json',
  'media_registry.json'
];

function sanitizeServerData() {
  console.log('[Sanitizer] Scanning persistent server data directory:', SERVER_DATA_DIR);

  if (!fs.existsSync(SERVER_DATA_DIR)) {
    fs.mkdirSync(SERVER_DATA_DIR, { recursive: true });
    console.log('[Sanitizer] Created missing .server_data directory.');
  }

  let repairedCount = 0;
  let healthyCount = 0;

  // Process Array-based files
  for (const file of DEFAULT_ARRAY_FILES) {
    const fullPath = path.join(SERVER_DATA_DIR, file);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify([], null, 2), 'utf-8');
      console.log(`[Sanitizer] Initialized missing array file: ${file}`);
      repairedCount++;
      continue;
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf-8').trim();
      if (!content) {
        fs.writeFileSync(fullPath, JSON.stringify([], null, 2), 'utf-8');
        console.warn(`[Sanitizer] Repaired empty file: ${file}`);
        repairedCount++;
        continue;
      }
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) {
        console.warn(`[Sanitizer] File ${file} contained non-array data. Repaired.`);
        fs.writeFileSync(fullPath, JSON.stringify([], null, 2), 'utf-8');
        repairedCount++;
      } else {
        healthyCount++;
      }
    } catch (e) {
      console.error(`[Sanitizer] JSON syntax error in ${file}. Resetting to empty array:`, e.message);
      fs.writeFileSync(fullPath, JSON.stringify([], null, 2), 'utf-8');
      repairedCount++;
    }
  }

  // Process Object-based files
  for (const file of DEFAULT_OBJECT_FILES) {
    const fullPath = path.join(SERVER_DATA_DIR, file);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify({}, null, 2), 'utf-8');
      console.log(`[Sanitizer] Initialized missing object file: ${file}`);
      repairedCount++;
      continue;
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf-8').trim();
      if (!content) {
        fs.writeFileSync(fullPath, JSON.stringify({}, null, 2), 'utf-8');
        console.warn(`[Sanitizer] Repaired empty object file: ${file}`);
        repairedCount++;
        continue;
      }
      const parsed = JSON.parse(content);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        console.warn(`[Sanitizer] File ${file} contained non-object data. Repaired.`);
        fs.writeFileSync(fullPath, JSON.stringify({}, null, 2), 'utf-8');
        repairedCount++;
      } else {
        healthyCount++;
      }
    } catch (e) {
      console.error(`[Sanitizer] JSON syntax error in ${file}. Resetting to empty object:`, e.message);
      fs.writeFileSync(fullPath, JSON.stringify({}, null, 2), 'utf-8');
      repairedCount++;
    }
  }

  console.log(`[Sanitizer] Completed. Healthy files: ${healthyCount}, Repaired/Initialized: ${repairedCount}.`);
}

sanitizeServerData();
