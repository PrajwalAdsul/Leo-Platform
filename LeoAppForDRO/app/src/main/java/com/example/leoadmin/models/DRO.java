package com.example.leoadmin.models;

public class DRO {
    private String user_name;
    private String password;
    private String token;

    public DRO(String user_name, String password) {
        this.user_name = user_name;
        this.password = password;
    }

    public DRO(String user_name, String password, String token) {
        this.user_name = user_name;
        this.password = password;
        this.token = token;
    }
}
