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
  import ChattrUI from "./UI/ChattrUI";


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

	styles = []
	styleKey = 0

	constructor(props) {
		super(props);
		this.wavGraph = React.createRef();
		ChattrUI.initBoxSet();
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
				<TouchableOpacity style={ChattrUI.box()} onPress={this.play} >
					<Text style={styles.text}>Play</Text>
				 </TouchableOpacity>
				 <View style={{flex:1 }}></View>
				<TouchableOpacity style={ChattrUI.box()} onPress={this.send} >
					<Text style={styles.text}>Send</Text>
				</TouchableOpacity>
			</View>
		);
	}
	

	

	render() {
		ChattrUI.resetBox()
		let boxColor = ChattrUI.box().backgroundColor;
		return (
			<View style={[styles.container, {backgroundColor:boxColor}]}>
				<TextInput style={ChattrUI.box()} placeholder="username" value={this.state.username} onChange={this.username}/>
				
				<View style={[styles.wavGraphStyle,{backgroundColor: global.getNextColor()}]}>
					<WavGraph show={this.state.recording} ref={this.wavGraph}/>
				</View>
				<TouchableOpacity style={ChattrUI.box()} onPress={this.record} >
					<Text style={styles.text}>{(this.state.recording)? "Stop Recording" : "Record"}</Text>
				</TouchableOpacity>
				
				<this.RecordedControls show={this.state.recorded} />
				
			</View>
		);
	}

 
}

  

 styles = StyleSheet.create({
	container: {
		//marginTop: 100,
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
		
		width: "100%",
		height: 100,
		//flex: 1
	},
	
	text:{
		fontSize: 20
	}
})

export default Record