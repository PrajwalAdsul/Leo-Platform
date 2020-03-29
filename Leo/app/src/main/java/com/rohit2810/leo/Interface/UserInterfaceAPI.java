package com.rohit2810.leo.Interface;

import com.rohit2810.leo.Model.Trouble;
import com.rohit2810.leo.Model.User;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.FieldMap;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;

public interface UserInterfaceAPI {
    //To get the users
    @GET("allUsers")
    Call<List<Trouble>> getUsers();

    //To post the user
    @POST("addUser")
    Call<User> createUser(@Body User user);

    @FormUrlEncoded
    @POST("addUser")
    Call<User> createUser(@Body @FieldMap Map<String, String> map);

    @PUT("markTrouble")
    Call<Trouble> createTrouble(@Body Trouble trouble);

    @POST("login")
    Call<User> checkUser(@Body User user);
}
