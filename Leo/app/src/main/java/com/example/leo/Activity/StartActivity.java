package com.example.leo.Activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.example.leo.App;
import com.example.leo.Interface.UserInterfaceAPI;
import com.example.leo.Model.User;
import com.example.leo.R;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import static android.Manifest.permission.ACCESS_BACKGROUND_LOCATION;
import static android.Manifest.permission.ACCESS_COARSE_LOCATION;
import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.READ_SMS;
import static android.Manifest.permission.SEND_SMS;

public class StartActivity extends AppCompatActivity {
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    static final String path = "com.example.leo.Login";
    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    boolean flag = true;
    private static final String TAG = "StartActivity";
    String pass;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_start_activity);
//        requestPermisssion();
        setupRetrofit();
        getSupportActionBar().hide();
        preferences = getSharedPreferences(path, MODE_PRIVATE);
        editor = getSharedPreferences(path, MODE_PRIVATE).edit();
        App.name = preferences.getString("name", "");
        pass = preferences.getString("pass", "");
        if(App.name != null && pass != null && !App.name.isEmpty() && !pass.isEmpty()) {
            Log.d(TAG, "onCreate: " + App.name);
            checkUser(new User(App.name, pass));
        }
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if(flag) {
                    startActivity(new Intent(StartActivity.this, LoginActivity.class));
                    finish();
                }
            }
        }, 1000);
    }

    private void checkUser(User user) {
        Log.d(TAG, "checkUser: " + user);
        Call<User> call = userInterfaceAPI.checkUser(user);
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(response.code() == 400) {
                    Toast.makeText(StartActivity.this, "Invalid username or password", Toast.LENGTH_SHORT).show();
                }else if(response.code() == 200) {
                    flag = false;
                    editor.putString("name", App.name);
                    editor.putString("pass", pass);
                    editor.commit();
                    startActivity(new Intent(StartActivity.this, MainActivity.class));
                    finish();
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                Log.d(TAG, "onFailure: " + t.getLocalizedMessage());
            }
        });
    }

    //Setup the retrofit
    private void setupRetrofit() {
        retrofit = new Retrofit.Builder()
                .baseUrl("http://" +  getString(R.string.ip_address) +":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }




}
