package com.rohit2810.leo.Service;

import android.Manifest;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.net.wifi.WifiManager;
import android.net.wifi.p2p.WifiP2pConfig;
import android.net.wifi.p2p.WifiP2pDevice;
import android.net.wifi.p2p.WifiP2pDeviceList;
import android.net.wifi.p2p.WifiP2pInfo;
import android.net.wifi.p2p.WifiP2pManager;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.provider.Telephony;
import android.telephony.SmsManager;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

import com.rohit2810.leo.Activity.MainActivity;
import com.rohit2810.leo.App;
import com.rohit2810.leo.Interface.UserInterfaceAPI;
import com.rohit2810.leo.Model.Trouble;
import com.rohit2810.leo.R;
import com.rohit2810.leo.Receiver.PowerReceiver;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.rohit2810.leo.Receiver.WifiBroadcastReceiver;
import com.rohit2810.leo.Utils.SendMessage;
import com.rohit2810.leo.Utils.TroubleRoute;
import com.rohit2810.leo.WifiDirect.WifiDirectUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;


import static android.Manifest.permission.ACCESS_FINE_LOCATION;

public class GPSService extends Service implements SensorEventListener {
    private static final String TAG = "GPSService";
    private FusedLocationProviderClient client;
    private SensorManager mSensorManager;
    private Sensor mAccelerometer;
    private double latitude, longitude;
    IntentFilter powerFilter, wifiIntentFilter;
    BroadcastReceiver powerReceiver, wifiReceiver;
    UserInterfaceAPI userInterfaceAPI;
    SmsManager smsManager;
    SendMessage messageClass;
    TroubleRoute troubleRoute;

    //Wifi p2p manager vars
    WifiManager wifiManager;
    WifiP2pManager mManager;
    WifiP2pManager.Channel mChannel;
    boolean flag;

    private WifiDirectUtils wifiDirectUtils;


    List<WifiP2pDevice> peers = new ArrayList<WifiP2pDevice>();
    String[] deviceNameArray;
    public WifiP2pDevice[] deviceArray;


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


        //Setting up Wifi p2p manager
        wifiManager = (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);

        mManager = (WifiP2pManager) getSystemService(Context.WIFI_P2P_SERVICE);
        mChannel = mManager.initialize(this, getMainLooper(), null);

        mManager.discoverPeers(mChannel, new WifiP2pManager.ActionListener() {
            @Override
            public void onSuccess() {
                Log.d(TAG, "onSuccess: Discovery Started");
            }

            @Override
            public void onFailure(int i) {
                Log.d(TAG, "Discovery Starting onFailure: " + i);
            }
        });

        //Setting up Power Receiver
        powerFilter = new IntentFilter(Intent.ACTION_SCREEN_ON);
        powerFilter.addAction(Intent.ACTION_SCREEN_OFF);
        powerFilter.addAction(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
        powerReceiver = new PowerReceiver();
        registerReceiver(powerReceiver, powerFilter);


        //Setting Up Wifi Receiver
        wifiIntentFilter = new IntentFilter();
        wifiIntentFilter.addAction(WifiP2pManager.WIFI_P2P_STATE_CHANGED_ACTION);
        wifiIntentFilter.addAction(WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION);
        wifiIntentFilter.addAction(WifiP2pManager.WIFI_P2P_CONNECTION_CHANGED_ACTION);
        wifiIntentFilter.addAction(WifiP2pManager.WIFI_P2P_THIS_DEVICE_CHANGED_ACTION);
        wifiReceiver = new WifiBroadcastReceiver(mManager, mChannel, this);
        registerReceiver(wifiReceiver, wifiIntentFilter);



        //Setting up trouble route
        troubleRoute = new TroubleRoute();

        //Setting up WifiDirect Utils
        wifiDirectUtils = new WifiDirectUtils();

        smsManager = SmsManager.getDefault();
        messageClass = new SendMessage(userInterfaceAPI, smsManager);



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
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(powerReceiver);
        unregisterReceiver(wifiReceiver);

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
                    troubleRoute.sendTrouble(new Trouble(App.name, latitude, longitude, true));
                    messageClass.send(latitude, longitude, troubleRoute.getTrouble().getEmergencyContacts());
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


    // Peer list listener
    public WifiP2pManager.PeerListListener peerListListener = new WifiP2pManager.PeerListListener() {
        @Override
        public void onPeersAvailable(WifiP2pDeviceList peerList) {
            Log.d("peerList in the list", peerList.getDeviceList().toString());
            Log.d("peers in the list", peers.toString());
            if(!peerList.getDeviceList().equals(peers)) {
                peers.clear();
                peers.addAll(peerList.getDeviceList());

                deviceNameArray = new String[peerList.getDeviceList().size()];

                deviceArray = new WifiP2pDevice[peerList.getDeviceList().size()];
                int index = 0;
                for(WifiP2pDevice device : peerList.getDeviceList()) {
                    deviceNameArray[index] = device.deviceName;
                    deviceArray[index] = device;
                    index++;
                }
                connectToUser();
                ArrayAdapter<String> adapter = new ArrayAdapter<String>(getApplicationContext(), android.R.layout.simple_list_item_1, deviceNameArray);
            }
            if(peers.size() == 0) {
                Toast.makeText(getApplicationContext(), "No Device Found", Toast.LENGTH_SHORT).show();
                return;
            }
        }
    };





    public WifiP2pManager.ConnectionInfoListener connectionInfoListener = new WifiP2pManager.ConnectionInfoListener() {
        @Override
        public void onConnectionInfoAvailable(WifiP2pInfo wifiP2pInfo) {
            final InetAddress groupOwnerAddress = wifiP2pInfo.groupOwnerAddress;
            Toast.makeText(getApplicationContext(),"Owner:"+ wifiP2pInfo.isGroupOwner + wifiP2pInfo.groupFormed, Toast.LENGTH_SHORT).show();
            if(wifiP2pInfo.groupFormed && wifiP2pInfo.isGroupOwner) {
                String stemp = "";
                Log.d("connectHost Line 214",  groupOwnerAddress.toString());
                wifiDirectUtils.startServer();
            }
            else if(wifiP2pInfo.groupFormed) {
                Log.d("connectClient line 221", groupOwnerAddress.toString());
                wifiDirectUtils.startClient(groupOwnerAddress);
            }
        }
    };


    public boolean connectToUser() {
        if(deviceArray == null || deviceArray.length == 0) {
            Log.d(TAG, "connectToUser: Entered under if");
            return false;
        }
        Log.d(TAG, "connectToUser: Aat gela");
        final WifiP2pDevice device = deviceArray[0];
        WifiP2pConfig config = new WifiP2pConfig();
        config.deviceAddress = device.deviceAddress;
        flag = true;
        mManager.connect(mChannel, config, new WifiP2pManager.ActionListener() {
            @Override
            public void onSuccess() {
                Log.d(TAG, "onSuccess: Connection Success");
                Toast.makeText(getApplicationContext(), "Connected to " + device.deviceName, Toast.LENGTH_SHORT).show();
                flag = false;
            }

            @Override
            public void onFailure(int i) {
                Log.d(TAG, "onFailure: Connection Failure");
                Toast.makeText(getApplicationContext(),"Not Connected", Toast.LENGTH_SHORT).show();
            }
        });
        
        return true;
    }


    public class sendtask extends AsyncTask<Void, Void, Void> {

        String message;


        sendtask(String msg) {
            message=msg;
        }

        @Override
        protected Void doInBackground(Void... arg0) {
            Log.d("TaskThrad Line 343", message);
            wifiDirectUtils.writeMessage(message);
            Log.d("TaskThrad Line 345", message);
            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            Log.d("TaskThrad Line 365", result.toString());
            super.onPostExecute(result);
            Log.d("TaskThrad Line 367", result.getClass().getSimpleName());
        }

    }

    public WifiDirectUtils getWifiDirectUtils() {
        return wifiDirectUtils;
    }
}
