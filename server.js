const express = require('express');
const PORT = 5000;

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
