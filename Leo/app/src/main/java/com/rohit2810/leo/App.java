package com.rohit2810.leo;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;

public class App extends Application {
    public static final String CHANNEL_1_ID = "ServiceChannel";
    public static int count = 0;
    public static boolean triggerInProgress = false;
    public static String name;
    public static String pass;
    public static String retrofitAdd;
    NotificationChannel channel;
    @Override
    public void onCreate() {
        super.onCreate();
        retrofitAdd = "192.168.43.67";
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            channel = new NotificationChannel(
                    CHANNEL_1_ID,
                    "Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }
}
