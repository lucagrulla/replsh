const repl = require('repl');
const { fork } = require('child_process');
const readline = require('readline');
const net = require('net');

replStart = (outStream) => {
    let child = fork('./src/subRepl', [],
        { stdio: ['pipe', 'pipe', 'inherit', 'ipc'] })
    // child.stdout.pipe(outStream);
    return child
}
__nodesh__start = () => {
    let child = null;
    const rl = readline.createInterface({
        input: process.stdin,
        prompt: '>> ',
        output: process.stdout
    });

    rl.on('line', (line) => {
        switch (line) {
            case "reload":
                console.log("reload context")
                break;
            default:
                child.stdin.write(line + '\n');//new line is necessary   
        }
    }).on('end', () => {
        console.log("end");
        chid.stdin.end()
    });
    rl.prompt()
    child = replStart(process.stdout)

    child.stdout.on('data', (d) => {
        console.log(d.toString())
        rl.prompt()
    })
}

module.exports = { __nodesh__start: __nodesh__start }
