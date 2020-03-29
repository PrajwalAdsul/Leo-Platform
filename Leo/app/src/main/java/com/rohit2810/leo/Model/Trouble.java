package com.rohit2810.leo.Model;

import com.google.gson.annotations.SerializedName;

import java.util.Arrays;

public class Trouble {
    @SerializedName("user_name")
    private String username;
    private double latitude;
    private double longitude;
    private boolean inTrouble;
    private String[] emergencyContacts;
    private String area;

    public Trouble(String username, double latitude, double longitude, boolean inTrouble, String area, String[] emergencyContacts) {
        this.username = username;
        this.latitude = latitude;
        this.longitude = longitude;
        this.inTrouble = inTrouble;
        this.area = area;
        this.emergencyContacts = emergencyContacts;
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

    public String[] getEmergencyContacts() {
        return emergencyContacts;
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
}
