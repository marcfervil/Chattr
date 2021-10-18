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


  function rand(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  Array.prototype.avg = function() {
    return this.reduce(function(a,b){return a+b;})/this.length;
};

class WavGraph extends Component {

	wavLengths = []
	waveDensity = 60;
	backgroundColor = global.getNextColor();

	constructor(props){
		super(props);
	
		for(let i=0; i< this.waveDensity; i++){
			this.wavLengths.push("100%")

		}
	}

	graph = (data) => {
		for(let i=0; i< data.length; i+=this.waveDensity){
			let samples = []
			for(let j = i; j<i+(data.length/this.waveDensity); j++){
				samples.push(data[j])
			}
			this.wavLengths[i/this.waveDensity]=(Math.abs(samples.avg())*1000 )+"%"
		}

		this.setState({})
	}


	render() {
		//if (!this.props.show) return null;
		
		return (
			<View style={[styles.wavGraph, {backgroundColor: this.backgroundColor }]}>
			
				{
					this.wavLengths.map((height, index) => (
						
						<View key={index} style={[styles.wavGraphLine, {height} ]}/>
					))
				}
			
			</View>
		)
	}
}

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
				this.wavGraph.current.graph(data);
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
	//ref={this.textInput}

	render() {
		return (
			<View style={styles.container}>
				<TextInput style={styles.input} placeholder="username" value={this.state.username} onChange={this.username}/>
				<TouchableOpacity style={styles.button} onPress={this.record} >
					<Text>Record</Text>
				</TouchableOpacity>
				<WavGraph show={this.state.recording} ref={this.wavGraph}/>
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
	wavGraph: {
		width: "100%",
		height: 100,
		
		flexDirection:'row'
		
	},
	wavGraphLine: {
		width: 5,
		//height: "50%",
		marginHorizontal: 1,
		backgroundColor: "black",
		alignSelf: 'flex-end',
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