const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const notesRouter = require('./routes/notes');

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests (frontend and backend can run on different ports)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Routes
app.use('/notes', notesRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
