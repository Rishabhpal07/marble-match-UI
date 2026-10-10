const databaseName = "marblematch-local-samples";
const databaseVersion = 1;
const storeName = "samples";

export type UserMarbleSample = {
  id: string;
  filename: string;
  contentType: string;
  createdAt: number;
  image: Blob;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("This browser does not support saving local samples."));
      return;
    }

    const request = window.indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Unable to open local sample storage."));
    request.onblocked = () =>
      reject(new Error("Local sample storage is blocked by another tab."));
  });
}

function createSampleRecord(file: File): UserMarbleSample {
  return {
    id: crypto.randomUUID(),
    filename: file.name,
    contentType: file.type,
    createdAt: Date.now(),
    image: file,
  };
}

export async function saveUserMarbleSample(
  file: File
): Promise<UserMarbleSample> {
  const database = await openDatabase();
  const sample = createSampleRecord(file);

  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      transaction.objectStore(storeName).add(sample);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(
          transaction.error ?? new Error("Unable to save this marble sample.")
        );
      transaction.onabort = () =>
        reject(
          transaction.error ?? new Error("Saving this marble sample was aborted.")
        );
    });

    return sample;
  } finally {
    database.close();
  }
}

export async function getUserMarbleSamples(): Promise<UserMarbleSample[]> {
  const database = await openDatabase();

  try {
    return await new Promise<UserMarbleSample[]>((resolve, reject) => {
      const transaction = database.transaction(storeName, "readonly");
      const request = transaction.objectStore(storeName).getAll();

      request.onsuccess = () =>
        resolve(
          (request.result as UserMarbleSample[]).sort(
            (first, second) => second.createdAt - first.createdAt
          )
        );
      request.onerror = () =>
        reject(
          request.error ?? new Error("Unable to load your saved marble samples.")
        );
    });
  } finally {
    database.close();
  }
}
