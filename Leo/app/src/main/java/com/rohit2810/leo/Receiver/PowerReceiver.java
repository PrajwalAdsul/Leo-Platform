package com.rohit2810.leo.Receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Telephony;
import android.speech.tts.TextToSpeech;
import android.telephony.SmsMessage;
import android.util.Log;

import com.rohit2810.leo.App;
import com.rohit2810.leo.Service.GPSService;

import java.util.Locale;

public class PowerReceiver extends BroadcastReceiver {
    private static final String TAG = "PowerReceiver";
    private static long lastTriggerTime = 0;
    private static final int ONE_MILLI = 1000;
    protected static final long ONE_SEC = 1 * ONE_MILLI;
    TextToSpeech t1;
    protected static final long TWO_SEC = 2 * ONE_MILLI;
    protected static final long THREE_SEC = 3 * ONE_MILLI;
    protected static final int TRIGGER_THRESHOLD = 3;
    String msgBody;
    private static boolean triggerInProgress = false;
    protected static int triggerCounter = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
//        Log.d(TAG, "onReceive: " + App.count);
        if(intent.getAction().contains(Intent.ACTION_SCREEN_OFF) || intent.getAction().contains(Intent.ACTION_SCREEN_ON)) {
            if(!App.triggerInProgress)
                checkAlert(context);
            Log.d(TAG, "onReceive: " + "Power Button Pressed " + App.count);
        }
        if (intent.getAction().contains(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)) {
            Log.d(TAG, "onReceive: " + "Entered");
            Bundle bundle = intent.getExtras();           //---get the SMS message passed in---
            SmsMessage[] msgs = null;
            String msg_from;
            if (bundle != null) {
                //---retrieve the SMS message received---
                try {
                    Object[] pdus = (Object[]) bundle.get("pdus");
                    msgs = new SmsMessage[pdus.length];
                    for (int i = 0; i < msgs.length; i++) {
                        msgs[i] = SmsMessage.createFromPdu((byte[]) pdus[i]);
                        msg_from = msgs[i].getOriginatingAddress();
                        msgBody = msgs[i].getMessageBody();
                        Log.d(TAG, "onReceive: " + msgBody);
                        int j = 0;
                        int m;
                        if (msgBody.startsWith("LeoPlatform:")) {
                            Log.d(TAG, "onReceive: " + msgBody);
                            t1=new TextToSpeech(context, new TextToSpeech.OnInitListener() {
                                @Override
                                public void onInit(int status) {
                                    if(status != TextToSpeech.ERROR) {
                                        t1.setLanguage(Locale.UK);
                                        t1.speak(msgBody, TextToSpeech.QUEUE_FLUSH, null);
                                    }
                                }
                            });
                        }
                    }
                } catch (Exception e) {
                    Log.d("Exception caught", e.getMessage());
                }
            }
        }

    }

    private void checkAlert(Context context) {
        if (((System.currentTimeMillis() - lastTriggerTime) <= THREE_SEC
                || (App.count <= 1)) && App.count <= 2)
        {
            App.count++;
            App.triggerInProgress = false;
            lastTriggerTime = System.currentTimeMillis();
        }
        else
        {
            Log.d(TAG, "checkAlert: " + App.count);
            Intent intent = new Intent(context, GPSService.class);
            context.startService(intent);
//            App.count = 0;
        }
    }
}
