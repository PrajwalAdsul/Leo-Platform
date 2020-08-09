package com.example.leoadmin;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.provider.Telephony;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.example.leoadmin.models.DRO;
import com.example.leoadmin.models.Trouble;
import com.example.leoadmin.ui.main.MainActivity;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Service extends android.app.Service {
    private String SHARED_PREFERENCE_PATH = "com.rohit2810.leo_admin.Login";
    private static final String TAG = "Service";
    Retrofit retrofit;
    private String signature = "LeoPlatform";
    UserInterfaceAPI userInterfaceAPI;
    IntentFilter filter;
    BroadcastReceiver receiver;
    private NotificationManagerCompat managerCompat;
    Notification notification2;
    int flag = 0;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Intent intent1 = new Intent(this, MainActivity.class);
        final PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent1, 0);
        Notification notification = new NotificationCompat.Builder(Service.this, "ServiceChannel")
                .setContentTitle("Leo Admin")
                .setSmallIcon(R.drawable.ic_announcement_black_24dp)
                .setContentText("Leo Admin is Running")
                .setContentIntent(pendingIntent)
                .build();

        notification2 = new NotificationCompat.Builder(Service.this, App.CHANNEL_2_ID)
                .setContentTitle("Trouble!!")
                .setSmallIcon(R.drawable.ic_announcement_black_24dp)
                .setContentText("Users are in trouble")
                .setContentIntent(pendingIntent)
                .build();

        managerCompat = NotificationManagerCompat.from(this);
        //Retrofit for json
        setupRetrofit();

        filter = new IntentFilter(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
        receiver = new Receiver();
        registerReceiver(receiver, filter);

        //Starting a service
        startForeground(1, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        getContinuosTroubles();
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(receiver);
    }

    private void getContinuosTroubles() {
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Thread.sleep(2 * 60 * 1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if (getTroubles()) {
                        NotificationManager mNotificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
                        StatusBarNotification[] notifications = new StatusBarNotification[0];
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                            notifications = mNotificationManager.getActiveNotifications();
                        }
                        for (StatusBarNotification notification : notifications) {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
                                if (notification.getId() == 2) {
                                    return;
                                }
                            }
                        }
                        managerCompat.notify(2, notification2);
                    } else {
                    }
                }
            }
        });
        thread.start();

    }

    private boolean getTroubles() {
        SharedPreferences preferences = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE);
        Call<List<Trouble>> call = userInterfaceAPI.getUsers(new DRO(preferences.getString("username", " "),
                new Utils().getPass(preferences), preferences.getString("token", "")));
        call.enqueue(new Callback<List<Trouble>>() {
            @Override
            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                    return;
                }
                List<Trouble> list = response.body();
                for (Trouble trouble : list) {
                    if(trouble.isInTrouble()) {
                        flag = 1;
//                        if(!App.list.contains(trouble)) {
//                            App.list.add(trouble);
//                        }
                        return;
                    }
                }
                if (response.body() != null) {
                    Log.d(TAG, response.body().toString());
                } else {
                    Log.d(TAG, "Response is null");
                }
            }

            @Override
            public void onFailure(Call<List<Trouble>> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });
        if (flag == 1) {
            return true;
        } else {
            return false;
        }
    }

    private void setupRetrofit() {
        String BASE_URL = "https://peaceful-refuge-01419.herokuapp.com/LeoHelp/";
        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }

//    public void refreshInbox() {
//        ContentResolver cResolver = getContentResolver();
//        Cursor smsInboxCursor = cResolver.query(Uri.parse("content://sms/inbox"), null, null, null, null);
//        int indexBody = smsInboxCursor.getColumnIndex("body");
//        int indexAddress = smsInboxCursor.getColumnIndex("address");
//        if(indexBody < 0 || !smsInboxCursor.moveToFirst())
//            return;
//        do{
//            if(smsInboxCursor.getString(indexBody).startsWith(signature)) {
//                String str = "SMS from : " + smsInboxCursor.getString(indexAddress) + "\n";
//                str += smsInboxCursor.getString(indexBody);
//                Log.d(TAG, "refreshInbox: " + str);
//            }
//        } while (smsInboxCursor.moveToNext());
//    }


}
