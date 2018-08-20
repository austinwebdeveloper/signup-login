# Signup Login Module
The signup-login module is a Node.js based loopback script and it provides a fastest way to create user signup and login services with authentication.


# Pre-requisites
Node.js , and the platform-specific tools needed to compile native NPM modules (which you may already have):

### Installation

To install the signup-login module, simply run the following command within your app's directory:

```sh
npm i  signup-login-module --save
```

### Development

```sh
var loopback = require("signup-login-module");
```
Port Configuration:

```sh

var port = new loopback.port(port address);

```
Example:
```sh
var port = new loopback.port(8080);
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

##### Note: No need to declare email, username and password in schema but you need to add required field for username if you want it as required field.

Example Model Configuration:

```sh
var modelConfig = {

   "name": "driver",
   "properties": {
   
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

#### Run following in your terminal to start the APP:
 
```sh 
 npm start
``` 
 
Verify the deployment by navigating to your server address in your preferred browser.

```sh
http://host:port/explorer
``` 
Example:
```sh
http://localhost:8001/explorer
``` 

#Licence
MIT
 
 
