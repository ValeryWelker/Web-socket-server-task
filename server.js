const fs = require('fs');
const WebSocket = require('ws');


const keywords = {
    'cat': ['https://s3.amazonaws.com/images.pdpics.com/images/388-cat-paws-closeup.jpg', 
            'https://s3.amazonaws.com/images.pdpics.com/images/389-cat-sitting-on-chair.jpg', 
            'https://s3.amazonaws.com/images.pdpics.com/images/388-cat-paws-closeup.jpg'],
    'dog': ['https://s3.amazonaws.com/images.pdpics.com/images/28-cute-puppy.jpg', 
            'https://s3.amazonaws.com/images.pdpics.com/images/13-boy-holding-puppy.jpg', 
            'https://s3.amazonaws.com/images.pdpics.com/images/27-cute-black-puppy-2.jpg'],
    'bird': ['https://s3.amazonaws.com/images.pdpics.com/images/585-macaw-parrot-portrait.jpg', 
            'https://s3.amazonaws.com/images.pdpics.com/images/5008-parrot-caged.jpg', 
            'https://s3.amazonaws.com/images.pdpics.com/images/2093-parrot-green.jpg'],    
  
};

let MAX_CONCURRENT_THREADS = 1; 
fs.readFile('config.txt', 'utf8', function(err, data) {
  if (!err) {
    MAX_CONCURRENT_THREADS = Number(data);
    console.log('MAX_CONCURRENT_THREADS set to', MAX_CONCURRENT_THREADS);
  } else {
    console.error('Failed to read config.txt:', err);
  }
}); 

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('Client connected');
  let threadCount = 0; 

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const urls = keywords[message];
    if (threadCount < MAX_CONCURRENT_THREADS) {
      threadCount++;

      if (urls) {
        socket.send(JSON.stringify(urls));
      } else {
        socket.send(JSON.stringify(new String('empty')));
      }

      console.log('Started stream');
    } else {
      console.log('Maximum concurrent streams reached');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log("Server started on port 8080");