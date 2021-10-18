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

Array.prototype.abs = function() {
    return this.map((a)=>Math.abs(a));
};

Array.prototype.max = function() {
	return  this.reduce(function (p, v) {
		return ( p > v ? p : v );
	  });
  };

class WavGraph extends Component {

	wavLengths = []
	waveDensity = 150;
	backgroundColor = global.getNextColor();

	constructor(props){
		super(props);

		for(let i=0; i< this.waveDensity; i++){
			this.wavLengths.push("100%")

		}
	}

	graph = (data, debug=false) => {
		
		//looks best for live
		if(!debug){
			this.waveDensity = 20;
			for(let i=0; i< data.length; i+=this.waveDensity){
				let samples = []
				for(let j = i; j<i+(data.length/this.waveDensity); j++){
					samples.push(data[j])
				}
				this.wavLengths[i/this.waveDensity]=(Math.abs(samples.avg())*1000 )+"%"
				if(debug){
					//console.log(this.wavLengths[i/this.waveDensity]);
				}
			}
		}else{
		
			this.waveDensity = 85//150;
			
			let f = 0; 
			let totalAvg = data.abs().max();
			let frac = Math.floor((data.length/this.waveDensity))
			for(let i=0; i < data.length; i+=frac){
				let samples = []
				for(let j = i; j<i+frac; j++){
					samples.push(data[j])
				}
				//console.log(i/this.waveDensity)
				
			
				this.wavLengths[i/frac]=(samples.abs().avg()/totalAvg)*100 +"%"
				
				//f+=1;
		}
	}
		//console.log(f);
		this.setState({})
	}


	render() {
		//if (!this.props.show) return null;
		let topGraphStyle= {alignItems: 'flex-end'}
		let bottomGraphStyle= {alignItems: 'flex-start'}
		return (
			<View style={[styles.wavGraph, {backgroundColor: this.backgroundColor }]}>
				<View style={[topGraphStyle,styles.wavGraphLineContainer ]}>
					{
						this.wavLengths.map((height, index) => (
							
							<View key={"top"+index} style={[styles.wavGraphLine, {height} ]}/>
						))
					}
				</View>
				<View style={[bottomGraphStyle,styles.wavGraphLineContainer ]}>
					{
						this.wavLengths.map((height, index) => (
							
							<View key={"bottom"+index} style={[styles.wavGraphLine, {height} ]}/>
						))
					}
				</View>
			
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
			let entireRecording = this.chunks.reduce((a,b)=>a.concat(b));
			this.wavGraph.current.graph(entireRecording,true);
			
			//console.log(entireRecording)
			
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
		
		
	},
	wavGraphLineContainer: {
		flexDirection:'row',
		
		width: "100%",
		height:"50%"
	},
	wavGraphLine: {
		width: 3,
		//height: "50%",
		marginHorizontal: 1,
		backgroundColor: "black",
		//alignSelf: 'flex-end',
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