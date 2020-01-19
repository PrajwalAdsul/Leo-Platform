package com.example.leoadmin;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static android.Manifest.permission.ACCESS_BACKGROUND_LOCATION;
import static android.Manifest.permission.ACCESS_COARSE_LOCATION;
import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.READ_SMS;
import static android.Manifest.permission.RECEIVE_SMS;
import static android.Manifest.permission.SEND_SMS;

public class MainActivity extends AppCompatActivity implements MyAdapter.TroubleClicked {
    private static final String TAG = "MainActivityTag";
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    RecyclerView recyclerView;
    MyAdapter adapter;
    ArrayList<Trouble> troubles;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        recyclerView = findViewById(R.id.rvList);
        App.list = new ArrayList<>();
        requestPermisssion();
//        Log.d(TAG, "onCreate: " + list.get(0));
        setupRetrofit();
        getTroubles();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                while(true) {
                    try{
                        Thread.sleep(10000);
                    }catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    Log.d(TAG, "run: " + "Entered");
                    App.list = new ArrayList<>();
                    getTroubles();
                }
            }
        });
        thread.start();
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                startService();
            }
        }, 500);

//        setupRecyclerView();
    }

    private void getTroubles() {
        Call<List<Trouble>> call = userInterfaceAPI.getUsers();
        call.enqueue(new Callback<List<Trouble>>() {
            @Override
            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                }
                List<Trouble> list2 = response.body();
                for (Trouble trouble : list2) {

                    if(trouble.isInTrouble()) {
                        App.list.add(trouble);
                        Log.d(TAG, "onResponse: " + App.list.get(0).toString());
                    }
                }
                setupRecyclerView();
            }

            @Override
            public void onFailure(Call<List<Trouble>> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });

    }

    private void setupRetrofit() {
        retrofit = new Retrofit.Builder()
                .baseUrl("http://"+ getString(R.string.ip_address) +":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }

    private void setupRecyclerView() {
//        Log.d(TAG, "getTroubles: " + App.list.get(0).toString());

        adapter = new MyAdapter(MainActivity.this, App.list);
        recyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
        recyclerView.setAdapter(adapter);
        recyclerView.setHasFixedSize(true);
        RecyclerView.ItemDecoration decoration = new DividerItemDecoration(MainActivity.this, DividerItemDecoration.VERTICAL);
        recyclerView.addItemDecoration(decoration);
    }

    @Override
    public void onClicked(int pos) {
        Intent intent = new Intent(MainActivity.this, DetailsActivity.class);
        intent.putExtra("index", pos);
        startActivity(intent);
    }

    private void startService() {

        Intent intent = new Intent(this, Service.class);
        ContextCompat.startForegroundService(this, intent);
    }

    private void stopService() {
        Intent intent = new Intent(this, Service.class);
        stopService(intent);
    }

    private void requestPermisssion() {
        ActivityCompat.requestPermissions(this, new String[]{ACCESS_FINE_LOCATION, READ_SMS, SEND_SMS, RECEIVE_SMS}, 1);
    }
}
