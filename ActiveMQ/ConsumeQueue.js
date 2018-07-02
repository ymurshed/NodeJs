var stompit = require('stompit');

// Queue name and message to send
var queueName = '/queue/TestQueue'
var messagetoSend = 'sending message to queue!'

var connectOptions = {
  'host': 'localhost',
  'port': 61613,
  'connectHeaders':{
    'host': '/',
    'login': 'admin',
    'passcode': 'admin',
    'heart-beat': '5000,5000'
  }
};

// This function is responsible for sending and receiving message 
stompit.connect(connectOptions, (error, client) => {
  
  if (error) {
    console.log('connect error ' + error.message);
    return;
  }
  
  // *******************************************
  // Send message to queue
  // *******************************************
  
  var sendHeaders = {
    'destination': queueName,
    'content-type': 'text/plain'
  };
  
  var frame = client.send(sendHeaders);
  frame.write(messagetoSend);
  frame.end();
  
  // *******************************************
  // Subscribe to receive message from queue
  // *******************************************
  
  var subscribeHeaders = {
    'destination': queueName,
    'ack': 'client-individual'
  };

  client.subscribe(subscribeHeaders, (error, message) => {
    
    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }
    
    message.readString('utf-8', (error, body) => {
      
      if (error) {
        console.log('read message error ' + error.message);
        return;
      }
      
      console.log('received message: ' + body);
      client.ack(message);
      
      // Disconnect after consume has finished
      client.disconnect(); // This will release the consuming
    });
  });
});