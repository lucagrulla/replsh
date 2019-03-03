const repl = require('repl');
const { fork } = require('child_process');
const readline = require('readline');
const net = require('net');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

__replsh__start = () => {

    rl.setPrompt('>')
    rl.prompt(true)

    rl.on('line', (input) => {
        console.log(`Received: ${input}`);
        rl.prompt()
    });

    const client = net.createConnection({ path: '/tmp/replsh.sock'}, () => {
        // 'connect' listener
        console.log('connected to server!');
        client.write('world!\r\n');
    });

    const child = fork('./src/subRepl', [], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
    let replServer = repl.start({
    });

    replServer.defineCommand('reload', () => {
        child.send("reload")
    });

    replServer.defineCommand('printContext', () => {
        child.send('printContext');
    });

    replServer.on('exit', () => {
        child.kill();
        process.exit();
    });
}

// __replsh__start = () => {
//     //child could communicate purely on pipe...
//     const child = fork('./src/subRepl', [], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })

//     function myEval(_, _, _, callback) {
//         callback(null, null);
//     }

//     let replServer = repl.start({
//         eval: myEval
//     });

//     replServer.defineCommand('reload', () => {
//         child.send("reload")
//     });

//     replServer.defineCommand('printContext', () => {
//         child.send('printContext');
//     });

//     replServer.on('exit', () => {
//         child.kill();
//         process.exit();
//     });
// };

module.exports = { __replsh__start: __replsh__start }
