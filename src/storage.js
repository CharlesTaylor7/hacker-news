/**
 * @returns {Promise<IDBDatabase>}
 */
export async function getDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("hn-v2", 1);
    request.addEventListener("error", (e) => reject(e));
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("upgradeneeded", (event) => {
      const db = request.result;
      if (event.oldVersion < 1) {
        const table = db.createObjectStore("items", { keyPath: "id" });
        table.createIndex("watch", "watch");
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
    const request = db
      .transaction(["items"], "readonly")
      .objectStore("items")
      .get(itemId);
    request.addEventListener("error", (event) => reject(event));
    request.addEventListener("success", () => resolve(request.result));
  });
}

/**
 * @param {IDBDatabase} db
 * @returns {Promise<Array<Item>|null>}
 */
export async function getWatchedItems(db) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(["items"], "readonly")
      .objectStore("items")
      .index("watch")
      .getAll(IDBKeyRange.only(1));
    request.addEventListener("error", (event) => reject(event));
    request.addEventListener("success", () => resolve(request.result));
  });
}

/**
 * @param {IDBDatabase} db
 * @param {Item} item
 * @returns {Promise<Array<Item>|null>}
 */
export async function saveItem(db, item) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(["items"], "readwrite")
      .objectStore("items")
      .put(item);
    request.addEventListener("error", (event) => reject(event));
    request.addEventListener("success", () => resolve(request.result));
  });
}
