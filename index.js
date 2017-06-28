"use strict";
let github = null;

const config = require("./config");
const githubhook = require('githubhook');
const fs = require("fs");
const path = require("path");


const repoPath = path.join(__dirname, "repos");
//We watch the repos path for changes and restart the server if any change is detected
fs.watchFile(repoPath, () => {
        console.log("Handlers change detected, restarting...");
        restartServer();
});


function restartServer() {
        const lookup = {};
        if(github) {
			github.stop(() => {
				console.log("Server stopped");
				github = null;
				restartServer();
			});
			return;
        }

        fs.readdirSync(repoPath).filter(f => f.substr(-3) == ".js").forEach(file => {
			const fullpath = path.resolve("./repos/" + file);
			const handler = require(fullpath);
			lookup[handler.id] = handler;
			console.log(`Loaded handler for repo ${handler.id}`);
        });

        github = new githubhook({
			'port': config.port,
			'path': config.path,
			'secret': function(req, payload, next){
				if(!payload || !payload.repository || !payload.repository.full_name) {
					return next("Invalid payload");
				}
				var n = payload.repository.full_name;
				if( !(n in lookup) ) {
					return next("Repo not found");
				}
				return next(null, lookup[n].secret);
			}
        });

        github.listen();
        for(const idx in lookup) {
			if(typeof lookup[idx].register === "function") {
				lookup[idx].register(github);
			}
        }
}

restartServer();