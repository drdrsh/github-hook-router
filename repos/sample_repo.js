"use strict";

//Allows us to call shell scripts
const exec = require('child_process').exec;

//The following parameters need to be set for each file
const id = "username/repo-name";
const secret = "github-webhook-secret";
const map = {
	'push:repo-name(without_username):refs/heads/master': onPushToMaster
};

function onPushToMaster(event, repo, ref, data) {
	
	/*
		Do stuff on event
		
	*/
	exec("ls");
}

//This callback will be called by the core upon server kick off
function register(github) {
	for(const idx in map) {
		github.on(idx, map[idx]);
		console.log(`Registered event ${idx}`);
	}
}

//Each file needs to export this object
module.exports = {
	"id": id,
	"secret": secret,
	"register": register
};

