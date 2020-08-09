package com.example.leoadmin.models;

import com.google.gson.annotations.SerializedName;

public class Username {
    @SerializedName("user_name")
    String username;
    String token;

    public Username(String username, String token) {
        this.username = username;
        this.token = token;
    }
}
