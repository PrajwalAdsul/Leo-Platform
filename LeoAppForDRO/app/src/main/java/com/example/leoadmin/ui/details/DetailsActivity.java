package com.example.leoadmin.ui.details;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.example.leoadmin.App;
import com.example.leoadmin.R;
import com.example.leoadmin.models.User;
import com.example.leoadmin.UserInterfaceAPI;
import com.example.leoadmin.models.Username;
import com.example.leoadmin.ui.main.MainActivity;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class DetailsActivity extends AppCompatActivity implements OnMapReadyCallback{
    private String SHARED_PREFERENCE_PATH = "com.rohit2810.leo_admin.Login";
    private static final String TAG = "DetailsActivity";
    TextView tvName, tvLatitude, tvLongitude, tvContacts, tvEmail, tvFullname;
    FloatingActionButton fab;
    private GoogleMap mMap;
    UserInterfaceAPI userInterfaceAPI;
    Retrofit retrofit;
    int index;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);
        try {
            index = getIntent().getIntExtra("index", 0);
            setupRetrofit();
            tvName = findViewById(R.id.details_tvName);
            tvLatitude = findViewById(R.id.details_tvLatitude);
            tvLongitude = findViewById(R.id.details_tvLongitude);
            tvContacts = findViewById(R.id.details_tvContacts);
            fab = findViewById(R.id.floatingActionButton);
            SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                    .findFragmentById(R.id.map);
            mapFragment.getMapAsync(this);
            tvName.setText("Username: " + App.list.get(index).getUsername());
            tvLatitude.setText("Latitude: " + App.list.get(index).getLatitude());
            tvLongitude.setText("Longitude: " + App.list.get(index).getLongitude());
            String[] contacts = App.list.get(index).getEmergencyContacts();
            Log.d("DetailsActivity", contacts.toString());
            String con = "";
            int i = 0;
            if(contacts.length != 0) {
                for (String contact: contacts) {
                    if(contact != null && !contact.isEmpty()) {
                        con += i + 1 + ". " + contact + "\n";
                        i++;
                    }
                }
            }
            tvContacts.setText(con);
            fab.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    unmarkTrouble(App.list.get(index).getUsername());
                }
            });
        }catch (Exception e) {
            Toast.makeText(this, e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
        }

    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(App.list.get(index).getLatitude(), App.list.get(index).getLongitude());
        mMap.addMarker(new MarkerOptions().position(sydney).title("User Location"));
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(sydney, 18f));
    }

    private void setupRetrofit() {
        String BASE_URL = "https://peaceful-refuge-01419.herokuapp.com/LeoHelp/";
        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }

    public void unmarkTrouble(String name) {
        Log.d("DetailsActivity", "Entered " + name);
        SharedPreferences sharedPreferences = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE);
        String token = sharedPreferences.getString("token", "");
        Call<User> call = userInterfaceAPI.unmarkTrouble(new Username(name, token));
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(!response.isSuccessful()) {
//                    Log.d("DetailsActivity", "Request failed");
                    Toast.makeText(getApplicationContext(), "Something went wrong", Toast.LENGTH_SHORT).show();
                    return;
                }
                Toast.makeText(getApplicationContext(), "User Unmarked from trouble", Toast.LENGTH_SHORT).show();
                goBack();
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Toast.makeText(getApplicationContext(), "Something went wrong", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void goBack() {
        startActivity(new Intent(this, MainActivity.class));
        finish();
        App.list.remove(index);
    }
}
