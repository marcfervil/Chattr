
import React from "react";
import { Component, setState} from 'react';

import {

	TouchableOpacity,
	Text,
	View,
	StyleSheet,
	Alert

  } from 'react-native';
  import AudioStream from './AudioStream';
  import { Buffer } from 'buffer';


  class WavGraph extends Component {

	wavLengths = []
	waveDensity = 150;
	backgroundColor = global.getNextColor();

	constructor(props){
		super(props);
		if(!props.wavForm){
			for(let i=0; i<this.waveDensity; i++){
				this.wavLengths.push(0)
			}
		}else{
			this.graph(props.wavForm);
		}
	}

	graph = (data, live=false) => {
		
		//looks best for live, tbh not 100% why this one looks so good
		if(live){
			this.waveDensity = 20;
			for(let i=0; i< data.length; i+=this.waveDensity){
				let samples = []
				for(let j = i; j<i+(data.length/this.waveDensity); j++){
					samples.push(data[j])
				}
				this.wavLengths[i/this.waveDensity]=(Math.abs(samples.avg())*1000 )
				
			}
		}else{
		
			this.waveDensity = 110;
			this.wavLengths=[];
			let totalAvg = data.abs().max();
			let frac = Math.floor((data.length/this.waveDensity))
			for(let i=0; i < data.length; i+=frac){
				let samples = []
				for(let j = i; j<i+frac; j++){
					samples.push(data[j])
				}
				this.wavLengths[i/frac]=((samples.abs().avg()/totalAvg)*100 )+ 3 

			}
		}
		this.setState({})
	}




	render() {

		let topGraphStyle = {alignItems: 'flex-end'}
		let bottomGraphStyle = {alignItems: 'flex-start'}
		return (
			<View style={[styles.wavGraph]}>
				<View style={[topGraphStyle,styles.wavGraphLineContainer ]}>
					{
						this.wavLengths.map((height, index) => (
							<View key={"top"+index} style={[styles.wavGraphLine, {height:height+"%"} ]}/>
						))
					}
				</View>
				<View style={[bottomGraphStyle,styles.wavGraphLineContainer ]}>
					{
						this.wavLengths.map((height, index) => (
							<View key={"bottom"+index} style={[styles.wavGraphLine, {height:height+"%"} ]}/>
						))
					}
				</View>
		
			</View>
		)
	}
}


class Chattr extends Component {

	data = null

	play = async () => {
		AudioStream.stream(()=>AudioStream.stop());
		if(!this.data){
			
			this.data = await this.props.view.getNetwork().play(this.props.data._id);
			//Alert.alert("served")
		}

		AudioStream.AudioStream.playFromNetwork(this.data.frames);
	}

	render(){
		return (
		
				
		
			<TouchableOpacity
				key = {this.props.data._id}
				style = {[styles.chattr, {backgroundColor: global.getNextColor()}]}
				onPress = {()=>this.play()}>
				<WavGraph wavForm = {this.props.data.wavform}/>
			</TouchableOpacity>
			
		
		)
	}
}

const styles = StyleSheet.create({
	container: {
		//flex: 1,
		width: "100%",
		backgroundColor: "red",
		
	},
	chattr: {
		width: "100%",
		height: 100,
	//	flexDirection: 'row', 
		paddingVertical:15,
		//marginVertical: 5,
		flex:1,
		justifyContent: 'center', 
		alignItems: 'center',
		textAlignVertical: 'center',
		overflow: "hidden"
	},
	wavGraph: {
		width: "100%",
		height: "100%"
		
		//paddingTop:10,
		//paddingBottom:10,
		
	},
	wavGraphLineContainer: {
		flexDirection:'row',
		
		width: "100%",
		height:"50%"
	},
	wavGraphLine: {
		width: 2,
		//height: "50%",
		marginHorizontal: 1,
		backgroundColor: "black",
		//alignSelf: 'flex-end',
	},
});


module.exports = {
	Chattr,
	WavGraph
 }