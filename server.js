import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createApp } from './node_modules/json-server/lib/app.js';

const adapter = new JSONFile('server/db.json');
const db = new Low(adapter, {});
await db.read();

const app = createApp(db);

// Prepend our custom middleware to run before json-server's routes.
// In tinyhttp (used by json-server 1.x), middleware list is at app.middleware.
app.middleware.unshift({
  handler: (req, res, next) => {
    if (req.method === 'POST' && req.url.startsWith('/users')) {
      const { username } = req.body || {};
      if (username) {
        const users = db.data.users || [];
        const exists = users.some(
          (u) => u.username && u.username.toLowerCase() === username.trim().toLowerCase()
        );
        if (exists) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: `L'username "${username}" è già in uso.` }));
          return;
        }
      }
    }
    next();
  },
  type: 'mw'
});

app.listen(3001, () => {
  console.log('JSON Server Custom Middleware is running on http://localhost:3001');
});
