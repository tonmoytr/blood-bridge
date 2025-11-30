
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let MONGODB_URI = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (match && match[1]) {
    MONGODB_URI = match[1].trim();
    // Remove quotes if present
    if (MONGODB_URI.startsWith('"') && MONGODB_URI.endsWith('"')) {
      MONGODB_URI = MONGODB_URI.slice(1, -1);
    }
  }
} catch (err) {
  console.error('Error reading .env.local:', err);
}

if (!MONGODB_URI) {
  console.error('Could not find MONGODB_URI in .env.local');
  process.exit(1);
}

// Define Schema
const ChatThreadSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seekerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastMessageAt: { type: Date, default: Date.now },
  unreadCount: {
    donor: { type: Number, default: 0 },
    seeker: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' }
}, { timestamps: true });

const ChatThread = mongoose.models.ChatThread || mongoose.model('ChatThread', ChatThreadSchema);

async function inspectThreads() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const threads = await ChatThread.find({}).lean();
    console.log(`Found ${threads.length} total threads in database:`);
    
    threads.forEach((t, i) => {
      console.log(`\nThread ${i + 1}:`);
      console.log(`ID: ${t._id}`);
      console.log(`Request ID: ${t.requestId}`);
      console.log(`Donor ID: ${t.donorId} (Type: ${typeof t.donorId})`);
      console.log(`Seeker ID: ${t.seekerId} (Type: ${typeof t.seekerId})`);
      console.log(`Status: ${t.status}`);
    });

    // Check specifically for the user mentioned
    const userId = "6929d43a68f829d6a4fb5211"; // The donor ID from logs
    const seekerId = "692a8166f97b13d6f87bc5be"; // The seeker ID from URL

    console.log(`\nChecking for Donor ID: ${userId}`);
    const donorThreads = await ChatThread.find({ donorId: new mongoose.Types.ObjectId(userId) }).lean();
    console.log(`Found ${donorThreads.length} threads matching donorId (ObjectId)`);

    // Check if there are any threads where donorId matches as string but not ObjectId (shouldn't happen with Mongoose but good to check)
    // Actually Mongoose casts automatically in queries usually, but let's see.

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

inspectThreads();
