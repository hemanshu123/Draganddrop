const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Models
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, unique: true, required: true },
}));

const Item = mongoose.model('Item', new mongoose.Schema({
  name: String,
  info: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['inProcess', 'completed', 'deleted'], default: 'inProcess' },
}));

// Routes

// Create or Login User
app.post('/api/users', async (req, res) => {
  const { username } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      user = new User({ username });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create Item
app.post('/api/items', async (req, res) => {
  const { name, info, userId, status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const item = new Item({ name, info, userId, status });
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Items for a User by Status
app.get('/api/items/:userId/:status', async (req, res) => {
  const { userId, status } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!['inProcess', 'completed', 'deleted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const items = await Item.find({ userId, status });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Item Status
app.put('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    if (!['inProcess', 'completed', 'deleted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedItem = await Item.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete Item
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    await Item.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
