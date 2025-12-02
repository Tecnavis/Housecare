/**
 * create-admin-mongo.js
 *
 * Usage:
 *   MONGO_URI="mongodb://user:pass@host:27017/dbname" node create-admin-mongo.js admin@example.com StrongP@55
 *
 * If MONGO_URI is not provided, it will try to read from a .env file in the repo root (supports VITE_/REACT_/MONGO_ style names).
 *
 * The script:
 *  - connects to the DB,
 *  - enumerates collections,
 *  - searches for a likely users collection (common names),
 *  - if matching email exists: updates password hash and sets admin flags,
 *  - otherwise inserts a new admin user doc.
 *
 * Customize the 'candidateFields' and 'adminFields' section if your project uses different field names.
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const DEFAULT_EMAIL = 'admin@housecare.com';
const DEFAULT_PASSWORD = 'Admin@12345';
const SALT_ROUNDS = 10;

async function loadEnvUri() {
  // try process.env first
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  // try common env var names
  const envKeys = ['MONGO_URI','DATABASE_URL','MONGODB_URI','REACT_APP_MONGO_URI','VITE_MONGO_URI'];
  for (const k of envKeys) if (process.env[k]) return process.env[k];

  // try to read .env in repo root
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const k of envKeys) {
      const re = new RegExp(`^\\s*${k}\\s*=\\s*(.+)\\s*$`, 'm');
      const m = content.match(re);
      if (m) return m[1].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }
  }
  return null;
}

function getArgs() {
  const email = process.argv[2] || DEFAULT_EMAIL;
  const password = process.argv[3] || DEFAULT_PASSWORD;
  return { email, password };
}

async function main() {
  const { email, password } = getArgs();
  const uri = await loadEnvUri() || process.env.MONGO_URL;

  if (!uri) {
    console.error('ERROR: MONGO_URI not found. Provide via env or .env file.');
    console.error('Example: MONGO_URI="mongodb://user:pass@host:27017/db" node create-admin-mongo.js admin@you.com StrongP@55');
    process.exit(1);
  }

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(); // DB picked from URI if present
    console.log('Connected to DB:', db.databaseName);

    const collections = await db.listCollections().toArray();
    const colNames = collections.map(c => c.name);
    console.log('Collections:', colNames.join(', '));

    // Candidate collection names - modify if your app uses others
    const candidates = ['users','user','accounts','admins','members','people'];

    // find first collection present in DB from candidates, or fallback to first collection
    let usersColName = candidates.find(n => colNames.includes(n));
    if (!usersColName) {
      // try to detect collections containing user-like docs by sampling each
      for (const cname of colNames) {
        const sample = await db.collection(cname).findOne({});
        if (!sample) continue;
        // look for typical user fields
        const keys = Object.keys(sample);
        const hasEmail = keys.includes('email') || keys.includes('username') || keys.includes('userName');
        const hasPassword = keys.includes('password') || keys.includes('pwd') || keys.includes('pass');
        if (hasEmail && hasPassword) { usersColName = cname; break; }
      }
    }
    if (!usersColName && colNames.length > 0) {
      usersColName = colNames[0]; // fallback to first collection — be careful
      console.warn(`No obvious user collection found; falling back to: ${usersColName}`);
    }
    if (!usersColName) {
      console.error('No collections found in the database. Exiting.');
      process.exit(1);
    }

    console.log('Using collection:', usersColName);
    const users = db.collection(usersColName);

    // Hash the password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // Candidate query fields to check for email/username
    const emailFields = ['email','emailAddress','username','userName','login'];
    const adminFlagFields = [
      // common admin flags; the script will set these to true if present or add them
      'isAdmin','admin','role','roles','is_staff','is_superuser'
    ];

    // Try to find existing user by email across common fields
    let existing = null;
    for (const f of emailFields) {
      existing = await users.findOne({ [f]: email });
      if (existing) { console.log(`Found existing user by field '${f}'.`); break; }
    }

    if (existing) {
      // Prepare update: set password field name (common names)
      const passwordFields = ['password','pwd','pass','hash'];
      let pwFieldFound = passwordFields.find(pf => Object.keys(existing).includes(pf)) || 'password';

      const updateDoc = { $set: { [pwFieldFound]: hashed } };
      // set admin flags sensibly
      if (Object.keys(existing).includes('role')) {
        updateDoc.$set.role = 'admin';
      } else {
        updateDoc.$set.isAdmin = true;
        updateDoc.$set.admin = true;
      }
      // Also set updatedAt if exists
      if (Object.keys(existing).includes('updatedAt') || Object.keys(existing).includes('modifiedAt')) {
        updateDoc.$set.updatedAt = new Date();
      }

      const res = await users.updateOne({ _id: existing._id }, updateDoc);
      console.log('Updated existing user:', existing._id.toString(), 'modifiedCount:', res.modifiedCount);
      console.log(`Admin credentials -> email: ${email} password: ${password}`);
      console.log('IMPORTANT: change this password after logging in.');
      process.exit(0);
    } else {
      // No user found — insert a new admin doc. Use a minimal schema but set many common fields
      const now = new Date();
      const newUser = {
        email,
        password: hashed,
        createdAt: now,
        updatedAt: now,
        isAdmin: true,
        admin: true,
        role: 'admin',
        name: 'Administrator',
        verified: true
      };

      // Insert and show ID
      const insertRes = await users.insertOne(newUser);
      console.log('Inserted new admin user with _id:', insertRes.insertedId.toString());
      console.log(`Admin credentials -> email: ${email} password: ${password}`);
      console.log('IMPORTANT: change this password after logging in.');
      process.exit(0);
    }

  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
