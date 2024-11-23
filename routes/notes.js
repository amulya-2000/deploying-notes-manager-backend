const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all notes with optional filters
router.get('/', (req, res) => {
  const { category, search } = req.query;

  let sql = 'SELECT * FROM notes WHERE 1=1';
  let params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    sql += ' AND title LIKE ?';
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY created_at DESC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching notes' });
    }
    res.json(rows);
  });
});

// POST a new note
router.post('/', (req, res) => {
  const { title, description, category } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const sql = 'INSERT INTO notes (title, description, category) VALUES (?, ?, ?)';
  const params = [title, description, category || 'Others'];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating note' });
    }
    res.status(201).json({ id: this.lastID, title, description, category: category || 'Others' });
  });
});

// PUT (update) an existing note
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const sql = 'UPDATE notes SET title = ?, description = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  const params = [title, description, category || 'Others', id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating note' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ id, title, description, category: category || 'Others' });
  });
});

// DELETE a note
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM notes WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting note' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(204).send(); // No content
  });
});

module.exports = router;
