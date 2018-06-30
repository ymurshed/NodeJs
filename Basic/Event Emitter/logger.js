
const EventEmitter = require('events');
const url = 'http://mylogger.io/log';

class Logger extends EventEmitter {
    log(message) {
        // Send an http request
        console.log(message);

        // Riase an event
        this.emit('messageLogged', {id: 1, url: 'https://'});        
    }
}

module.exports = Logger;
