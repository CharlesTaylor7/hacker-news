/**
  * @returns {Promise<IDBDatabase>}
  */
export async function getDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("hn", 4);
    request.addEventListener("error", (e) => reject(e));
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("upgradeneeded", event => {
      const db = request.result;
      if (event.oldVersion < 1) {
        const table = db.createObjectStore("items", { keyPath: "id" });
        table.createIndex('watch, time', ['watch']);
      }
      if (event.oldVersion < 2) {
        const table = request.transaction.objectStore("items");
        table.deleteIndex('watch, time');
        table.createIndex('watch', ['watch']);
      }

      if (event.oldVersion < 4) {
        const table = request.transaction.objectStore("items");
        table.deleteIndex('watch');
        table.createIndex('watch', 'watch');
      }
    });
  });
}

/**
  * @param {IDBDatabase} db 
  * @param {number} itemId 
  * @returns {Promise<Item|null>}
  */
export async function getItemById(db, itemId) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(['items']).objectStore('items').get(itemId);
    request.addEventListener("error", event => reject(event));
    request.addEventListener("success", () => resolve(request.result));
  });
}

/**
  * @param {IDBDatabase} db 
  * @param {number} since - utc time
  * @returns {Promise<Item|null>}
  */
export async function getWatchedItems(db, since = 0) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(['items']).objectStore('items').get(itemId);
    request.addEventListener("error", event => reject(event));
    request.addEventListener("success", () => resolve(request.result));
  });
}
