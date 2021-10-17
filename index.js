import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

Array.prototype.random = function () {
	return this[Math.floor((Math.random()*this.length))];
}
global.getNextColor=function(prefix="#"){


	colors=["9B5DE5","F15BB5", "FEE440", "00BBF9", "00F5D4"]


	let newColors = colors.filter(item => item !== this.lastColor);

	let color = newColors.random()
	this.lastColor = color
	return prefix+color;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
