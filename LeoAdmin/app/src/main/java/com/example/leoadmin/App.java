package com.example.leoadmin;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;

import java.util.ArrayList;

public class App extends Application {
    public static ArrayList<Trouble> list;
    NotificationChannel channel;
    NotificationChannel channel2;
    public static final String CHANNEL_1_ID = "ServiceChannel";
    public static final String CHANNEL_2_ID = "InfoChannel";
    @Override
    public void onCreate() {
        super.onCreate();
        list = new ArrayList<>();
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            channel = new NotificationChannel(
                    CHANNEL_1_ID,
                    "Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel2 = new NotificationChannel(
                    CHANNEL_2_ID,
                    "Information Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
            manager.createNotificationChannel(channel2);
        }
    }
}
