package com.example.leoadmin;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.IBinder;
import android.provider.Telephony;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Service extends android.app.Service{
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
                while(true) {
                    try{
                        Thread.sleep(1000);
                    }catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    if(getTroubles()) {
                        Log.d(TAG, "run: " + "User is in trouble");
                        managerCompat.notify(2, notification2);
//                        refreshInbox();
                    }else {
                        Log.d(TAG, "run: " + "User is not in trouble");
                    }
                }
            }
        });
        thread.start();

    }

    private boolean getTroubles() {
        Call<List<Trouble>> call = userInterfaceAPI.getUsers();
        call.enqueue(new Callback<List<Trouble>>() {
            @Override
            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                }
                List<Trouble> list = response.body();
                for (Trouble trouble : list) {
                    if(trouble.isInTrouble()) {
                        flag = 1;
                        return;
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Trouble>> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });
        if(flag == 1) {
            return true;
        }else {
            return false;
        }
    }

    private void setupRetrofit() {
        retrofit = new Retrofit.Builder()
                .baseUrl("http://"+ getString(R.string.ip_address) +":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }

    public void refreshInbox() {
        ContentResolver cResolver = getContentResolver();
        Cursor smsInboxCursor = cResolver.query(Uri.parse("content://sms/inbox"), null, null, null, null);
        int indexBody = smsInboxCursor.getColumnIndex("body");
        int indexAddress = smsInboxCursor.getColumnIndex("address");
        if(indexBody < 0 || !smsInboxCursor.moveToFirst())
            return;
        do{
            if(smsInboxCursor.getString(indexBody).startsWith(signature)) {
                String str = "SMS from : " + smsInboxCursor.getString(indexAddress) + "\n";
                str += smsInboxCursor.getString(indexBody);
                Log.d(TAG, "refreshInbox: " + str);
            }
        } while (smsInboxCursor.moveToNext());
    }

}
