package com.rohit2810.leo.Activity;

import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.rohit2810.leo.App;
import com.rohit2810.leo.Interface.UserInterfaceAPI;
import com.rohit2810.leo.Model.Trouble;
import com.rohit2810.leo.R;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;

public class EmergencyContactsActivity extends AppCompatActivity {
    EditText etPhone1, etPhone2, etPhone3, etPhone4, etPhone5;
    Button btnSubmit;
    String[] list;
    public Retrofit retrofit;
    private FusedLocationProviderClient client;
    private double latitude, longitude;
    String name;
    public UserInterfaceAPI userInterfaceAPI;
    private static final String TAG = "EmergencyContacts";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_emergency_contacts);
        list = new String[5];
        setupPage();
        client = LocationServices.getFusedLocationProviderClient(this);
        setupRetrofit();
//        name = getIntent().getStringExtra("name");
        checkUpdate();
        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int k = getContacts();
                if(k > 2) {
                    getLocation();
                    Trouble trouble = new Trouble(App.name, latitude, longitude, false, "", list);
                    addEmergencyContacts(trouble);
                    finish();
                    Log.d(TAG, "onClick: " + trouble.getUsername());
                }else {
                    Toast.makeText(EmergencyContactsActivity.this, "Please enter atleast 3 emergency numbers", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void setupPage() {
        etPhone1 = findViewById(R.id.contacts_etPhone1);
        etPhone2 = findViewById(R.id.contacts_etPhone2);
        etPhone3 = findViewById(R.id.contacts_etPhone3);
        etPhone4 = findViewById(R.id.contacts_etPhone4);
        etPhone5 = findViewById(R.id.contacts_etPhone5);
        btnSubmit = findViewById(R.id.contacts_btnSubmit);
    }

    private void checkUpdate() {
        int i = 0, k;
        Gson gson = new Gson();
        Trouble trouble = gson.fromJson(getIntent().getStringExtra("trouble"), Trouble.class);
        if(trouble == null) {
            return;
        }
        list = trouble.getEmergencyContacts();
        while (list[i] != null) {
            k = i + 1;
            String res = "contacts_etPhone" + k;
            Log.d(TAG, "checkUpdate: " + res);
            int id = getResources().getIdentifier(res, "id", getPackageName());
            EditText editText = findViewById(id);
            editText.setText(list[i]);
            i++;
        }
    }

    private void addEmergencyContacts(Trouble trouble) {
        Call<Trouble> call = userInterfaceAPI.createTrouble(trouble);
        call.enqueue(new Callback<Trouble>() {
            @Override
            public void onResponse(Call<Trouble> call, Response<Trouble> response) {
                if(!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                    return;
                }
                Log.d(TAG, "onResponse: " + response.toString());
                Intent intent = new Intent(EmergencyContactsActivity.this, MainActivity.class);
                intent.putExtra("latitude", latitude);
                intent.putExtra("longitude", longitude);
                startActivity(intent);
                finish();
            }

            @Override
            public void onFailure(Call<Trouble> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });
    }

    private void setupRetrofit() {
        retrofit = new Retrofit.Builder()
                .baseUrl("http://"+ App.retrofitAdd + ":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }

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
                }
            }
        }, Looper.myLooper());
    }

    private int getContacts() {
        int count = 0;
        if(!etPhone1.getText().toString().isEmpty()) {
            list[count] = etPhone1.getText().toString();
            count++;
        }
        if(!etPhone2.getText().toString().isEmpty()) {
            list[count] = etPhone2.getText().toString();
            count++;
        }
        if(!etPhone3.getText().toString().isEmpty()) {
            list[count] = etPhone3.getText().toString();
            count++;
        }
        if(!etPhone4.getText().toString().isEmpty()) {
            list[count] = etPhone4.getText().toString();
            count++;
        }
        if(!etPhone5.getText().toString().isEmpty()) {
            list[count] = etPhone5.getText().toString();
            count++;
        }
        return count;
    }
}
