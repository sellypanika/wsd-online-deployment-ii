import { sql } from "../database/database.js";

const recentMessages = async function getRecentMessages(limit = 5) {
  return await sql`
    SELECT sender, message FROM messages
    ORDER BY id DESC
    LIMIT ${limit}
  `;
};

const addMessage = async function addMessage(sender, message) {
  await sql`
    INSERT INTO messages (sender, message)
    VALUES (${sender}, ${message})
  `;
};

export { addMessage, recentMessages };