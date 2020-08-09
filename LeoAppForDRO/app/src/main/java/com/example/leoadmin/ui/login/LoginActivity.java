package com.example.leoadmin.ui.login;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.example.leoadmin.R;
import com.example.leoadmin.UserInterfaceAPI;
import com.example.leoadmin.Utils;
import com.example.leoadmin.models.DRO;
import com.example.leoadmin.models.Token;
import com.example.leoadmin.models.Trouble;
import com.example.leoadmin.ui.main.MainActivity;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Timer;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class LoginActivity extends AppCompatActivity {
    private String SHARED_PREFERENCE_PATH = "com.rohit2810.leo_admin.Login";
    private String TAG = "LoginActivity";

    EditText username;
    EditText password;
    ProgressBar progressBar;
    Retrofit retrofit;
    Button login;
    private String signature = "LeoPlatform";
    UserInterfaceAPI userInterfaceAPI;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        setupRetrofit();
        username = findViewById(R.id.edit_text_username);
        password = findViewById(R.id.edit_text_pass);
        progressBar = findViewById(R.id.login_progressbar);
        login = findViewById(R.id.btn_login);

        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try {
                    checkLogin();
                    validateLogin();
                } catch (Exception e) {
                    Toast.makeText(getApplicationContext(), e.getLocalizedMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    void checkLogin() throws Exception {
        if (username.getText().toString().isEmpty() || password.getText().toString().isEmpty()) {
            throw new Exception("Please enter valid username and password");
        }
    }

    void validateLogin() throws Exception {
        progressBar.setVisibility(View.VISIBLE);
        login.setVisibility(View.INVISIBLE);
        Call<Token> call = userInterfaceAPI.loginDro(new DRO(username.getText().toString(),
                new Utils().sha256(username.getText().toString() + password.getText().toString())));
        call.enqueue(new Callback<Token>() {
            @Override
            public void onResponse(Call<Token> call, Response<Token> response) {
                progressBar.setVisibility(View.INVISIBLE);
                login.setVisibility(View.VISIBLE);
                if (!response.isSuccessful()) {
                    Log.d(TAG, "Unsuccessful response");
                    Toast.makeText(getApplicationContext(), "Invalid username or password", Toast.LENGTH_SHORT).show();
                    return;
                }
                Log.d("LoginActivity", response.body().getToken());
                if (response.body().getToken().isEmpty()) {
                    Log.d(TAG, "Empty Token");
                    Toast.makeText(getApplicationContext(), "Invalid username or password", Toast.LENGTH_SHORT).show();
                    return;
                }
                SharedPreferences.Editor editor = getSharedPreferences(SHARED_PREFERENCE_PATH, MODE_PRIVATE).edit();
                editor.putString("token", response.body().getToken());
                editor.putString("username", username.getText().toString());
                editor.putString("password", password.getText().toString());
                editor.apply();
                startActivity(new Intent(LoginActivity.this, MainActivity.class));
                finish();
            }

            @Override
            public void onFailure(Call<Token> call, Throwable t) {
                Toast.makeText(getApplicationContext(), "Invalid username or password", Toast.LENGTH_SHORT).show();
                progressBar.setVisibility(View.INVISIBLE);
                login.setVisibility(View.VISIBLE);
                Log.d("LoginActivity", "onFailure: " + t.getMessage());
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