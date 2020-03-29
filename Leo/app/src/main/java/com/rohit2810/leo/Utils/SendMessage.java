package com.rohit2810.leo.Utils;

import android.telephony.SmsManager;
import android.util.Log;

import com.rohit2810.leo.App;
import com.rohit2810.leo.Interface.UserInterfaceAPI;
import com.rohit2810.leo.Model.Trouble;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SendMessage {

    private static final String TAG = "SendMessage";

    UserInterfaceAPI userInterfaceAPI;
    Trouble trouble;
    String[] contacts = new String[5];
    SmsManager smsManager;


    public SendMessage(UserInterfaceAPI userInterfaceAPI, SmsManager smsManager) {
        this.userInterfaceAPI = userInterfaceAPI;
        this.smsManager = smsManager;
    }


    public void send(final double latitude, final double longitude, String[] contacts) {
//        Call<List<Trouble>> call = userInterfaceAPI.getUsers();
//        call.enqueue(new Callback<List<Trouble>>() {
//            @Override
//            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
//                if (!response.isSuccessful()) {
//                    Log.d(TAG, "onResponse: " + response.code());
//                }
//                List<Trouble> list = response.body();
//                for (Trouble trouble2 : list) {
//                    if (trouble2.getUsername().equals(App.name)) {
//                        trouble = trouble2;
//                        contacts = trouble.getEmergencyContacts();
//
//                        break;
//                    }
//                }
//            }
//
//            @Override
//            public void onFailure(Call<List<Trouble>> call, Throwable t) {
//                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
//            }
//        });
//        Log.d(TAG, "onResponse: " + trouble.toString());
        int i = 0;
        String string = "I am in trouble. " + "\n" + "My location is : \n";
        String title = "https://www.google.com/maps/@" + latitude + "," + longitude + ",15z";
        while (contacts[i] != null) {
            try {
                Log.d(TAG, "onResponse: " + contacts[i]);
                smsManager.sendTextMessage(contacts[i], null, string + title, null, null);
                i++;
            } catch (Error e) {
                Log.d(TAG, "onResponse: " + e.getLocalizedMessage());
            }
        }
    }

}
