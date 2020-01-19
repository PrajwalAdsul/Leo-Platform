package com.example.leo.Activity;

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
import android.os.Parcelable;
import android.telephony.SmsManager;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.example.leo.App;
import com.example.leo.Interface.UserInterfaceAPI;
import com.example.leo.Model.Trouble;
import com.example.leo.R;
import com.example.leo.Service.GPSService;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;

import java.io.Serializable;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;

public class MainActivity extends AppCompatActivity implements SensorEventListener {
    Dialog prec;
    Button btnPrec, btnTrouble, btnLocation;
    Retrofit retrofit;
    String[] contacts = new String[5];
    Trouble trouble;
    SmsManager smsManager;
    static final String path = "com.example.leo.Login";
    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    UserInterfaceAPI userInterfaceAPI;
    private FusedLocationProviderClient client;
    private static final String TAG = "MainActivity";
    private double latitude, longitude;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        setupPrecDialog();
        setupRetrofit();
        startService();
        getCurrentUser();
        editor = getSharedPreferences(path, MODE_PRIVATE).edit();
        smsManager = SmsManager.getDefault();
        btnPrec = findViewById(R.id.main_btnPrec);
        btnLocation = findViewById(R.id.main_btnLocation);
        //GetLocation setup
        client = LocationServices.getFusedLocationProviderClient(this);
        btnTrouble = findViewById(R.id.main_btnTrouble);
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
                getLocation();
                ToneGenerator toneG = new ToneGenerator(AudioManager.STREAM_ALARM, 100);
                toneG.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 2000);
//                sendMessage();
            }
        });
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

    private void startService() {

        Intent intent = new Intent(this, GPSService.class);
        ContextCompat.startForegroundService(this, intent);
    }

    private void stopService() {
        Intent intent = new Intent(this, GPSService.class);
        stopService(intent);
    }

    //To sent the trouble
    private void sendTrouble(Trouble trouble) {
        Call<Trouble> call = userInterfaceAPI.createTrouble(trouble);
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
            }
        });
    }

    //Setup the retrofit
    private void setupRetrofit() {
        retrofit = new Retrofit.Builder()
                .baseUrl("http://" + getString(R.string.ip_address) + ":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
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
                if (location != null) {
                    latitude = location.getLatitude();
                    longitude = location.getLongitude();
                    sendTrouble(new Trouble(App.name, latitude, longitude, true));
                    sendMessage();
                }
            }
        }, Looper.myLooper());
    }

    private void sendMessage() {
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
                        contacts = trouble.getEmergencyContacts();
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

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.mainmenu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.mainmenu_contacts) {
            Log.d(TAG, "onOptionsItemSelected: " + trouble.toString());
            Log.d(TAG, "onOptionsItemSelected: " + contacts[0]);
//            startActivity(new Intent(this, EmergencyContactsActivity.class));
            Intent intent = new Intent(this, EmergencyContactsActivity.class);
            Gson gson = new Gson();
            String myJson = gson.toJson(trouble);
            intent.putExtra("trouble", myJson);
            Log.d(TAG, "onOptionsItemSelected: " + myJson);
//            intent.putExtra("trouble", trouble);
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

    private void getCurrentUser() {
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
                        contacts = trouble.getEmergencyContacts();
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


    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        Log.d(TAG, "onSensorChanged: Entered");
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }
}
