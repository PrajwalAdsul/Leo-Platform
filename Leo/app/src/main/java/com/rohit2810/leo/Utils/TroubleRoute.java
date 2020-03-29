package com.rohit2810.leo.Utils;


import android.util.Log;


import com.rohit2810.leo.App;
import com.rohit2810.leo.Interface.UserInterfaceAPI;
import com.rohit2810.leo.Model.Trouble;
import com.rohit2810.leo.Service.GPSService;
import com.rohit2810.leo.WifiDirect.WifiDirectUtils;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class TroubleRoute {

    private static final String TAG = "TroubleRoute";

    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    private Trouble trouble;

    public TroubleRoute() {
        retrofit = new Retrofit.Builder()
                .baseUrl("http://" + App.retrofitAdd + ":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }



    //To sent the trouble
    public void sendTrouble(Trouble trouble) {
        Call<Trouble> call = userInterfaceAPI.createTrouble(trouble);
        if(call == null) {
            GPSService gpsService = new GPSService();
            if(gpsService.connectToUser()) {
                WifiDirectUtils wifiDirectUtils = gpsService.getWifiDirectUtils();
                wifiDirectUtils.writeMessage("Rohit");
            }
            return;
        }

        call.enqueue(new Callback<Trouble>() {
            @Override
            public void onResponse(Call<Trouble> call, Response<Trouble> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                }
                Log.d(TAG, "onResponse: " + response.body());
            }

            @Override
            public void onFailure(Call<Trouble> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
                GPSService gpsService = new GPSService();
                if(gpsService.connectToUser()) {
                    Log.d(TAG, "onFailure: Entered WifiDirectUtils");
                    WifiDirectUtils wifiDirectUtils = gpsService.getWifiDirectUtils();
                    wifiDirectUtils.writeMessage("Rohit");
                }
            }
        });
    }

    //Set Logged In Current User
    public void setCurrentUser() {
        Call<List<Trouble>> call = userInterfaceAPI.getUsers();
        call.enqueue(new Callback<List<Trouble>>() {
            @Override
            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                }
                List<Trouble> list = response.body();
                for (Trouble trouble2 : list) {
                    if (trouble2.getUsername().equals(App.name)) {
                        trouble = trouble2;
//                        contacts = trouble.getEmergencyContacts();
                        Log.d(TAG, "onResponse: " + trouble.toString());
                        break;
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Trouble>> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });
    }

    //Get User
    public Trouble getTrouble() {
        return trouble;
    }
}
