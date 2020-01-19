package com.example.leo.Service;

import android.Manifest;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.ToneGenerator;
import android.os.Build;
import android.os.IBinder;
import android.os.Looper;
import android.provider.Settings;
import android.provider.Telephony;
import android.telephony.SmsManager;
import android.util.Log;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

import com.example.leo.Activity.MainActivity;
import com.example.leo.App;
import com.example.leo.Interface.UserInterfaceAPI;
import com.example.leo.Model.Trouble;
import com.example.leo.R;
import com.example.leo.Receiver.PowerReceiver;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import java.text.DecimalFormat;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.WRITE_SYNC_SETTINGS;
import static android.app.Service.START_NOT_STICKY;

public class GPSService extends Service implements SensorEventListener {
    private static final String TAG = "GPSService";
    Trouble trouble;
    MediaPlayer player;
    String[] contacts = new String[5];
    int flag = 0;
    private FusedLocationProviderClient client;
    private SensorManager mSensorManager;
    private Sensor mAccelerometer;
    private double latitude, longitude;
    IntentFilter filter;
    BroadcastReceiver receiver;
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    SmsManager smsManager;

    @Override
    public void onCreate() {
        super.onCreate();

        //GetLocation setup
        client = LocationServices.getFusedLocationProviderClient(this);

        //Service setup
        Intent intent1 = new Intent(this, MainActivity.class);
        final PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent1, 0);
        Notification notification = new NotificationCompat.Builder(GPSService.this, "ServiceChannel")
                .setContentTitle("Leo Platform")
                .setSmallIcon(R.drawable.leo2)
                .setContentText("Leo is Ready to help")
                .setContentIntent(pendingIntent)
                .build();
        filter = new IntentFilter(Intent.ACTION_SCREEN_ON);
        filter.addAction(Intent.ACTION_SCREEN_OFF);
        filter.addAction(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
        receiver = new PowerReceiver();
        registerReceiver(receiver, filter);

        //Retrofit for json
        setupRetrofit();

        smsManager = SmsManager.getDefault();



        mSensorManager = (SensorManager)getSystemService(SENSOR_SERVICE);
        mAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mSensorManager.registerListener(this, mAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);
        //Starting a service
        startForeground(1, notification);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand: " + "Started");
        detectPowerButton();
//        getContinuosTroubles();
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(receiver);
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    //To get the location
    private void getLocation() {
        LocationRequest request = new LocationRequest();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return;
            }
        }
        client.requestLocationUpdates(request, new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                Location location = locationResult.getLastLocation();
                if(location != null) {
                    latitude = location.getLatitude();
                    longitude = location.getLongitude();
                    sendTrouble(new Trouble(App.name, latitude, longitude, true));
                    sendMessage();
                    playAudio();
                }
            }
        }, Looper.myLooper());
    }

    //To detect the power button
    private void detectPowerButton() {
        if(App.count >= 2) {
            getLocation();
//            sendMessage();
            App.count = 0;
            App.triggerInProgress = false;
        }
    }

    private void playAudio() {
        ToneGenerator toneG = new ToneGenerator(AudioManager.STREAM_ALARM, 100);
        toneG.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 2000);
    }

    //To sent the trouble
    private void sendTrouble(Trouble trouble) {
        Call<Trouble> call = userInterfaceAPI.createTrouble(trouble);
        call.enqueue(new Callback<Trouble>() {
            @Override
            public void onResponse(Call<Trouble> call, Response<Trouble> response) {
                if(!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                }
                Log.d(TAG, "onResponseSendTrouble: " + response.body());
            }

            @Override
            public void onFailure(Call<Trouble> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });
    }

    //Setup the retrofit
    private void setupRetrofit() {
        retrofit = new Retrofit.Builder()
                .baseUrl("http://" + getString(R.string.ip_address) +":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
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

    private void sendMessage() {


        Call<List<Trouble>> call = userInterfaceAPI.getUsers();
        call.enqueue(new Callback<List<Trouble>>() {
            @Override
            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
                if(!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                }
                List<Trouble> list = response.body();
                for(Trouble trouble2: list) {
                    if(trouble2.getUsername().equals(App.name)) {
                        trouble = trouble2;
                        contacts = trouble.getEmergencyContacts();
                        Log.d(TAG, "onResponse: " + trouble.toString());
                        int i = 0;
                        String string = "LeoPlatform::I am in trouble. " + "\n" + "My location is : \n";
                        String title = "https://www.google.com/maps/@" + latitude + ","+ longitude + ",15z";
                        while(contacts[i] != null) {
                            try {
                                Log.d(TAG, "onResponse: " + contacts[i]);
                                smsManager.sendTextMessage(contacts[i], null, string+title, null, null);
                                i++;
                            }catch (Error e) {
                                Log.d(TAG, "onResponse: " + e.getLocalizedMessage());
                            }
                        }
                        smsManager.sendTextMessage("9552933004", null, string+title, null, null);
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


    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        if (sensorEvent.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            double loX = sensorEvent.values[0];
            double loY = sensorEvent.values[1];
            double loZ = sensorEvent.values[2];

            double loAccelerationReader = Math.sqrt(Math.pow(loX, 2)
                    + Math.pow(loY, 2)
                    + Math.pow(loZ, 2));

            DecimalFormat precision = new DecimalFormat("0.00");
            double ldAccRound = Double.parseDouble(precision.format(loAccelerationReader));
//            Log.d(TAG, "onSensorChanged: " + ldAccRound);
            if (ldAccRound > 0.3d && ldAccRound < 0.5d) {
                Log.d(TAG, "onSensorChanged: " + "Fall Detected" + ldAccRound);
                getLocation();
                playAudio();
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }
}
