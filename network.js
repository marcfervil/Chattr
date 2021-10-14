

class Network {
	url = "http://localhost:8000";
	userId = null;

	async request(endpoint, data){

		let result = await fetch(`${this.url}/${endpoint}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	
		result = await result.json();
		return result;
	}

	async login(username, password){
		return await this.request("login", {username, password});
	}

}

export default Network