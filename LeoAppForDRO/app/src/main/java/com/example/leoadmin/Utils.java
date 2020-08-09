package com.example.leoadmin;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import java.security.MessageDigest;

public class Utils{

//    private SharedPreferences preferences;
    public Utils() {
//        this.preferences = preferences;
    }

    public String sha256(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(text.getBytes("UTF-8"));
            StringBuffer hexString = new StringBuffer();

            for (int i = 0; i < hash.length; i++) {
                String hex = Integer.toHexString(0xff & hash[i]);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
//            Log.d(TAG, hexString.toString());
            return hexString.toString();
        } catch (Exception ex) {
//            Log.d(TAG, "Wrong Hash");
            throw new RuntimeException(ex);
        }
    }

    public String getPass(SharedPreferences preferences) {
        return sha256(preferences.getString("username", " ") + preferences.getString("password", " "));
    }
}