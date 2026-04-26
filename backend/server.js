const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));

app.get('/', (req, res) => {
  res.send('Premium Salon API is running...');
});

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    // Try primary connection
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/salon');
    console.log('MongoDB connected');
    
    // ONE-TIME FORCE WIPE AND SEED TO FIX DUPLICATES
    const Service = require('./models/Service');
    await Service.deleteMany({});
    await Service.insertMany([
      {
        name: 'Haircut',
        description: 'A premium haircut tailored specifically to your facial structure and lifestyle.',
        price: 25,
        duration: 30,
        category: 'Hair',
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Beard Trim',
        description: 'Precision beard sculpting including hot towel treatment and straight razor lining.',
        price: 15,
        duration: 20,
        category: 'Beard',
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop'
      },
      {
        name: 'Hair Styling',
        description: 'Professional styling using luxury products providing that perfect finish.',
        price: 30,
        duration: 45,
        category: 'Styling',
        image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop'
      }
    ]);
    console.log('Database wiped and seeded exactly 3 times.');
  } catch (err) {
    console.error('\n❌ STRICT ERROR: Database connection failed.');
    console.error('If you are using a local DB, make sure MongoDB is running.');
    console.error('If you are using MongoDB Atlas, check your network access (IP Whitelist) or password.');
    console.error('Error details:', err.message, '\n');
    process.exit(1);
  }
};

const seedDatabase = async (Service) => {
  console.log('Seeding services...');
  // MUST pass {} to strictly wipe the entire collection in Mongoose
  await Service.deleteMany({});
  await Service.insertMany([
    {
      name: 'Haircut',
      description: 'A premium haircut tailored specifically to your facial structure and lifestyle.',
      price: 25,
      duration: 30,
      category: 'Hair',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Beard Trim',
      description: 'Precision beard sculpting including hot towel treatment and straight razor lining.',
      price: 15,
      duration: 20,
      category: 'Beard',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop'
    },
    {
      name: 'Hair Styling',
      description: 'Professional styling using luxury products providing that perfect finish.',
      price: 30,
      duration: 45,
      category: 'Styling',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop'
    }
  ]);
  console.log('Seeding complete.');
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(console.error);
