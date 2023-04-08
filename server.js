const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');

connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const ideasRouter = require('./routes/ideas');

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RandomIdeas API' });
});

app.use('/api/ideas', ideasRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
