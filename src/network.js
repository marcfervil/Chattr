import { Alert } from "react-native";


class Network {
	url = "http://localhost:8000";
	//url = "http://10.0.2.2:8000";
	userId = null;

	async request(endpoint, data={}){
		if(this.userId)data["auth"] = this.userId
		let result = await fetch(`${this.url}/${endpoint}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		
	
		result = await result.json();
		if(result.error && endpoint!="login"){
			Alert.alert(result.error)
			return null;
		}
		return result;
	}

	async login(username, password){
		return await this.request("login", {username, password});
	}

	async convo(username){
		return await this.request("convo", {with: username});
	}

	async play(id){
		return await this.request("play", {id});
	}

	async chattr(to, data, wavform){
		return await this.request("chattr", {to, data, wavform});
	}

}

export default Network