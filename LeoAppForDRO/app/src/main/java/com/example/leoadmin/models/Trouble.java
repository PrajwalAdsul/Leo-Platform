package com.example.leoadmin.models;


import com.google.gson.annotations.SerializedName;

import java.util.Arrays;

public class Trouble {
    @SerializedName("user_name")
    private String username;
    private double latitude;
    private double longitude;
    private boolean inTrouble;
    private String email;
    private String name;
    private String[] emergencyContacts;
    private String area;
    private String phone;

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Trouble{" +
                "username='" + username + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", inTrouble=" + inTrouble +
                ", emergencyContacts=" + Arrays.toString(emergencyContacts) +
                ", area='" + area + '\'' +
                '}';
    }

    public Trouble(String username, double latitude, double longitude, boolean inTrouble, String area, String[] emergencyContacts, String phone) {
        this.username = username;
        this.latitude = latitude;
        this.longitude = longitude;
        this.inTrouble = inTrouble;
        this.area = area;
        this.emergencyContacts = emergencyContacts;
        this.phone = phone;
    }

    public Trouble(String username, double latitude, double longitude, boolean inTrouble) {
        this.username = username;
        this.latitude = latitude;
        this.longitude = longitude;
        this.inTrouble = inTrouble;
    }

    public String getUsername() {
        return username;
    }

    public boolean isInTrouble() {
        return inTrouble;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }


    public String getSingleContact() {
        if (phone != null) {
            return phone;
        }
        if(emergencyContacts.length != 0) {
            if (emergencyContacts[0] != null) {
                return emergencyContacts[0];
            }else {
                return " ";
            }
        }else {
            return " ";
        }
    }

    public String[] getEmergencyContacts() {
        return emergencyContacts;
    }
}
