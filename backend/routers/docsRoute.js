// This router is for supplier to upload documents for their pets.

const express = require('express');
const router = express.Router();

const {
  createDoc,
  editDoc,
  deleteDoc,
  createProfileDoc,
  deleteProfileDoc,
} = require('../controller/docsController');

router.post('/', createDoc);
router.post('/profile', createProfileDoc);
router.put('/:docName', editDoc);
router.delete('/:docName', deleteDoc);
router.delete('/profle/:docName', deleteProfileDoc);

module.exports = router;
