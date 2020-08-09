package com.example.leoadmin.ui.main;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.leoadmin.R;
import com.example.leoadmin.models.Trouble;

import java.util.ArrayList;

public class MyAdapter extends RecyclerView.Adapter<MyAdapter.ViewHolder> {
    Context context;
    ArrayList<Trouble> list;

    public interface TroubleClicked{
        void onClicked(int pos);
    }

    TroubleClicked activity;
    private static final String TAG = "MyAdapter";
    public MyAdapter(Context context, ArrayList<Trouble> list) {
        this.context = context;
        this.list = list;
        this.activity = (TroubleClicked) context;
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvLatitude, tvLongitude, tvContacts;
        public ViewHolder(@NonNull final View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.row_tvName);
//            tvLatitude = itemView.findViewById(R.id.row_tvLatitude);
//            tvLongitude = itemView.findViewById(R.id.row_tvLongitude);
            tvContacts = itemView.findViewById(R.id.row_tvContact);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    activity.onClicked(list.indexOf(itemView.getTag()));
                }
            });
        }
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.row_item, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Log.d(TAG, "onBindViewHolder: " + "Entered");
        holder.itemView.setTag(list.get(position));
        holder.tvName.setText(list.get(position).getUsername());
//        holder.tvLatitude.setText("Latitude: " + list.get(position).getLatitude());
//        holder.tvLatitude.setVisibility(View.INVISIBLE);
//        holder.tvLongitude.setText("Longitude: " + list.get(position).getLongitude());
//        holder.tvLongitude.setVisibility(View.INVISIBLE);
        if(list.get(position).getSingleContact() != null) {
            holder.tvContacts.setText("Emergency Contact: " + list.get(position).getSingleContact());
        }
    }


    @Override
    public int getItemCount() {
        return list.size();
    }
}
