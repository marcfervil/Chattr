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

  import AudioStream from './AudioStream';



class Record extends Component {

	state = {
		recording: false
	}

	record =  () => {
		//console.log(NativeModules.AudioStream.stream)
		AudioStream.stream({message:"SO MUCH TIME WASTED"})
		this.setState({recording: !this.state.recording});
		if(!this.state.recording){
			console.log("recording")
		
		}else{
			console.log("not recording")

			
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