package com.example.leoadmin;

import com.example.leoadmin.models.DRO;
import com.example.leoadmin.models.Token;
import com.example.leoadmin.models.Trouble;
import com.example.leoadmin.models.User;
import com.example.leoadmin.models.Username;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;


public interface UserInterfaceAPI {
    //To get the users
    @POST("dro/all_users")
    Call<List<Trouble>> getUsers(@Body DRO dro);


    @POST("user/sms_trouble")
    Call<User> addUser(@Body User user);

    @PUT("user/unmark_trouble")
    Call<User> unmarkTrouble(@Body Username username);

    @POST("dro/login")
    Call<Token> loginDro(@Body DRO dro);

}
