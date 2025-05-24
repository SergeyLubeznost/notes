import * as SQLite from 'expo-sqlite';

// Открываем базу данных с помощью нового синхронного метода
const db = SQLite.openDatabaseSync('notes.db');

export const initDatabase = async () => {
  try {
    // Используем execAsync для выполнения SQL
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        createdAt TEXT DEFAULT (datetime('now','localtime'))
      );
    `);
    console.log('Database initialized');
  } catch (error) {
    console.log('Error initializing DB', error);
  }
};

export default db;