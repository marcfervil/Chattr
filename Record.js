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

	record =  () => {
		//console.log(NativeModules.AudioStream.stream)
	
		this.setState({recording: !this.state.recording});
		if(!this.state.recording){
			this.chunks = []
			//let ff= "few"
			//console.log("recording")
			AudioStream.stream((data)=>{
				//console.log(ff);
				//chunk = Buffer.from(data, 'base64');
				/*
				this.chunks.push(data)
				if(this.chunks.length==500){
					AudioStream.play();
					AudioStream.stop(); 
					
					for(let chunk of this.chunks){
						AudioStream.AudioStream.playFromNetwork(chunk);
					}
					
				}*/
				this.chunks.push(data)
				
			})
		}else{
			console.log("stopped recording")
			AudioStream.stop()
			AudioStream.AudioStream.playFromNetwork(this.chunks);
			this.chunks = []
			//
		
		}

		
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity  style={styles.button} onPress={this.record} >
					<Text>Record</Text>
				</TouchableOpacity>
			</View>
		);
	}

	/*
	turnOn = () => {
		NativeModules.Bulb.turnOn({"message":"hi"});
	  }
	render() {
	 return (
		<View style={styles.container}>
		 <Text style={styles.welcome}>Welcome to Light App!!</Text>
		 <Button
			onPress={this.turnOn}
		   title="Turn ON "
		   color="#FF6347" />
		 </View>
	 );
	}*/

}

/*
const styles = StyleSheet.create({
	container: {
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: '#F5FCFF',
	},
	});*/
  

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