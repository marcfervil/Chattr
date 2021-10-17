const express = require('express');
const { MongoClient,ObjectId } = require("mongodb");
const mongodb = require("mongodb");
const { Readable, Writable } = require('stream');


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

app.post('/play', async (req, res) => {
	let msg = await chattrs.findOne({_id: ObjectId(req.body.id)});
	if(msg){
		if(msg.to == req.user.username){
			let frames = []
			let frame = []
			bucket.openDownloadStreamByName(msg.fileName).pipe(new audioStreamReader((chunk)=>{

				for(let i=0; i <chunk.length ; i+=4){

					frame.push(chunk.readFloatBE(i))
					if(frame.length == 4410){
						frames.push(frame)
						frame = []
						
					}
					
				}

				//readFloatBE
				//console.log("chunk", cc)
			}).on("error",(e)=>{
				console.log("error", e)
			}).on("finish",()=>{
				res.send({"frames":frames})
				//console.log("done")
			}))
			//res.send({"e":"e"});
		}else{
			res.send({"error": "You don't have permission to open this Chattr!"})
		}
	}else{
		res.send({"error": "This Chattr does not exist!"})
	}
});

app.post('/convo', async (req, res) => {
	let msgs = await chattrs.find({from:req.user.username, to:req.body.with}).toArray();
	//console.log(msgs.toArray())
	res.send({msgs})
});

app.post('/chattr', async (req, res) => {
	let to = await getUser(req.body.to);
	if(to){
		let date = Date.now()
		let from = req.user.username
		let to = req.body.to;

		let fileName = `${from}-${to}${getId(5)}.pcm`

		await audioStreamWriter(req.body.data).pipe(bucket.openUploadStream(fileName)).on("finish",()=>{
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
function audioStreamWriter(audioChunks){
	async function * generate() {
		for(chunk of audioChunks){
			let floatChunk = Buffer.alloc(4410 * 4)
			let num = 0
		
			for(float32 of chunk){
				floatChunk.writeFloatBE(float32,num)
				num += 4;
			}
			yield floatChunk;
		}
	}
	let stream = Readable.from(generate())
	
	return stream;
}

class audioStreamReader extends Writable {
	constructor(writeCb) {
		super(null);
		this.writeCb = writeCb
		
	}
  
	_write(chunk, encoding, next) {
		//super._write(chunk, encoding, callback)
	  this.writeCb(chunk);
	  next()
	}

	_
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
