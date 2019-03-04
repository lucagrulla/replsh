const { fork } = require('child_process');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

__nodesh__start = (eventEmitter) => {
    let child = fork('./src/repl')

    child.on('message', (m) => {
        if (m == "reload") {
            child.kill()
            eventEmitter.emit('reload')
        }
    })
}

console.log("Nodesh v0.0.1")
myEmitter.on('reload', () => {
    __nodesh__start(myEmitter);
});
__nodesh__start(myEmitter)

