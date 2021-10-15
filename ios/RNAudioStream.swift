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
  let playerNode = AVAudioPlayerNode()
  
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
  var unlocked : Bool = false
  
  //_ options: NSDictionary
  @objc func stream( _ error: @escaping RCTResponseSenderBlock) -> Void {

    let inputNode = chatr.AudioStream.audioEngine.inputNode
    let bus = 0
   
    
    inputNode.installTap(onBus: bus, bufferSize: 2048, format: inputNode.inputFormat(forBus: bus)) {
      (buffer: AVAudioPCMBuffer!, time: AVAudioTime!) -> Void in
 
      /*
      let nsBuffer : NSMutableArray = NSMutableArray()
      for i in 0..<2048 {
        nsBuffer.add(NSNumber(value: (buffer.floatChannelData?.pointee[i])!))
      }
      self.sendEvent(withName: "stream", body: nsBuffer)*/
      if self.unlocked{
        self.playFromNetwork(audio: buffer)
      }
     
      //
    }
    let engine = AudioStream.audioEngine
    engine.attach(playerNode)
    
    engine.connect(playerNode, to: engine.mainMixerNode, format: AudioStream.audioEngine.inputNode.outputFormat(forBus: 0))
    
    AudioStream.audioEngine.prepare()
   // play()
    try! AudioStream.audioEngine.start()
  
    playerNode.play()
    self.unlocked = true
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
     // print("play")
     // self.play()
    }
    
  }
  
  func convertInt16ToFloat32(_ data: [Float32]) -> AVAudioPCMBuffer {
   
    let audioBuffer = AVAudioPCMBuffer(pcmFormat: AudioStream.audioEngine.inputNode.outputFormat(forBus: 0), frameCapacity: 2048)!
    
    // Each real data of the array input is reduced to the interval [-1, 1]
    for i in 0..<data.count {
    
      audioBuffer.floatChannelData?.pointee[i] = data[i]
    }
    
    audioBuffer.frameLength = audioBuffer.frameCapacity
    return audioBuffer
  }
  
 
  
  @objc func playFromNetwork(_ data: NSArray) {
    // data: linear data PCM-Int16, sample rate 8000, 160 bytes
    var items = [Float32]()
    // playback converted data on AVAudioPlayerNode
    for item in data{
      items.append(item as! Float32)
    }
  
    let audio = convertInt16ToFloat32(items)
    self.playerNode.scheduleBuffer(audio, completionHandler: {

    })

  }
  
  @objc func playFromNetwork( audio: AVAudioPCMBuffer) {
   
   // let audio = convertInt16ToFloat32(items)
   // print("tryna play")
    self.playerNode.scheduleBuffer(audio, completionHandler: {
      //print("played yourself")
    })
    
  }
  
  @objc func play(){

    let engine = AudioStream.audioEngine
     // AVAudioEngine()
      //AudioStream.audioEngine
      
      
      engine.attach(playerNode)

    engine.connect(playerNode, to: engine.mainMixerNode, format: AudioStream.audioEngine.inputNode.outputFormat(forBus: 0))
    
      playerNode.play()
    self.unlocked = true
  }
  
  //@objc func play( _ error: @escaping RCTResponseSenderBlock) -> Void {
  
  @objc func stop(){
    // AudioStream.audioEngine.inputNode.removeTap(onBus: 0)
    AudioStream.audioEngine.stop()
    //self.stopObserving()
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
