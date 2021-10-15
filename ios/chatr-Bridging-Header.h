//
//  Use this file to import your target's public headers that you would like to expose to Swift.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTLog.h>


@interface RCT_EXTERN_MODULE(AudioStream, NSObject)
RCT_EXTERN_METHOD(stream:(RCTResponseSenderBlock *)error)
RCT_EXTERN_METHOD(stop)
@end

/*
#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(Bulb, NSObject)
RCT_EXTERN_METHOD(options:(NSDictionary *)options)
@end
*/
