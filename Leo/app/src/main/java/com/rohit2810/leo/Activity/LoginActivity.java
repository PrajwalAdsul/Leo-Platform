package com.rohit2810.leo.Activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.rohit2810.leo.App;
import com.rohit2810.leo.Interface.UserInterfaceAPI;
import com.rohit2810.leo.Model.User;
import com.rohit2810.leo.R;

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

public class LoginActivity extends AppCompatActivity {
    EditText etName, etPass;
    Button btnLogin, btnRegister;
    private static final String TAG = "LoginActivityTag";
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    static final String path = "com.example.leo.Login";
    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    String pass;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        setupPage();
        requestPermisssion();
        setupRetrofit();
        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                App.name = etName.getText().toString();
                pass = etPass.getText().toString();

                if(App.name.isEmpty() || pass.isEmpty()) {
                    Log.d(TAG, "onClick: " + "Entered");
                    Toast.makeText(LoginActivity.this, "Please fill all the fields", Toast.LENGTH_SHORT).show();
                }else {
                    checkUser(new User(App.name, hash(pass)));
                }
            }
        });

        btnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                startActivity(new Intent(LoginActivity.this, RegisterActivity.class));
                finish();
            }
        });
    }

    private void setupPage() {
        etName = findViewById(R.id.register_etName);
        etPass = findViewById(R.id.register_etPass);
        btnLogin = findViewById(R.id.register_btnRegister);
        btnRegister = findViewById(R.id.login_btnRegister);
        editor = getSharedPreferences(path, MODE_PRIVATE).edit();
    }

    private void checkUser(User user) {
        Log.d(TAG, "checkUser: " + user);
        Call<User> call = userInterfaceAPI.checkUser(user);
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if(response.code() == 400) {
                    Toast.makeText(LoginActivity.this, "Invalid username or password", Toast.LENGTH_SHORT).show();
                }else if(response.code() == 200) {
                    editor.putString("name", App.name);
                    editor.putString("pass", hash(pass));
                    editor.commit();
                    startActivity(new Intent(LoginActivity.this, MainActivity.class));
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
                .baseUrl("http://" +  App.retrofitAdd +":4001/LeoHelp/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        userInterfaceAPI = retrofit.create(UserInterfaceAPI.class);
    }


    private String hash(String input) {
        try {
            // getInstance() method is called with algorithm SHA-512
            MessageDigest md = MessageDigest.getInstance("SHA-512");

            // digest() method is called
            // to calculate message digest of the input string
            // returned as array of byte
            byte[] messageDigest = md.digest(input.getBytes());

            // Convert byte array into signum representation
            BigInteger no = new BigInteger(1, messageDigest);

            // Convert message digest into hex value
            String hashtext = no.toString(16);

            // Add preceding 0s to make it 32 bit
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }

            // return the HashText
            return hashtext;
        }

        // For specifying wrong message digest algorithms
        catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private void requestPermisssion() {
        ActivityCompat.requestPermissions(this, new String[]{ACCESS_FINE_LOCATION, ACCESS_BACKGROUND_LOCATION, ACCESS_COARSE_LOCATION, READ_SMS, SEND_SMS}, 1);
    }

}
