import React from "react";
import { Component, setState} from 'react';

import {
	AppRegistry,
	StyleSheet,
	TouchableOpacity,
	Text,
	View,
	Button,
	Alert,
	TextInput,
	NativeModules,
	Animated,
  } from 'react-native';
  import { Buffer } from 'buffer';
  import AudioStream from './AudioStream';



class Record extends Component {

	state = {
		recording: false
	}
	chunks=[]
	
	getNetwork = () => {
		return this.props.route.params.network;
	}

	record =  async () => {
		//console.log(NativeModules.AudioStream.stream)
	
		this.setState({recording: !this.state.recording});
		if(!this.state.recording){
			this.chunks = []
			//let ff= "few"
			//console.log("recording")
			let res = await this.getNetwork().request("me" )
			Alert.alert(JSON.stringify(res));
			/*
			AudioStream.stream((data)=>{

				this.chunks.push(data)
				
			})*/
		}else{
			console.log("stopped recording")
			//AudioStream.stop()
			//AudioStream.AudioStream.playFromNetwork(this.chunks);
			this.chunks = []
			//
		
		}

		
	}

	username = (event)=>{
		this.setState({username: event.nativeEvent.text});
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput style={styles.input} placeholder="username" value={this.state.username} onChange={this.username}/>
				<TouchableOpacity style={styles.button} onPress={this.record} >
					<Text>Record</Text>
				</TouchableOpacity>
			</View>
		);
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

export default Record