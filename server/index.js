const express = require('express');
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const { Readable } = require('stream');

const app = express();
const port = 8000;
app.use(express.json({limit: "1gb"}))


var client = null;
var db = null;
let chattrs;
let users;
let bucket;

async function init(){
	const uri =
  	"mongodb://localhost:27017/?maxPoolSize=20&w=majority";
	
	client = new MongoClient(uri);
	await client.connect();
	db = client.db("Chattr");
	chattrs = db.collection('chattrs');
	users = db.collection('users');
	bucket = new mongodb.GridFSBucket(db);
}

var validator = async function (req, res, next) {
	if(req.url!="/login"){
		let auth = {id: req.body.auth}
		//let collection = db.collection('users');
		let user = await users.findOne(auth);
		if(user){
			req.user = user
			next()
		}else{
			res.send({"error": "Invalid credentials"})
		}
	}else{
		next()
	}
}
  
app.use(validator)
init();


async function getUser(username){
	
	let user = await users.findOne({username});
	return user;
}



//for debugging
app.post('/me', (req, res) => {
	res.send(req.user)
});



app.post('/login', async (req, res) => {
	
	let collection = db.collection('users');
	let id = getId(20);
	let auth = {
		username: req.body.username,
		password: req.body.password
	};
	let user = await collection.findOne(auth);
	if(user){
		await collection.findOneAndUpdate(auth, {"$set": {id}});
		res.send({id, friends:user.friends});
	}else{
		res.send({"error": "Invalid credentials"})
	}

});



app.post('/chattr', async (req, res) => {
	let to = await getUser(req.body.to);
	if(to){
		let date = Date.now()
		let from = req.user.username
		let to = req.body.to;

		let fileName = `${from}-${to}${getId(5)}.pcm`

		await audioStream(req.body.data).pipe(bucket.openUploadStream(fileName)).on("finish",()=>{
			console.log("uploaded", fileName);
		}).on('error', function(error) {
			console.log("ERROR!", error);
		})

		let chattr = {
			"from": from,
			"to": to,
			"fileName": fileName,
			"type": "chattr",
			"date": date
		}
		await chattrs.insertOne(chattr);

		let friendUpdate =  {
			"$set": {
				[`friends.${req.body.to}`]: date
			}
		}
		await users.findOneAndUpdate({"id":req.user.id}, friendUpdate);
		res.send({"status":"success"});
	}else{
		res.send({"error": "This user does not exist!"})
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`)
});


//UTIL
function audioStream(audioChunks){
	async function * generate() {
		for(chunk of audioChunks){
			/*
			for(float32 of chunk){
				yield float32;
			}*/
			yield chunk;
		}
		
	}
	return Readable.from(generate());
}


function getId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
   }
   return result;
}
