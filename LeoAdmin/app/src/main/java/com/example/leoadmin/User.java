package com.example.leoadmin;

public class User {
    private String name;
    private String phone;
    private String area;

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getArea() {
        return area;
    }

    public User(String name, String phone, String area) {
        this.name = name;
        this.phone = phone;
        this.area = area;
    }
}
