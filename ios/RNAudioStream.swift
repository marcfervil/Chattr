//
//  RNAudioStream.swift
//  chatr
//
//  Created by Marc Fervil on 10/14/21.
//


import Foundation
import AVFoundation

@objc(AudioStream)
class AudioStream: RCTEventEmitter {
  
  static let audioEngine = AVAudioEngine()
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func supportedEvents() -> [String]! {
    return ["stream"]
  }
  
  func pcmToBase(buffer: AVAudioPCMBuffer) -> String {
    let audioBuffer = buffer.audioBufferList.pointee.mBuffers
    let data = Data(bytes: audioBuffer.mData!, count: Int(audioBuffer.mDataByteSize))
    let base64String = data.base64EncodedString(options: NSData.Base64EncodingOptions(rawValue: 0))
    return base64String
  }
  
  //_ options: NSDictionary
  @objc func stream( _ error: @escaping RCTResponseSenderBlock) -> Void {

    let inputNode = AudioStream.audioEngine.inputNode
    let bus = 0
    inputNode.installTap(onBus: bus, bufferSize: 2048, format: inputNode.inputFormat(forBus: bus)) {
      (buffer: AVAudioPCMBuffer!, time: AVAudioTime!) -> Void in
      //callback([self.pcmToBase(buffer: buffer)])
      self.sendEvent(withName: "stream", body: self.pcmToBase(buffer: buffer))
    }
    
    AudioStream.audioEngine.prepare()
    try! AudioStream.audioEngine.start()
    
  }
  
  @objc func stop(){
     AudioStream.audioEngine.inputNode.removeTap(onBus: 0)
    AudioStream.audioEngine.stop()
    self.stopObserving()
  }
  
}


/*
import Foundation
@objc(Bulb)
class Bulb: NSObject {
  @objc
  static var isOn = false
  @objc
  func turnOn(options: NSDictionary) {
    Bulb.isOn = true
    print("Bulb is now ON")
  }
}
*/
