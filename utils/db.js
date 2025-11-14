// utils/db.js
import * as SQLite from 'expo-sqlite';

// Open database
const db = SQLite.openDatabaseSync('socialapp.db');

export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message_text TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users (id),
        FOREIGN KEY (receiver_id) REFERENCES users (id)
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.log('Database error:', error);
  }
};

export const registerUser = async (email, username, password, avatar = null) => {
  try {
    const result = db.runSync(
      'INSERT INTO users (email, username, password, avatar) VALUES (?, ?, ?, ?)',
      [email, username, password, avatar]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (emailOrUsername, password) => {
  try {
    const result = db.getAllSync(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?',
      [emailOrUsername, emailOrUsername, password]
    );
    
    if (result.length > 0) {
      return result[0];
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const result = db.getAllSync(
      'SELECT id, username, email, avatar FROM users'
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, avatar) => {
  try {
    const result = db.runSync(
      'UPDATE users SET avatar = ? WHERE id = ?',
      [avatar, userId]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const result = db.getAllSync(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw error;
  }
};

// Save message to database
export const saveMessage = async (senderId, receiverId, messageText) => {
  try {
    const result = db.runSync(
      'INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)',
      [senderId, receiverId, messageText]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Get messages between two users
export const getMessages = async (userId1, userId2) => {
  try {
    const result = db.getAllSync(
      `SELECT m.*, u.username as sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE (m.sender_id = ? AND m.receiver_id = ?) 
          OR (m.sender_id = ? AND m.receiver_id = ?) 
       ORDER BY m.timestamp ASC`,
      [userId1, userId2, userId2, userId1]
    );
    return result;
  } catch (error) {
    throw error;
  }
};

// Get recent conversations for a user
export const getConversations = async (userId) => {
  try {
    const result = db.getAllSync(
      `SELECT 
        u.id as user_id,
        u.username,
        u.avatar,
        m.message_text as last_message,
        m.timestamp
       FROM users u
       INNER JOIN (
         SELECT 
           CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as other_user_id,
           MAX(timestamp) as max_timestamp
         FROM messages 
         WHERE sender_id = ? OR receiver_id = ?
         GROUP BY other_user_id
       ) recent ON u.id = recent.other_user_id
       INNER JOIN messages m ON m.timestamp = recent.max_timestamp
       ORDER BY m.timestamp DESC`,
      [userId, userId, userId]
    );
    return result;
  } catch (error) {
    throw error;
  }
};