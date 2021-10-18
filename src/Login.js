import React from "react";
import { Component, setState} from 'react';
import {
	AppRegistry,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	Alert,
	TextInput,
	Animated,
  } from 'react-native';

import ChattrUI from "./UI/ChattrUI";

class Login extends Component {

	state = {
		username: "Marc",
		password: "password",
		invalidLogin: false
	}

	getNetwork = () => {
		return this.props.route.params.network;
	}
  
	login = async () => {
		let loginResult = await this.getNetwork().login(this.state.username, this.state.password);
		
		if(loginResult.error){
			this.setState({invalidLogin: true});
			
		}else{
			if(!this.state.invalidLogin)this.setState({invalidLogin: false});
			this.getNetwork().userId = loginResult.id;
			this.getNetwork().userData = loginResult;
			this.props.navigation.navigate('Home', { network: this.getNetwork() });
			//this.props.navigation.popToTop();
		}
		
	}

	username = (event)=>{
		this.setState({username: event.nativeEvent.text});
	}
	password = (event)=>{
		this.setState({password: event.nativeEvent.text});
	} 

   	render() {
		return (
			<View style={styles.container}>
			
				<View style={ChattrUI().box}>
					<Text style={{fontSize: 40, fontStyle: "italic"}}>Chattr </Text>
				</View>
				
				{ 
					this.state.invalidLogin &&
					<Text style={{color: "red", marginTop: 10}}>Invalid username and/or password</Text>
	   			}
				<TextInput style={ChattrUI().box} placeholder="username" value={this.state.username} onChange={this.username}/>
				<TextInput style={ChattrUI().box} placeholder="password" value={this.state.password} onChange={this.password}/>
				<TouchableOpacity style={ChattrUI().box} onPress={this.login} >
					<Text style={ChattrUI().text}>Login</Text>
				</TouchableOpacity>
				
				
			</View>
		)
	}
}

  

const styles = StyleSheet.create({
	container: {

		flex: 1,
		
		alignItems: 'center',
		width: "100%",
		
	},

})
  

export default Login