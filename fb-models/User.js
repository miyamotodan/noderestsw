"use strict";

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - id
 *          - email
 *        properties:
 *          id:
 *            type: string
 *            description: id univoco dell'utente
 *          email:
 *            type: string
 *            format: email
 *            description: indirizzo mail
 *          age:
 *            type: integer
 *            minimum: 1
 *            maximum: 120
 *            description: età dell'utente
 *          name:
 *            type: string
 *            desciption: nome dell'utente
 *          surname:
 *            type: string
 *            format: cognome del'utente
 *          nick:
 *            type: string
 *            format: soprannome del'utente
 *        example:
 *           id: 23
 *           email: fake@email.com
 *           age: 53
 *           name: daniele
 *           surname: del pinto 
 *           nick: miya
 */
class User {
  constructor(id, email, name, surname, nick, age) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.nick = nick;
    this.age = age
  }
}

module.exports = User;