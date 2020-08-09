package com.example.leoadmin.ui.intro;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.example.leoadmin.R;
import com.example.leoadmin.UserInterfaceAPI;
import com.example.leoadmin.Utils;
import com.example.leoadmin.models.DRO;
import com.example.leoadmin.models.Token;
import com.example.leoadmin.ui.login.LoginActivity;
import com.example.leoadmin.ui.main.MainActivity;

import java.security.MessageDigest;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class IntroActivity extends AppCompatActivity {
    private String SHARED_PREFERENCE_PATH = "com.rohit2810.leo_admin.Login";
    private String TAG = "IntroActivity";
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_intro);
        getSupportActionBar().hide();
        setupRetrofit();
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                checkLogin();
            }
        }, 750);
    }

    void checkLogin() {
        SharedPreferences preferences = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE);
        if(preferences.getString("token", "").isEmpty()) {
            startActivity(new Intent(IntroActivity.this, LoginActivity.class));
            finish();
            return;
        }
        Call<Token> call = userInterfaceAPI.loginDro(new
                DRO(preferences.getString("username", " "),
                new Utils().getPass(preferences)));
        call.enqueue(new Callback<Token>() {
            @Override
            public void onResponse(Call<Token> call, Response<Token> response) {
                if (!response.isSuccessful()) {
                    startActivity(new Intent(IntroActivity.this, LoginActivity.class));
                    finish();
                    return;
                }

                Log.d("", response.body().getToken());
                if (response.body().getToken().isEmpty()) {
                    Toast.makeText(getApplicationContext(), "Invalid username or password", Toast.LENGTH_SHORT).show();
                    return;
                }
                SharedPreferences.Editor editor = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE).edit();
                editor.putString("token", response.body().getToken());
                editor.apply();
                startActivity(new Intent(IntroActivity.this, MainActivity.class));
                finish();
            }

            @Override
            public void onFailure(Call<Token> call, Throwable t) {
                startActivity(new Intent(IntroActivity.this, LoginActivity.class));
                finish();
                Log.d(TAG, t.getMessage());
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


}