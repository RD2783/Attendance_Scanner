// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('attendance-v1').then(cache =>
      cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/app.js'
      ])
    )
  );
});

// Background sync
self.addEventListener('sync', event => {
  if (event.tag === 'attendance-sync') {
    event.waitUntil(syncAttendanceData());
  }
});

async function syncAttendanceData() {
  // Get unsynced records and sync to Google Sheets
  const records = await getUnsyncedRecords();
  for (const record of records) {
    try {
      await syncToGoogleSheets(record);
      await markAsSynced(record.id);
    } catch (error) {
      console.log('Sync failed, will retry');
    }
  }
}
