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
		recording: false,
		recorded: false
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
			
			console.log("started recording")
			
			AudioStream.stream((data)=>{

				this.chunks.push(data)
				
			})
		}else{
			console.log("stopped recording")
			AudioStream.stop()
			this.setState({recorded: true});
		}

		
	}

	username = (event)=>{
		this.setState({username: event.nativeEvent.text});
	}

	play = (props) => {
		AudioStream.AudioStream.playFromNetwork(this.chunks);
	}

	send = (props) => {
		this.getNetwork().chattr(this.state.username, this.chunks)
	}

	RecordedControls = (props)=>{
		if (!props.show) return null;
		
	  
		return (
			<View style={styles.container}>
				<TouchableOpacity style={styles.button} onPress={this.play} >
					<Text>Play</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.button} onPress={this.send} >
					<Text>Send</Text>
				</TouchableOpacity>
			</View>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput style={styles.input} placeholder="username" value={this.state.username} onChange={this.username}/>
				<TouchableOpacity style={styles.button} onPress={this.record} >
					<Text>Record</Text>
				</TouchableOpacity>
				<this.RecordedControls show={this.state.recorded} />
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