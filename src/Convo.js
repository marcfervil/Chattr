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
  import AudioStream from './AudioStream';
  import { Buffer } from 'buffer';







class Convo extends Component {

	state = {
		chattrs: this.props.route.params.convo.msgs
	}
	
	getChattrs = () => {
		return this.state.chattrs;
	}

	getNetwork = () => {
		return this.props.route.params.network;
	}

	getFriend = () => {
		return this.props.route.params.friend;
	}

	newMessage = () => {
		this.props.navigation.navigate('Record', { network: this.getNetwork(), friend: this.getFriend()});
	}



	play = async (chat) => {
		//Alert.alert(JSON.stringify(chat))
		AudioStream.stream((data2)=>{
			AudioStream.stop()

		});
		let data = await this.getNetwork().play(chat._id)

		AudioStream.AudioStream.playFromNetwork(data.frames);
		
		
	}

	componentDidMount() {

		this.focusListener = this.props.navigation.addListener("focus", async () => {    
			let convo = await this.getNetwork().convo(this.getFriend());
			this.setState({chattrs: convo.msgs});
		});
	}
	
	componentWillUnmount() {
		//if (this.navigationEventListener) {
		this.props.navigation.removeListener(this.focusListener)
	//	}
	}
	


	render() {
		let msgs = this.getChattrs()

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
				<TouchableOpacity
					
					style = {[styles.convo, {backgroundColor: global.getNextColor()}]}
				
					onPress = {()=>this.newMessage()}>
					<Text style={styles.text}>Make new message</Text>
				</TouchableOpacity>
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
		flexDirection: 'row', 
		justifyContent: 'center', 
		alignItems: 'center',
		textAlignVertical: 'center'
	},
	text:{
		fontSize: 20
	},
	input: {
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