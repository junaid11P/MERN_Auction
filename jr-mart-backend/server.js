const jsonServer = require('json-server');
const multer = require('multer');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
    static: './public'
});

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

server.use(middlewares);

// Handle product creation with image upload
server.post('/products', upload.single('image'), (req, res, next) => {
    if (req.file) {
        req.body.imageFilename = `/images/${req.file.filename}`;
    }
    next();
});

// Handle product update with image upload
server.patch('/products/:id', upload.single('image'), (req, res, next) => {
    if (req.file) {
        req.body.imageFilename = `/images/${req.file.filename}`;
    }
    next();
});

server.use(router);
server.listen(3001, () => {
    console.log('JSON Server is running on port 3001');
});