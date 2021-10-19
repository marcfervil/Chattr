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
  import {WavGraph} from './Chattr';


  function rand(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  Array.prototype.avg = function() {
    return this.reduce(function(a,b){return a+b;})/this.length;
};

Array.prototype.abs = function() {
    return this.map((a)=>Math.abs(a));
};

Array.prototype.max = function() {
	return  this.reduce(function (p, v) {
		return ( p > v ? p : v );
	  });
  };


class Record extends Component {

	state = {
		recording: false,
		recorded: false,
		username: this.props.route.params.friend ? this.props.route.params.friend :  ""
	}
	chunks=[]
	
	constructor(props) {
		super(props);
		this.wavGraph = React.createRef();
		
	}

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
				this.wavGraph.current.graph(data, true);
				this.chunks.push(data)
				
			})
		}else{
			
			console.log("stopped recording")
			AudioStream.stop()
			this.setState({recorded: true});
			let entireRecording = this.chunks.reduce((a,b)=>a.concat(b));
			this.wavGraph.current.graph(entireRecording);
			
			//console.log(entireRecording)
			
		}

		
	}

	username = (event)=>{
		this.setState({username: event.nativeEvent.text});
	}

	play = () => {
		AudioStream.AudioStream.playFromNetwork(this.chunks);
	}

	send = async () => {
		let result = await this.getNetwork().chattr(this.state.username, this.chunks, this.wavGraph.current.wavLengths)
		if(result.status=="success"){
			Alert.alert("Chattr was sent!")
		}
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
	//ref={this.textInput}

	render() {
		return (
			<View style={styles.container}>
				<TextInput style={styles.input} placeholder="username" value={this.state.username} onChange={this.username}/>
				<TouchableOpacity style={styles.button} onPress={this.record} >
					<Text>Record</Text>
				</TouchableOpacity>
				<View style={styles.wavGraphStyle}>
					<WavGraph show={this.state.recording} ref={this.wavGraph}/>
				</View>
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
	},
	wavGraphStyle : {
		backgroundColor: global.getNextColor(),
		width: "100%",
		height: 100,
		//flex: 1
	}
})

export default Record