/**
 * @returns {Promise<IDBDatabase>}
 */
export async function getDatabase() {
  return new Promise((resolve, reject) => { 
    const openOrCreateDB = window.indexedDB.open('hn', 1);

    openOrCreateDB.addEventListener('error', e => reject(e));

    openOrCreateDB.addEventListener('success', () => {
      console.log('Successfully opened DB');
      resolve(openOrCreateDB.result);
    });

    openOrCreateDB.addEventListener('upgradeneeded', init => {
      console.log('Upgrade needed', init);
      const db = init.target.result;

      db.onerror = () => {
        console.error('Error loading database.');
      };

      const table = db.createObjectStore('watch', { keyPath: 'id' });
      table.createIndex('time', 'time', { unique: false });

      resolve(db);
    });
  });
}
