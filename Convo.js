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
	ScrollView,
	TextInput,
	NativeModules,
	Animated,
  } from 'react-native';
  import { Buffer } from 'buffer';
  import AudioStream from './AudioStream';






class Convo extends Component {

	state = {
		chattrs: []
	}
	
	getChattrs = () => {
		return this.props.route.params.convo.msgs;
	}

	getNetwork = () => {
		return this.props.route.params.network;
	}

	play = (chat) => {
		Alert.alert(JSON.stringify(chat))
	}

	render() {
		let msgs = this.getChattrs()
		console.log(msgs,msgs.map)
		return (
			<View style={styles.container}>
				<ScrollView style={styles.scrollView}>
					{
						msgs.map((msg, index) => (
							<TouchableOpacity
								key = {msg._id}
								style = {[styles.convo, {backgroundColor: global.getNextColor()}]}
							
								onPress = {()=>this.play(msg)}>
								<Text style={styles.text}>wow</Text>
							</TouchableOpacity>
						))
					}
				</ScrollView>

			</View>
		);
	}


}

  

const styles = StyleSheet.create({
	container: {
		
		flex: 1,
		
	
		width: "100%",
		
	},
	convo: {
		
		
		
	
		width: "100%",
		height: 80,
		flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
		//backgroundColor:"red",
		textAlignVertical: 'center'
	},
	text:{
		fontSize: 20
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

export default Convo