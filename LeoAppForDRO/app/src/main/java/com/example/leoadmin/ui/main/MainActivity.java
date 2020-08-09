package com.example.leoadmin.ui.main;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;


import com.example.leoadmin.App;
import com.example.leoadmin.R;
import com.example.leoadmin.Service;
import com.example.leoadmin.Utils;
import com.example.leoadmin.models.DRO;
import com.example.leoadmin.models.Trouble;
import com.example.leoadmin.UserInterfaceAPI;
import com.example.leoadmin.ui.details.DetailsActivity;
import com.example.leoadmin.ui.login.LoginActivity;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.READ_SMS;
import static android.Manifest.permission.RECEIVE_SMS;
import static android.Manifest.permission.SEND_SMS;

public class MainActivity extends AppCompatActivity implements MyAdapter.TroubleClicked {
    private String SHARED_PREFERENCE_PATH = "com.rohit2810.leo_admin.Login";
    private static final String TAG = "MainActivityTag";
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    RecyclerView recyclerView;
    ProgressBar progressBar;
    MyAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        recyclerView = findViewById(R.id.rvList);
        progressBar = findViewById(R.id.progressBar);
        App.list = new ArrayList<>();
        requestPermisssion();
        setupRetrofit();
        getTroubles();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Thread.sleep(2 * 60 * 1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    Log.d(TAG, "run: " + "Entered");
                    getContinuosTroubles();
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

    }

    private void getTroubles() {
        SharedPreferences preferences = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE);
        Call<List<Trouble>> call = userInterfaceAPI.getUsers(new DRO("drodrodro",
                new Utils().getPass(preferences), preferences.getString("token", "")));
        call.enqueue(new Callback<List<Trouble>>() {
            @Override
            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                    return;
                }
                List<Trouble> list2 = response.body();
                App.list.clear();
                for (Trouble trouble : list2) {
                    Log.d("MainActivity", trouble.toString());
                    if (trouble.isInTrouble()) {
                        App.list.add(trouble);
                        Log.d(TAG, "onResponse: " + App.list.get(0).toString());
                    }
                }
                setupRecyclerView();
            }

            @Override
            public void onFailure(Call<List<Trouble>> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
                progressBar.setVisibility(View.GONE);
                Toast.makeText(getApplicationContext(), t.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            }
        });

    }

    private void setupRetrofit() {
        String BASE_URL = "https://peaceful-refuge-01419.herokuapp.com/LeoHelp/";
        retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }

    private void setupRecyclerView() {

        adapter = new MyAdapter(MainActivity.this, App.list);
        recyclerView.setLayoutManager(new LinearLayoutManager(MainActivity.this));
        recyclerView.setAdapter(adapter);
        recyclerView.setHasFixedSize(true);
        RecyclerView.ItemDecoration decoration = new DividerItemDecoration(MainActivity.this, DividerItemDecoration.VERTICAL);
//        recyclerView.addItemDecoration(decoration);
        progressBar.setVisibility(View.GONE);
        recyclerView.setVisibility(View.VISIBLE);
    }

    @Override
    public void onClicked(int pos) {
        Intent intent = new Intent(MainActivity.this, DetailsActivity.class);
        Log.d("MainActivity", String.valueOf(pos));
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

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.main_menu_login:
                stopService();
                SharedPreferences.Editor editor = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE).edit();
                editor.clear();
                editor.apply();
                startActivity(new Intent(MainActivity.this, LoginActivity.class));
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private void getContinuosTroubles() {
        SharedPreferences preferences = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE);
        Call<List<Trouble>> call = userInterfaceAPI.getUsers(new DRO("drodrodro",
                new Utils().getPass(preferences), preferences.getString("token", "")));
        call.enqueue(new Callback<List<Trouble>>() {
            @Override
            public void onResponse(Call<List<Trouble>> call, Response<List<Trouble>> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.code());
                    return;
                }
                boolean flag = false;
                List<Trouble> list2 = response.body();
                App.list.clear();
                for (Trouble trouble : list2) {
                    Log.d("MainActivity", trouble.toString());
                    if (trouble.isInTrouble()) {
//                        if (!App.list.contains(trouble)) {
                        App.list.add(trouble);
//                            flag = true;
//                        }
//                        Log.d(TAG, "onResponse: " + App.list.get(0).toString());
                    }
                }
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onFailure(Call<List<Trouble>> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
                progressBar.setVisibility(View.GONE);
                Toast.makeText(getApplicationContext(), t.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
            }
        });

    }


}
