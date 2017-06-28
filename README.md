## Github Hook Router
A configurable and easy to use Github event handling server.

## Installation
`git clone https://github.com/drdrsh/github-hook-router`
then navigate to the path and run
`npm install`
`node index.js`

## Configuration
To configure the server, rename `config.dist.js` to `config.js` and modify it to suit your needs. 

## Adding handlers

To add handlers you simply create a javascript file under the `repos` directory with the following structure
```
"use strict";
module.exports = {
	"id":  "username/repo-name",
	"secret": "github-webhook-secret",
	"register": github => {
	    //Register all your events as follows
		github.on(
		    "push:repo-name(without_username):refs/heads/master", 
		    function (event, repo, ref, data) => {
	            //Do stuff with the event	    
		    }
	    );
	    //For more details about the callback and its parameters, please go to https://github.com/nlf/node-github-hook
	}
};
```
The server will automatically restart  if it detects changes to the `repos` directory.

## License
MIT