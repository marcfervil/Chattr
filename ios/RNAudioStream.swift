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
  
  static var audioEngine = AVAudioEngine()
  var playerNode = AVAudioPlayerNode()

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
  var first = true
  //_ options: NSDictionary
  @objc func stream( _ error: @escaping RCTResponseSenderBlock) -> Void {
    
   
    
    AudioStream.audioEngine.reset()
    playerNode.reset()
    
   // AudioStream.audioEngine.detach(playerNode)
   
    //playerNode.stop()
    AudioStream.audioEngine.stop()
    
   AudioStream.audioEngine = AVAudioEngine()
   playerNode = AVAudioPlayerNode()
    
  
    let engine = AudioStream.audioEngine
    
    let inputNode = engine.inputNode
    let bus = 0
    
   
    inputNode.installTap(onBus: bus, bufferSize: 2048, format: inputNode.inputFormat(forBus: bus)) { [self]
      (buffer: AVAudioPCMBuffer!, time: AVAudioTime!) -> Void in
      if self.unlocked && !playerNode.isPlaying{
      
      let nsBuffer : NSMutableArray = NSMutableArray()
        for i in 0..<Int(buffer.frameCapacity) {
       // nsBuffer.add(NSNumber(value: (buffer.floatChannelData?.pointee[i])!))
        nsBuffer.add(buffer.floatChannelData!.pointee[i])
      }
      self.sendEvent(withName: "stream", body: nsBuffer)
       
      // self.playFromNetwork(audio: buffer)
        
        
       // let f = NSMutableArray()
         // f.add(nsBuffer)
       // self.playFromNetwork(nsBuffer)
      }
     
      //
    }
 
   //
    
    if #available(iOS 13.0, *) {
      print(" ")
      print(" ")
      print(engine.attachedNodes)
      print(" ")
      print(" ")
    } else {
      // Fallback on earlier versions
    }
   // if first{
      engine.attach(playerNode)
      
    
      engine.connect(playerNode, to: engine.mainMixerNode, format: AudioStream.audioEngine.inputNode.outputFormat(forBus: 0))
      
    
      AudioStream.audioEngine.prepare()
    
      try! AudioStream.audioEngine.start()
      first = false
  //  }
      
      self.unlocked = true
      print("recording")
  //  }
    
    
  }
  
  func createPCMBuffer(_ data: [Float32], _ frameCount: Int = 1) -> AVAudioPCMBuffer {
   let cap = 4410
    let audioBuffer = AVAudioPCMBuffer(
      pcmFormat: AudioStream.audioEngine.inputNode.outputFormat(forBus: 0),
      frameCapacity: AVAudioFrameCount(cap)
        //AVAudioFrameCount(2048 * frameCount)
       
    )!

    
    // Each real data of the array input is reduced to the interval [-1, 1]
      //print(data.count)
    
    /*
    for i in 0..<cap {
    
      audioBuffer.floatChannelData?.pointee[i] = data[i]
    }*/
   audioBuffer.floatChannelData?.pointee.assign(from: data, count: cap)
    //audioBuffer.floatChannelData?.pointee.pointee = data[0]
    audioBuffer.frameLength = audioBuffer.frameCapacity
    return audioBuffer
  }
  
 
  
  @objc func playFromNetwork(_ data: NSArray) {
    
   // AudioStream.audioEngine.prepare()
    //try! AudioStream.audioEngine.start()
    //AudioStream.audioEngine.inputNode.removeTap(onBus: 0)
   // var pcmBufferData = [Float32]()
   
    playerNode.play()
    for chunk in data{
      var bits = [Float32]()

      for bit in chunk as! NSArray{
        bits.append(bit as! Float32)
        //pcmBufferData.append(bit as! Float32)
      }
      let audio = createPCMBuffer(bits, 1)
      let last = chunk as! NSArray != data.lastObject as! NSArray
      self.playerNode.scheduleBuffer(audio, completionHandler: last ? nil : { [self] in
        //playerNode.stop()
        playerNode.reset()
      });
    }
    
    /*
    var bits = [Float32]()
    
    for bit in data{
      bits.append(bit as! Float32)
      //pcmBufferData.append(bit as! Float32)
    }
    let audio = createPCMBuffer(bits)
    self.playerNode.scheduleBuffer(audio, completionHandler: nil);*/
    
  }
  
  @objc func playFromNetwork( audio: AVAudioPCMBuffer) {
    
   
    
    let audioBuffer = AVAudioPCMBuffer(
      //pcmFormat: AudioStream.audioEngine.inputNode.outputFormat(forBus: 0),
      pcmFormat: audio.format,
      frameCapacity: audio.frameCapacity
      
    )!
    audioBuffer.floatChannelData?.pointee.assign(from: audio.floatChannelData!.pointee, count:  Int(audio.frameCapacity))
    audioBuffer.frameLength = audioBuffer.frameCapacity

    self.playerNode.scheduleBuffer(audioBuffer, completionHandler: {
      //print("played yourself")
    })
    //self.playerNode.
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
    self.unlocked = false
    self.stopObserving()

    
    AudioStream.audioEngine.inputNode.removeTap(onBus: 0)
    AudioStream.audioEngine.outputNode.removeTap(onBus: 0)
    
    AudioStream.audioEngine.inputNode.reset()
    AudioStream.audioEngine.outputNode.reset()
    //AudioStream.audioEngine.pause()
   
  
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
