const repl = require('repl');
const { fork } = require('child_process');
const readline = require('readline');
const net = require('net');

replStart = (handler) => {
    let child = fork('./src/subRepl', [],
        { stdio: ['pipe', 'pipe', 'inherit', 'ipc'] })
    child.stdout.on('data', handler)
    return child
}
__nodesh__start = () => {
    let child = null;
    const rl = readline.createInterface({
        input: process.stdin,
        prompt: '>> ',
        output: process.stdout
    });

    let childDataHandler = (d) => {
        console.log(d.toString())
        rl.prompt()
    }

    rl.on('line', (line) => {
        switch (line) {
            case "reload":
                console.log("reload context");
                child.kill()
                child = replStart(pchildDataHandler)
                rl.prompt()
                break;
            default:
                child.stdin.write(line + '\n');//new line is necessary   
        }
    }).on('end', () => {
        console.log("end");
        chid.stdin.end()
    });
    rl.prompt()

    child = replStart(childDataHandler)
}

module.exports = { __nodesh__start: __nodesh__start }
