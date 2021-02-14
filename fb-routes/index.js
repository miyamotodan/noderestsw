"use strict";
// Node Modules
const express = require("../node_modules/express");
const router = express.Router();
const swaggerJsdoc = require('../node_modules/swagger-jsdoc');
const swaggerUi = require('../node_modules/swagger-ui-express');
var emailValidator = require("email-validator");

// App Modules
const User = require("../fb-models/User");
const Message = require("../fb-models/Message");

//check se una stringa è vuota
const isEmpty = (value) => {
  return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

//check se una stringa è un intero
const isInteger = (value) => {
  const quantity = parseInt(value);
  return !isNaN(quantity)
}

//verifica se un oggetto è vuoto
const isEmptyObj = (object) => {
  if ('object' !== typeof object) {
    throw new Error('Object must be specified.');
  }

  if (null === object) {
    return true;
  }

  if ('undefined' !== Object.keys) {
    // Using ECMAScript 5 feature.
    return (0 === Object.keys(object).length);
  } else {
    // Using legacy compatibility mode.
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users example service
 */

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Users example service",
      version: "1.0.0",
      description:
        "Servizio di esempio che censisce utenti",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "DDP",
        url: "https://example.com",
        email: "fake@mail.it"
      }
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1"
      }
    ]
  },
  apis: ["./fb-models/User.js", "./fb-models/Message.js", "./fb-routes/index.js"]
};
const specs = swaggerJsdoc(options);
router.use("/docs", swaggerUi.serve);
router.get("/docs", swaggerUi.setup(specs, { explorer: true }));

/**
 * @swagger
 * path:
 *  /users/:
 *    post:
 *      summary: Crea un nuovo utente
 *      tags: [user]
 *      requestBody:
 *        required: true
 *        content:
 *          application/x-www-form-urlencoded:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A confirmation message
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Message'
 */
router.post("/users", (req, res, next) => {
  console.log("recieved:", req.body);
  const u = new User(req.body.id, req.body.email, req.body.name, req.body.surname, req.body.nick, req.body.age);
  u.timestamp = Date.now();

  // controlli di validità di dati immessi
  if (isEmpty(u.id)) {
    const m = new Message('error', 'id non impostato correttamente', u.timestamp);
    // ritorna il messaggio
    res.json(m);
  } else
    if (!emailValidator.validate(u.email)) {
      const m = new Message('error', 'email non valida', u.timestamp);
      // ritorna il messaggio
      res.json(m);
    } else
      if (!isInteger(u.age) || Number(u.age) < 1 || Number(u.age) > 120) {
        const m = new Message('error', 'età non valida', u.timestamp);
        // ritorna il messaggio
        res.json(m);
      } else {
        console.log('Adding new user: ', u);
        // add new item to db
        db.users.save(u);
        const m = new Message('message', 'utente salvato', u.timestamp);
        // ritorna il messaggio
        res.json(m);
      }
});

/**
 * @swagger
 * path:
 *  /users/:
 *    get:
 *      summary: ritorna tutti gli utenti
 *      tags: [user]
 *      responses:
 *        "200":
 *          description: Una lista di utenti
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 */
router.get("/users", (req, res, next) => {
  console.log('Returning users');
  res.json(global.db.users.find());
});



/**
 * @swagger
 * path:
 *  /users/{id}:
 *    get:
 *      summary: ritorna l'utente con l'id specificato
 *      tags: [user]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: identificativo dell'utente da ritornare
 *      responses:
 *        "200":
 *          description: utente 
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get("/users/:id", (req, res) => {
  const itemId = req.params.id;
  const item = global.db.users.find({ id: itemId });

  if (!isEmptyObj(item)) {
    console.log('Returning user: ' + itemId);
    res.json(item);
  } else {
    res.json(new Message('error', 'User id non trovato', Date.now()))
  }

});


/**
 * @swagger
 * path:
 *  /users/:
 *    delete:
 *      summary: elimina tutti gli utenti
 *      tags: [user]
 *      responses:
 *        "200":
 *          description: messaggio
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Message'
 */
router.delete("/users", (req, res, next) => {

  const timestamp = Date.now();
  const tot = global.db.users.count();

  console.log('Deleting all users: ' + tot);

  //preparo il messaggio
  const m = new Message('message', 'users deleted :' + tot, timestamp);

  //elimino tutti gli elementi
  const l = global.db.users.find();
  l.forEach(element => {
    global.db.users.remove({ _id: element._id }, true);
  });

  // return updated list
  res.json(m);
});

// catch 404 and forward to error handler
router.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error Handler
router.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

module.exports = router;