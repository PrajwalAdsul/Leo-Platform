package com.example.leo.Model;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("user_name")
    private String username;
    private String password;
    private String name;
    private String phone;

    public User(String username, String password, String name, String phone) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.phone = phone;
    }

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
