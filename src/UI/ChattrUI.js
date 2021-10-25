

import { StyleSheet } from 'react-native';

//StyleSheet.create(
module.exports = {
    
	initBoxSet(){
		this.index = 0;
		this.boxSet = []

	},
	box(){
		
		if(!this.boxSet[this.index]){
			
			this.boxSet[this.index] = this.getBox();
		}
		return this.boxSet[this.index++];
	},
	resetBox(){
		this.index = 0
	},
	getBox(){
		let box = {
			width: "100%",
			height: 80,
			flexDirection: 'row', 
			justifyContent: 'center', 
			alignItems: 'center',
			textAlignVertical: 'center',
			backgroundColor: global.getNextColor(),
			fontSize: 20,
			padding: 5
		}
		return box
	},
	text:{
		fontSize: 20
	}
}