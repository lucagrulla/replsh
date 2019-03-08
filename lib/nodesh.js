#!/usr/bin/env node
var program = require('commander');
const { fork } = require('child_process');
const EventEmitter = require('events');
const fs = require('fs');


class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();
const path = `${__dirname}/repl`

__nodesh__start = (eventEmitter) => {
    let child = fork(path)

    child.on('message', (m) => {
        if (m == "reload") {
            child.kill()
            eventEmitter.emit('reload')
        }
    })
}

myEmitter.on('reload', () => {
    __nodesh__start(myEmitter);
});

program
    .version('v0.0.1')
    .command('init')
    .action(() => {
        fs.copyFileSync(`${process.cwd()}/templates/.nodesh_template.json`, `${process.cwd()}/.nodesh`,)
        console.log(".nodesh file created");
        process.exit(0);
    })

program.parse(process.argv);
__nodesh__start(myEmitter)


