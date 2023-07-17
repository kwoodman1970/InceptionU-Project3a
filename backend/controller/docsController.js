const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// const __filename = path.resolve();
// const __dirname = path.dirname(__filename);

const createDoc = (req, res) => {
  // Define the storage location and filename for uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'backend/public/documents/');
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname),
      );
    },
  });

  // Create an instance of Multer with the storage options
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  });

  // Use the upload middleware to handle file upload
  upload.single('attachment')(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send(err.message);
    }

    // Resize the uploaded document using Sharp
    const documentPath = path.join(
      __dirname,
      '../public/documents',
      req.file.filename,
    );
    const outputDocumentPath = path.join(
      __dirname,
      '../public/documents/pets',
      req.file.filename,
    );

    res.status(200).send({
      url: documentPath,
      name: req.file.filename,
    });
  });
};

const createProfileDoc = (req, res) => {
  console.log(__dirname);
  // Define the storage location and filename for uploaded files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'backend/public/documents/');
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname),
      );
    },
  });

  // Create an instance of Multer with the storage options
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
  });

  // Use the upload middleware to handle file upload
  upload.single('document')(req, res, function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }

    // Resize the uploaded document using Sharp
    const documentPath = path.join(
      __dirname,
      '../public/documents',
      req.file.filename,
    );
    const outputDocumentPath = path.join(
      __dirname,
      '../public/documents/profiles',
      req.file.filename,
    );

    sharp(documentPath)
      .resize(800, 600)
      .toFile(outputDocumentPath, (err, info) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        // Send the URL of the resized document to the client
        fs.unlink(documentPath, (err) => {
          if (err) {
            return res.status(500).send(err.message);
          }
        });
        res.status(200).send({
          url: `/public/documents/profiles/${req.file.filename}`,
          name: req.file.filename,
        });
      });
  });
};

const deleteDoc = (req, res) => {
  fs.unlink(
    path.join(__dirname, '../public/documents/pets', req.params.documentName),
    (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send({ message: 'Document deleted' });
    },
  );
};
const deleteProfileDoc = (req, res) => {
  fs.unlink(
    path.join(__dirname, '../public/documents/profiles', req.params.documentName),
    (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.status(200).send({ message: 'Document deleted' });
    },
  );
};

const editDoc = (req, res) => {
  const targetDocument = req.params.documentName;
  // Define the storage location and filename for edited files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/documents/');
    },
    filename: function (req, file, cb) {
      cb(null, targetDocument);
    },
  });

  // Create an instance of Multer with the storage options
  const upload = multer({ storage: storage });

  // Use the upload middleware to handle file upload
  upload.single('document')(req, res, function (err) {
    if (err) {
      return res.status(500).send(err.message);
    }

    // Resize the uploaded document using Sharp
    const documentPath = path.join(
      __dirname,
      '../public/documents',
      req.file.filename,
    );
    const outputDocumentPath = path.join(
      __dirname,
      '../public/documents/pets',
      req.file.filename,
    );

    sharp(documentPath)
      .resize(800, 600)
      .toFile(outputDocumentPath, (err, info) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        // Send the URL of the resized document to the client
        fs.unlink(documentPath, (err) => {
          if (err) {
            return res.status(500).send(err.message);
          }
        });
        res
          .status(200)
          .send({ url: `/public/documents/pets/${req.file.filename}` });
      });
  });
};

module.exports = {
  createDoc,
  createProfileDoc,
  editDoc,
  deleteDoc,
  deleteProfileDoc,
};
