package com.example.leo.Activity;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

public class RegisterActivity extends AppCompatActivity {
    EditText etName, etPass, etName2, etConPass, etPhone;
    Button btnRegister;
    Retrofit retrofit;
    UserInterfaceAPI userInterfaceAPI;
    static final String path = "com.example.leo.Login";
    SharedPreferences.Editor editor;
    String name, name2;
    private static final String TAG = "RegisterActivityTag";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);
        setupPage();
        setupRetrofit();
        btnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                App.name = etName.getText().toString();
                name2 = etName2.getText().toString();
                String pass = etPass.getText().toString();
                String pass2 = etConPass.getText().toString();
                String phone = etPhone.getText().toString();
                if(App.name.isEmpty() || pass.isEmpty() || name2.isEmpty() || pass2.isEmpty() || phone.isEmpty()) {
                    Toast.makeText(RegisterActivity.this, "Please fill all the fields", Toast.LENGTH_SHORT).show();
                }else if(!pass.equals(pass2)) {
                    Toast.makeText(RegisterActivity.this, "Password does not match", Toast.LENGTH_SHORT).show();
                }else {
                    createUser(new User(App.name, hash(pass), name2, phone));
                }
            }
        });
    }

    private void setupPage() {
        etName = findViewById(R.id.register_etName);
        etPass = findViewById(R.id.register_etPass);
        etName2 = findViewById(R.id.register_etName2);
        etPhone = findViewById(R.id.register_etPhone);
        etConPass = findViewById(R.id.register_etConPass);
        btnRegister = findViewById(R.id.register_btnRegister);
        editor = getSharedPreferences(path, MODE_PRIVATE).edit();
    }

    private void createUser(final User user) {
        Log.d(TAG, "createUser: " + user);
        Call<User> call = userInterfaceAPI.createUser(user);
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                if (!response.isSuccessful()) {
                    Log.d(TAG, "onResponse: " + response.body());
                    return;
                }
                editor.putString("name", App.name);
                editor.putString("pass", user.getPassword());
                editor.commit();
                Log.d(TAG, "onResponse: " + response.body().getUsername());
                Intent intent = new Intent(RegisterActivity.this, EmergencyContactsActivity.class);
                Log.d(TAG, "onResponse: " + name);
                intent.putExtra("name", name);
                startActivity(intent);
                finish();
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
                .baseUrl("http://" + getString(R.string.ip_address) + ":4001/LeoHelp/")
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
}
