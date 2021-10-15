

import { NativeModules, NativeEventEmitter } from 'react-native';
const { AudioStream } = NativeModules;
//export default AudioStream;


module.exports = {
    emitter: new NativeEventEmitter(AudioStream),
	stop(){
		AudioStream.stop()
	},
	AudioStream,
	play(){
		AudioStream.play()
	},
	playFromNetwork(){
		AudioStream.playFromNetwork()
	},
    stream(callback)
    {
        this.emitter.addListener(
            'stream',
            data => callback( data)
        );

        AudioStream.stream(callback)
    },
}
