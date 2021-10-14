const express = require('express');
const { MongoClient } = require("mongodb");
const app = express();
const port = 8000;
app.use(express.json())

var client = null;
var db = null;
async function init(){
	const uri =
  	"mongodb://localhost:27017/?maxPoolSize=20&w=majority";
	// Create a new MongoClient
	client = new MongoClient(uri);
	await client.connect();
	db = client.db("Chattr");

	//let collection = db.collection('users');
//	await collection.insertOne({"username": "Marc", "password": "123123"});
}

init();

app.get('/', (req, res) => {
	res.send('Hello World!')
});

function getId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

app.post('/login', async (req, res) => {
	
	let collection = db.collection('users');
	let id = getId(10);
	let auth = {
		username: req.body.username,
		password: req.body.password
	};
	let user = await collection.findOne(auth);
	if(user){
		await collection.findOneAndUpdate(auth, {"$set": {id}}, {upersert: true});
		res.send({id});
	}else{
		res.send({"error": "Invalid credentials"})
	}

});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`)
});