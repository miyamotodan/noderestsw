"use strict";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Message:
 *        type: object
 *        required:
 *          - msgtype
 *          - timestamp
 *          - text
 *        properties:
 *          msgtype:
 *            type: string
 *            description: type of message 
 *          text:
 *            type: string
 *            description: text of the message
 *          timestamp:
 *            type: string
 *            description: timestamp of the message
 *        example:
 *           msgtype: error
 *           text: error in precessing request!
 *           timestamp: 47475757
 */
class Message {
  constructor(msgtype, text, timestamp) {
    this.msgtype = msgtype;
    this.text = text;
    this.timestamp = timestamp;
  }
}

module.exports = Message;