/**
 * @returns {Promise<IDBDatabase>}
 */
export async function getDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("hn", 1);
    request.addEventListener("error", (e) => reject(e));
    request.addEventListener("success", () => resolve(request.result));

    request.addEventListener("upgradeneeded", () => {
      console.log("Upgrade needed");
      const db = request.result;
      const table = db.createObjectStore("watch", { keyPath: "id" });
      table.createIndex("time", "time", { unique: false });
    });
  });
}
