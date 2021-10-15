//
//  RNAudioStream.swift
//  chatr
//
//  Created by Marc Fervil on 10/14/21.
//


import Foundation
@objc(AudioStream)
class AudioStream: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  

  @objc func stream(_ options: NSDictionary) -> Void {
    
    let message = RCTConvert.nsString(options["message"])
    print(message!)
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
