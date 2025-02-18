import { openDB } from "idb";

const DB_NAME = "AudioDB";
const STORE_NAME = "recordings";

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
};

export const saveRecording = async (data: RecordingType) => {
  const db = await initDB();
  const id = await db.add(STORE_NAME, {
    name: data.name,
    blob: data.blob,
    timestamp: Date.now(),
  });
  return id;
};

export const getRecordings = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteRecording = async (id: number) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
