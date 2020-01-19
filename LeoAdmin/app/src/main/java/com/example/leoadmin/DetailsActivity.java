package com.example.leoadmin;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

public class DetailsActivity extends AppCompatActivity implements OnMapReadyCallback{
    private static final String TAG = "DetailsActivity";
    TextView tvName, tvLatitude, tvLongitude, tvContacts;
    private GoogleMap mMap;
    int index;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_details);
        index = getIntent().getIntExtra("index", 0);
        tvName = findViewById(R.id.details_tvName);
        tvLatitude = findViewById(R.id.details_tvLatitude);
        tvLongitude = findViewById(R.id.details_tvLongitude);
        tvContacts = findViewById(R.id.details_tvContacts);
        Log.d(TAG, "onCreate: " + App.list.get(index).toString());
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        tvName.setText("Username: " + App.list.get(index).getUsername());
        tvLatitude.setText("Latitude: " + App.list.get(index).getLatitude());
        tvLongitude.setText("Longitude: " + App.list.get(index).getLongitude());
        String[] contacts = App.list.get(index).getEmergencyContacts();
        String con = "";
        int i = 0;
        if(contacts.length != 0) {
            while (contacts[i] != null) {
                con += i + 1 + ". " + contacts[i] + "\n";
                i++;
            }
        }
        tvContacts.setText(con);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Add a marker in Sydney and move the camera
        LatLng sydney = new LatLng(App.list.get(index).getLatitude(), App.list.get(index).getLongitude());
        mMap.addMarker(new MarkerOptions().position(sydney).title("User Location"));
        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(sydney, 18f));
    }
}
