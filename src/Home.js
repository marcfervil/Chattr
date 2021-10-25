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
	RefreshControl,
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
		friends: {},
		refreshing:false
	}
	
	constructor(props){
		super(props)
		this.state.friends = this.getNetwork().userData.friends
	}

	getNetwork = () => {
		return this.props.route.params.network;
	}

	openConvo = async (friend) => {
		let convo = await this.getNetwork().convo(friend)

		this.props.navigation.navigate('Convo', { network: this.getNetwork(), friend, convo });
	
	}

	onRefresh = async () => {
		this.setState({refreshing: true});

		let friends = await this.getNetwork().userData.friends;
		
		//this.state.friends = friends
		this.setState({friends, refreshing: false});

	}


	Conversations = ()=>{
	
		for(let i=0;i<30;i++){
			this.state.friends[getName(6)]=getName(20)
		}
		//Alert.alert(JSON.stringify(this.state.friends))
		let friends = Object.entries(this.state.friends);
		let refresher = <RefreshControl  refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>;
		return (
			<ScrollView style={[styles.scrollView,  {backgroundColor: global.getNextColor()}]}
				refreshControl={refresher}>
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
			<View style={[styles.container, {backgroundColor: global.getNextColor()}]}>
				<this.Conversations/>
			</View>
		);
	}


}

  

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flex: 1
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
		fontSize: 20,
		//fontFamily: "Itim",
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
	scrollView:{
		//backgroundColor: "red",
		//flex:1
	}
})

export default Home