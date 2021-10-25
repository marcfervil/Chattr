package com.chatr;

import static android.media.AudioTrack.WRITE_BLOCKING;

import android.Manifest;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.stream.Stream;

public class AudioStream extends ReactContextBaseJavaModule {

    public AudioStream(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private AudioRecord ar = null;
    private int minSize;

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
       // reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).em
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableNativeArray params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
        // reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).em
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

        HandlerThread handlerThread = new HandlerThread("Audio Playback");
        handlerThread.start();
        Looper looper = handlerThread.getLooper();
        Handler handler = new Handler(looper);
        handler.post(r);
        //Log.i("perf","thread posted");
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    public void stream(Callback errorCallback) {
        if (ContextCompat.checkSelfPermission(this.getCurrentActivity(),
                Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this.getCurrentActivity(),
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    1234);
        }
        minSize= AudioRecord.getMinBufferSize(44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_FLOAT);
        ar = new AudioRecord(MediaRecorder.AudioSource.MIC, 44100, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_FLOAT, minSize);

        ar.startRecording();
        final Runnable r = () -> {
            while(ar.getRecordingState()==AudioRecord.RECORDSTATE_RECORDING) {
                float[] floats = new float[minSize];
                ar.read(floats, 0, minSize, AudioRecord.READ_BLOCKING);
                //for(float f: floats) Log.i("data", f + "");
                WritableNativeArray data = new WritableNativeArray();
                for(float f: floats) data.pushDouble(f);

                sendEvent(getReactApplicationContext(),"stream",data);
            }
        };
        HandlerThread handlerThread = new HandlerThread("Mic Record");
        handlerThread.start();
        Looper looper = handlerThread.getLooper();
        Handler handler = new Handler(looper);
        handler.post(r);
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
