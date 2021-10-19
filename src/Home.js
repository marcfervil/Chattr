import React from "react";
import { Component, setState} from 'react';

import {
	AppRegistry,
	StyleSheet,
	TouchableOpacity,
	Text,
	SafeAreaView,
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



function getName(length) {
	var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength)
		);
   }
   return result;
}


class Home extends Component {

	state = {
		friends: {}
	}
	
	
	getNetwork = () => {
		return this.props.route.params.network;
	}

	openConvo = async (friend) => {
		let convo = await this.getNetwork().convo(friend)

		this.props.navigation.navigate('Convo', { network: this.getNetwork(), friend, convo });
	
	}

	Conversations = (props)=>{
		
		//colors=["9B5DE5","F15BB5", "FEE440", "00BBF9", "00F5D4"]
		
		this.state.friends = this.getNetwork().userData.friends
		for(let i=0;i<30;i++){
			this.state.friends[getName(6)]=getName(20)
		}
		let friends = Object.entries(this.state.friends);

		return (
			<ScrollView style={styles.scrollView}>
				{
					friends.map((friend, index) => (
						<TouchableOpacity
							key = {friend[1]}
							style = {[styles.convo, {backgroundColor: global.getNextColor()}]}
						
							onPress = {()=>this.openConvo(friend[0])}>
							<Text style={styles.text}>{friend[0]}</Text>
						</TouchableOpacity>
					))
            	}
			</ScrollView>
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<this.Conversations/>
			</View>
		);
	}


}

  

const styles = StyleSheet.create({
	container: {
		
		
		
	
		width: "100%",
		
	},
	convo: {
		width: "100%",
		height: 80,
		flexDirection: 'row', 
		justifyContent: 'center', 
		alignItems: 'center',
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

export default Home