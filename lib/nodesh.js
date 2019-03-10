#!/usr/bin/env node
var program = require('commander');
const { fork } = require('child_process');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path')


class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();

const libBasePath = path.dirname(process.mainModule.filename)
let replPath = path.join(libBasePath, "repl")
process.title = "nodesh"

__nodesh__start = (eventEmitter) => {
    console.log("replPath", replPath)
    let child = fork(replPath)

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

program.command('init')
    .action(() => {
        fs.copyFileSync(`${process.cwd()}/templates/.nodesh_template.json`, `${process.cwd()}/.nodesh`)
        console.log(".nodesh file created");
        process.exit(0);
    });

program.command("start")
    .action(() => {
        console.log("Nodesh started in development environment.");
        __nodesh__start(myEmitter);
    });

program.parse(process.argv);


