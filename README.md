# Signup Login Module
The signup-login module is a Node.js based loopback script and it provides a fastest way to create user signup and login services with authentication.


# Pre-requisites
Node.js , and the platform-specific tools needed to compile native NPM modules (which you may already have):

### Installation

To install the signup-login module, simply run the following command within your app's directory:

```sh
npm i  signup-login --save
```

### Development

```sh
var loopback = require("signup-login");
```

Database Configuration:

```sh
var dbConfig = {"name":"","options":{
	
	"host": "",
    "port": ,
    "url": "",
    "database": "",
    "password": "",
    "user": "",
    "connector": "" // connector name ex. mongodb or mysql
}};

var database = new loopback.datasource(dbConfig);
```

Example Model Configuration:

```sh
var modelConfig = {

   "name": "driver",
   "properties": {
    "email": {
      "type": "string",
      "required": true
    },
    "firstname": {
      "type": "string"
    },
    "lastname": {
      "type": "string"
    },
    "username": {
      "type": "string",
      "required": true
    },
    "password": {
      "type": "string",
      "required": true
    },
    "phone": {
      "type": "number"
    }
  }
};	
 var model = new loopback.model(modelConfig); 
```
#### Include following code in your index file:
```sh 
 var appStart = loopback.app;
 appStart.start();
```
Verify the deployment by navigating to your server address in your preferred browser.

```sh
http://host:port/explorer
``` 
Example:
```sh
http://localhost:57304/explorer
``` 

#Licence
MIT
 
 
