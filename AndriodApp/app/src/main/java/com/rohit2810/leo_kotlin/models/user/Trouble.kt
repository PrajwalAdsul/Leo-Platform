package com.rohit2810.leo_kotlin.models.user

import androidx.annotation.Keep
import com.squareup.moshi.Json

@Keep
data class Trouble(
    @Json(name = "user_name")
    val username: String,
    val latitude: Double? = 0.0,
    val longitude: Double? = 0.0,
    val inTrouble: Boolean,
    var emergencyContacts : MutableList<String?> = mutableListOf<String?>(),
    val token: String,
    var type: String = "app"
)