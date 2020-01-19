package com.example.leoadmin;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;

public interface UserInterfaceAPI {
    //To get the users
    @GET("allUsers")
    Call<List<Trouble>> getUsers();

    @POST("markMobileUser")
    Call<User> addUser(@Body User user);
}
