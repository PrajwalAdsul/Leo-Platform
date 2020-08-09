package com.example.leoadmin;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

import com.example.leoadmin.models.User;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Receiver extends BroadcastReceiver {
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    Context context;
    private static final String TAG = "Receiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        setupRetrofit();
        Log.d(TAG, "Message Received");
        this.context = context;
        if (intent.getAction().equals(Telephony.Sms.Intents.SMS_RECEIVED_ACTION)) {
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
                        if(msg_from.startsWith("91")) {
                            msg_from = msg_from.replaceFirst("91", "");
                        }
                        if(msg_from.startsWith("0")) {
                            msg_from = msg_from.replaceFirst("0", "");
                        }
                        String msgBody = msgs[i].getMessageBody();
                        String[] name = {"", ""};
                        Log.d(TAG, "onReceive: " + msgBody);
                        int j = 0;
                        int m;
                        if (msgBody.startsWith("LeoPlatform:")) {
                            for (int k = 11; k < msgBody.length(); k++) {
                                if (msgBody.charAt(k) == ':') {
                                    Log.d(TAG, "onReceive: " + "Entered");
                                    k++;
                                    while (k < msgBody.length() && msgBody.charAt(k) != ':') {
                                        Log.d(TAG, "onReceive: " + msgBody.charAt(k));
                                        name[j] += msgBody.charAt(k);
                                        k++;
                                    }
                                    k--;
                                    j++;
                                    Log.d(TAG, "onReceive: " + k);
                                }
                            }
                            Log.d(TAG, "onReceive: " + msg_from);
                            Log.d(TAG, "onReceive: " + name[1]);
                            Log.d(TAG, "onReceive: " + name[0]);
                            addUser(new User(name[0], msg_from, name[1]));
                        }
                    }
                } catch (Exception e) {
                    Log.d("Exception caught", e.getMessage());
                }
            }
        }
    }

    private void addUser(User user) {
        Call<User> call = userInterfaceAPI.addUser(user);
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                    return;
                }
                Log.d(TAG, "onResponse: " + response.body());
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });
    }

    private void setupRetrofit() {
        String BASE_URL = "https://peaceful-refuge-01419.herokuapp.com/LeoHelp/";
        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }
}
