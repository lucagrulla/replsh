const repl = require('repl');
const fs = require('fs');

__replsh__requireFile = (absolutePathFileName, replServer) => {
    const ext = /\.js/gi;
    const absolutePathFileNameNoExt = `${absolutePathFileName.replace(ext, '')}`
    let mod = require(absolutePathFileNameNoExt)

    for (var func in mod) {
        replServer.context[func] = mod[func];
    }
}

__replsh__loadContext = (conf, rootDir, replServer) => {
    //TODO manage random inputs
    for (let file of conf.files) {
        let fullPath = `${rootDir}/${file}`
        __replsh__requireFile(fullPath, replServer)
    }

    for (let dir of conf.dirs) {
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error("could not read directory.")
                process.exit(1);
            }
            files.forEach(file => {
                __replsh__requireFile(`${rootDir}/${dir}/${file}`, replServer);
            });
        });
    }
};

const confName = '.replsh';
__replsh__start = (rootDir) => {

    // console.log("child process root Dir:", rootDir)
    let conf = {}
    if (fs.existsSync(confName)) {
        try {
            conf = JSON.parse(fs.readFileSync(confName).toString());
        } catch (error) {
            console.error("REPLSH couldn't load .replsh file", error)
            process.exit(1)
        }
    }

    let replServer = repl.start({
        input: process.stdin,
        output: process.stdout,
        prompt:'',
        ignoreUndefined: true
    })

    // process.stdin.on('data', (d) => {
    //     console.log("received>", d.toString())
    // })

    __replsh__loadContext(conf, rootDir, replServer)

    // process.stdout.on('data', (d) => {
    //     console.log(d.toString())
    // })
    // process.on('message', (m) => {
    //     if (m == 'reload') {
    //         console.log("reloading context")
    //         replServer.resetContext()
    //         __replsh__loadContext(conf, rootDir, replServer)
    //     }
    //     if (m == 'printContext') {
    //         console.log(replServer.context)
    //     }
    // });

    replServer.on('exit', process.exit);
}

module.exports = { __replsh__start: __replsh__start }

const rootDir = process.cwd()
__replsh__start(rootDir)