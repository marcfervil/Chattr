import React from "react";
import { Component, setState} from 'react';
import {
	AppRegistry,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	SafeAreaView,
	Alert,
	TextInput,
	Animated,
  } from 'react-native';
  import {WavGraph} from './Chattr';
  import AudioStream from './AudioStream';

import ChattrUI from "./UI/ChattrUI";

class Login extends Component {

	state = {
		username: "Marc",
		password: "password",
		invalidLogin: false
	}

	constructor(props){
		super(props);
		ChattrUI.initBoxSet()
		this.wavGraph = React.createRef();
		AudioStream.stream((data)=>{
			if(this.wavGraph.current!=null){
				this.wavGraph.current.graph(data, true);
			}
		});
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
		}
		AudioStream.stop()
	}

	

	username = (event)=>{
		this.setState({username: event.nativeEvent.text});
	}
	password = (event)=>{
		this.setState({password: event.nativeEvent.text});
	} 

   	render() {
		ChattrUI.resetBox()
		return (
			
				<View style={styles.container}>
			
					<View style={[ChattrUI.box(), styles.coolBox]}>
						<Text style={{fontSize: 40,marginTop: 100}}>Chattr</Text>
						{ 
						this.state.invalidLogin &&
						<Text style={{color: "red", marginTop: 10}}>Invalid username and/or password</Text>
						}
						<TextInput opacity={0.5} style={[ styles.input]} placeholder="username" value={this.state.username} onChange={this.username}/>
						<TextInput opacity={0.5}  style={[ styles.input]} placeholder="password" value={this.state.password} onChange={this.password}/>
						<View style={styles.wavView}>
							<View style={{height: 200}} >
								<WavGraph show={this.state.recording} ref={this.wavGraph}/>
							</View>
						</View>
					</View>
					<TouchableOpacity style={ChattrUI.box()} onPress={this.login} >
						<Text style={[ {fontSize: 20}]}>Login</Text>
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
	coolBox:{
		flex:1, 
		justifyContent: "flex-start",
		flexDirection: 'column'
	},
	wavView:{
		
		//backgroundColor:"red",
		flex: 1
	},
	input:{
		padding: 5,
		//borderBottomColor: '#00000040',
		borderBottomColor: '#000000',
		margin: 12,
		width: "70%",
		
		padding: 10,
		borderBottomWidth: 1,
	}
})
  

export default Login