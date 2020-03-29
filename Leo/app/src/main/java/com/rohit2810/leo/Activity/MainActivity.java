package com.rohit2810.leo.Activity;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.location.Location;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.telephony.SmsManager;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.rohit2810.leo.App;
import com.rohit2810.leo.Interface.UserInterfaceAPI;
import com.rohit2810.leo.Model.Trouble;
import com.rohit2810.leo.R;
import com.rohit2810.leo.Service.GPSService;
import com.rohit2810.leo.Utils.SendMessage;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;
import com.rohit2810.leo.Utils.TroubleRoute;
import com.rohit2810.leo.WifiDirect.WifiDirectUtils;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;

public class MainActivity extends AppCompatActivity {
    Dialog prec;
    Button btnPrec, btnTrouble, btnLocation;
    Trouble trouble;
    SmsManager smsManager;
    static final String path = "com.example.leo.Login";
    SharedPreferences.Editor editor;
    UserInterfaceAPI userInterfaceAPI;
    private FusedLocationProviderClient client;
    private static final String TAG = "MainActivity";
    private double latitude, longitude;
    SendMessage messageClass;
    TroubleRoute troubleRoute;
    WifiDirectUtils wifiDirectUtils;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initialWork();
        setupOnClickListeners();


    }

    private void setupPrecDialog() {
        prec = new Dialog(this);
        prec.setContentView(R.layout.prec_dialog);
        prec.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        prec.getWindow().setLayout(Toolbar.LayoutParams.MATCH_PARENT, Toolbar.LayoutParams.WRAP_CONTENT);
        prec.getWindow().getAttributes().gravity = Gravity.BOTTOM;

        TextView textView = prec.findViewById(R.id.tv_Prec);
        String text = "1. Do not wear headphones or be consumed with your cell phone unless you are in a familiar place or a secure area." + "\n" +
                "2. Do not standout by wearing clothes and jewelry that are culturally inappropriate and draw attention to you." + "\n" +
                "3. Do not be a soft target for a robbery or people that would bring harm to you." + "\n" +
                "4. do not show your itinerary to anyone that does not need to know.";
        textView.setText(text);
    }

    private void initialWork() {

        //Start all the default utilities
        setupPrecDialog();
        startService();


        //Setup default objects
        editor = getSharedPreferences(path, MODE_PRIVATE).edit();
        smsManager = SmsManager.getDefault();
        client = LocationServices.getFusedLocationProviderClient(this);

        //Setup default views
        btnPrec = findViewById(R.id.main_btnPrec);
        btnLocation = findViewById(R.id.main_btnLocation);
        btnTrouble = findViewById(R.id.main_btnTrouble);

        //Setting up message class
        messageClass = new SendMessage(userInterfaceAPI, smsManager);

        //Setting up Trouble Route
        troubleRoute = new TroubleRoute();
        troubleRoute.setCurrentUser();

        //Setup wifiDirectUtils
        wifiDirectUtils = new WifiDirectUtils();


    }

    private void startService() {

        Intent intent = new Intent(this, GPSService.class);
        ContextCompat.startForegroundService(this, intent);
    }

    private void stopService() {
        Intent intent = new Intent(this, GPSService.class);
        stopService(intent);
    }


    //To get the location
    private void getLocation() {
        Log.d(TAG, "getLocation: Entered");
        LocationRequest request = new LocationRequest();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Log.d(TAG, "getLocation: Under Build wala if");
            if (checkSelfPermission(ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "getLocation: " + "Under permission wala if");
                return;
            }
        }
        client.requestLocationUpdates(request, new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                Location location = locationResult.getLastLocation();
                Log.d(TAG, "onLocationResult: Entered");
                if (location != null) {
                    Log.d(TAG, "onLocationResult: Entered");
                    Trouble trouble = new Trouble(App.name, latitude, longitude, true);
                    latitude = location.getLatitude();
                    longitude = location.getLongitude();
                    troubleRoute.sendTrouble(trouble);
                    messageClass.send(latitude, longitude, troubleRoute.getTrouble().getEmergencyContacts());
                }
            }
        }, Looper.myLooper());
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.mainmenu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.mainmenu_contacts) {
            trouble = troubleRoute.getTrouble();
            Log.d(TAG, "onOptionsItemSelected: " + trouble.toString());
            Intent intent = new Intent(this, EmergencyContactsActivity.class);
            Gson gson = new Gson();
            String myJson = gson.toJson(trouble);
            intent.putExtra("trouble", myJson);
            Log.d(TAG, "onOptionsItemSelected: " + myJson);
            startActivity(intent);
        } else if (id == R.id.mainmenu_settings) {
            stopService();
            editor.putString("name", "");
            editor.putString("pass", "");
            editor.commit();
            startActivity(new Intent(MainActivity.this, LoginActivity.class));
            finish();
        }
        return super.onOptionsItemSelected(item);
    }



    private void setupOnClickListeners() {
        btnPrec.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                prec.show();
            }
        });

        btnLocation.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(MainActivity.this, MapsActivity.class));
            }
        });

        btnTrouble.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d(TAG, "onClick: Entered");
                getLocation();
//                ToneGenerator toneG = new ToneGenerator(AudioManager.STREAM_ALARM, 100);
//                toneG.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 2000);
            }
        });
    }

}
