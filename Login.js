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

  //import SVGPath from "art/modes/svg/path";
  //import { Tween } from "art/morph/path";


class Login extends Component {

	state = {
		username: "Marc",
		password: "123123",
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

			this.props.navigation.navigate('Record', { network: this.getNetwork() });
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
			
				<Text>Chattr </Text>
				{ 
					this.state.invalidLogin &&
					<Text style={{color: "red", marginTop: 10}}>Invalid username and/or password</Text>
	   			}
				<TextInput style={styles.input} placeholder="username" value={this.state.username} onChange={this.username}/>
				<TextInput style={styles.input} placeholder="password" value={this.state.password} onChange={this.password}/>
				<TouchableOpacity style={styles.button} onPress={this.login} >
					<Text>Login</Text>
				</TouchableOpacity>
				
				
			</View>
		)
	}
}

  

const styles = StyleSheet.create({
container: {
	marginTop: 100,
	flex: 1,
	
	alignItems: 'center',
	width: "100%",
	
},
input: {
	//height: 40,
	borderBottomColor: '#000000',
	margin: 12,
	width: "70%",
	
	padding: 10,
	borderBottomWidth: 1,
	},
button: {
	alignItems: 'center',
	backgroundColor: '#DDDDDD',
	padding: 10,
	marginBottom: 10
}
})
  

export default Login