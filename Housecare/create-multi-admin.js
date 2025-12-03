// create-multi-admin.js
// Usage (PowerShell):
// $env:MONGO_URI="mongodb+srv://user:pass@host/db?options" ; node create-multi-admin.js admin@housecare.com "Admin@12345"

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function getArgs() {
  const email = process.argv[2] || 'admin@housecare.com';
  const password = process.argv[3] || 'Admin@12345';
  return { email, password };
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: MONGO_URI environment variable not found.');
    console.error('Set it in PowerShell like:');
    console.error('$env:MONGO_URI="mongodb+srv://user:pass@host/db?options"');
    process.exit(1);
  }

  const { email, password } = getArgs();
  console.log('Using email:', email);
  console.log('Using provided MONGO_URI.');

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db(); // DB from URI

    console.log('Connected to DB:', db.databaseName);

    // Candidate collections your backend might use
    const collections = [
      'superadmins', 'super_admins', 'admins', 'admin', 'users',
      'user', 'staffs', 'staff', 'accounts', 'members'
    ];

    // Build the admin doc fields (common variants)
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date();

    const adminDoc = {
      email,
      username: email.split('@')[0],
      name: 'Administrator',
      phone: '',
      // provide both hashed and plain fields to maximize compatibility
      password: password,           // plain (for very old apps, not recommended)
      passwordHash: hashed,         // alternate name
      password_digest: hashed,      // another possible name
      hash: hashed,
      createdAt: now,
      updatedAt: now,
      isAdmin: true,
      admin: true,
      role: 'superadmin',
      verified: true,
      active: true
    };

    for (const colName of collections) {
      try {
        const col = db.collection(colName);
        // Upsert by email (or username fallback)
        const filter = { email };
        const update = { $set: adminDoc, $setOnInsert: { createdAt: now } };
        const res = await col.updateOne(filter, update, { upsert: true });
        if (res.upsertedCount > 0) {
          console.log(`Inserted new admin into '${colName}' with _id: ${res.upsertedId._id}`);
        } else if (res.modifiedCount > 0) {
          console.log(`Updated existing document in '${colName}'.`);
        } else {
          console.log(`No change needed in '${colName}' (record already up-to-date).`);
        }
      } catch (e) {
        console.warn(`Skipping collection '${colName}' due to error: ${e.message}`);
      }
    }

    console.log('\nDone. Admin credentials:');
    console.log('  email:', email);
    console.log('  password:', password);
    console.log('\nIMPORTANT: After login, change password immediately and remove plain password fields from DB.');
    console.log('Also remove this script or secure it after use.');

    await client.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

main();
