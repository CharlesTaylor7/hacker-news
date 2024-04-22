/**
  * @returns {Promise<IDBDatabase>}
  */
export async function getDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("hn", 1);
    request.addEventListener("error", (e) => reject(e));
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("upgradeneeded", () => {
      const db = request.result;
      const table = db.createObjectStore("items", { keyPath: "id" });
      table.createIndex('watch, time', ['watch', 'time']);
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
