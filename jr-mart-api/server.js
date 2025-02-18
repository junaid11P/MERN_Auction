const jsonServer = require('json-server');
const multer = require('multer');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
    static: './public'  // Add static files configuration
});

server.use(middlewares);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        let date = new Date()  // Fix: Correct Date object creation
        let imageFilename = date.getTime() + '-' + file.originalname
        req.body.imageFilename = imageFilename
        cb(null, imageFilename)
    }
});

const bodyParser = multer({ storage: storage }).any()

server.use(bodyParser);

server.post("/products", (req, res, next) => {
    let date = new Date()  // Fix: Correct Date object creation
    req.body.createdAt = date.toISOString()

    if(req.body.price) {
        req.body.price = Number(req.body.price)
    }

    let hasError = false
    let errors = {}

    if(!req.body.name || req.body.name.length < 2) {  // Add null check
        errors.name = ["The name must be at least 2 characters."]
        hasError = true
    }
    if(!req.body.category || req.body.category.length < 2) {  // Add null check
        errors.category = ["The category must be at least 2 characters."]
        hasError = true
    }
    if(!req.body.price || req.body.price <= 0) {  // Add null check
        errors.price = ["The price must be greater than 0."]
        hasError = true
    }
    if(!req.body.imageFilename || req.body.imageFilename.length === 0) {  // Add null check
        errors.imageFilename = ["The image is required."]
        hasError = true
    }
    if(req.body.description.length < 10) {
        errors.description = ["The description must be at least 10 characters."]
        hasError = true
    }
    if(hasError) {
        res.status(400).json(errors)
    }
    next();
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});