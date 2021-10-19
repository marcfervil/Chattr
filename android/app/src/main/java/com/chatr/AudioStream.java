package com.chatr;

import static android.media.AudioTrack.WRITE_BLOCKING;

import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.stream.Stream;

public class AudioStream extends ReactContextBaseJavaModule {

    public AudioStream(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    public static byte[] floatsToByteBuffer(float[] values){
        ByteBuffer buffer = ByteBuffer.allocate(4 * values.length);

        for (float value : values){
            buffer.putFloat(value);
        }

        return buffer.array();
    }

    @ReactMethod
    public void playFromNetwork(ReadableArray chunks) {

        final Runnable r = () -> {
            int bufsize = AudioTrack.getMinBufferSize(44100, AudioFormat.CHANNEL_OUT_MONO, AudioFormat.ENCODING_PCM_FLOAT);


            AudioTrack audio = new AudioTrack(AudioManager.STREAM_MUSIC,
                    44100, //sample rate
                    AudioFormat.CHANNEL_OUT_MONO, //2 channel
                    AudioFormat.ENCODING_PCM_FLOAT, // 16-bit
                    bufsize,
                    AudioTrack.MODE_STREAM);
            audio.play();


            for (Object chunkObj : chunks.toArrayList()) {
                ArrayList<Double> chunk = (ArrayList<Double>) chunkObj;
                float[] floats = new float[chunk.size()];
                for (int i = 0; i < chunk.size(); i++) {
                    floats[i] = chunk.get(i).floatValue();
                }
               // Log.d("perf","chunked written");
                audio.write(floats, 0, floats.length, WRITE_BLOCKING);

            }
        };

        HandlerThread handlerThread = new HandlerThread("MyHandlerThread");
        handlerThread.start();
        Looper looper = handlerThread.getLooper();
        Handler handler = new Handler(looper);
        handler.post(r);
        //Log.i("perf","thread posted");
    }

    @ReactMethod
    public void stream(Callback errorCallback) {
        Log.d("React","wooo im streaming");

    }



    @ReactMethod
    public void addListener(String eventName) {
        Log.d("React",eventName);
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }

    @NonNull
    @Override
    public String getName() {
        return "AudioStream";
    }
}
