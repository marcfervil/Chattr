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
	RefreshControl,
	ScrollView,
	TextInput,
	NativeModules,
	Animated,
  } from 'react-native';
  import AudioStream from './AudioStream';
  import { Buffer } from 'buffer';

  import {Chattr} from './Chattr';


class Convo extends Component {

	state = {
		chattrs: this.props.route.params.convo.msgs,
		refreshing: false
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

	componentDidMount() {
		this.focusListener = this.props.navigation.addListener("focus", async () => {    
			let convo = await this.getNetwork().convo(this.getFriend());
			this.setState({chattrs: convo.msgs});
		});
	}
	
	componentWillUnmount() {
		this.props.navigation.removeListener(this.focusListener)
	}
	
	onRefresh = async () => {
		//Alert.alert("dd")
		//console.log("reee")
		//this.setState({refreshing: true});
		let convo = await this.getNetwork().convo(this.getFriend());
		this.setState({chattrs: convo.msgs});
	}


	render() {
		let msgs = this.getChattrs()

		return (
			<View style={styles.container}>
				<ScrollView
					refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}>
					{
						msgs.map((chattrData) => (
							<Chattr key={chattrData._id}  view = {this} data = {chattrData}/>
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
		//flexDirection: 'column', 
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