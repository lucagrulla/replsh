const repl = require('repl');
const fs = require('fs');

__replsh__requireFile = (absolutePathFileName, replServer) => {
    const ext = /\.js/gi;
    const absolutePathFileNameNoExt = `${absolutePathFileName.replace(ext, '')}`
    console.log(absolutePathFileNameNoExt)
    let mod = require(absolutePathFileNameNoExt)

    for (var func in mod) {
        replServer.context[func] = mod[func];
    }
}

__replsh__loadContext = (conf, rootDir, replServer) => {
    //TODO manage random inputs
    if (conf.files != null) {
        for (let file of conf.files) {
            let fullPath = `${rootDir}/${file}`
            __replsh__requireFile(fullPath, replServer)
        }
    }

    if (conf.dirs != null) {
        for (let dir of conf.dirs) {
            if (dir.startsWith("/")) {
                dir = dir.slice(1)
            }
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
    }
};

const confName = '.nodesh';
__replsh__start = (rootDir) => {
    console.log("child process root Dir:", rootDir)
    let conf = {}
    if (fs.existsSync(confName)) {
        try {
            conf = JSON.parse(fs.readFileSync(confName).toString());
        } catch (error) {
            console.error("ReplJS couldn't load .repljs file", error)
            process.exit(1)
        }
    }

    let replServer = repl.start({
        input: process.stdin,
        output: process.stdout,
        prompt: '>',
        ignoreUndefined: true
    })

    __replsh__loadContext(conf, rootDir, replServer)

    replServer.defineCommand('reload', () => {
        process.send('reload');
    });


    replServer.on('exit', process.exit);
}
const rootDir = process.cwd()
__replsh__start(rootDir)