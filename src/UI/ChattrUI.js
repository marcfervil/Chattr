

import { StyleSheet } from 'react-native';

module.exports = ()=>StyleSheet.create({
    box:  {
		width: "100%",
		height: 80,
		flexDirection: 'row', 
		justifyContent: 'center', 
		alignItems: 'center',
		textAlignVertical: 'center',
		backgroundColor: global.getNextColor(),
		fontSize: 20
	},

	text:{
		fontSize: 20
	}
});