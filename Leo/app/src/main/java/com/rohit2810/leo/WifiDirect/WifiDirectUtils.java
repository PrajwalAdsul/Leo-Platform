package com.rohit2810.leo.WifiDirect;

import android.os.Handler;
import android.os.Message;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class WifiDirectUtils {

    static final int MESSAGE_READ = 1;
    ServerClass serverClass;
    ClientClass clientClass;
    SendReceive sendReceive;

    private static final String TAG = "WifiDirectUtils";

    public static Handler handler = new Handler(new Handler.Callback() {
        @Override
        public boolean handleMessage(Message msg) {
            switch(msg.what) {
                case MESSAGE_READ:
                    byte[] readBuff = (byte[]) msg.obj;
//                    String prevText = read_msg_box.getText().toString();
                    String tempMsg = new String(readBuff, 0, msg.arg1);
//                    Log.d("Handler Line 81", tempMsg);
                    Log.d(TAG, "handleMessage: " + tempMsg);
//                    read_msg_box.setText(prevText + "\n" + tempMsg);
                    Log.d("Handler Line 83", tempMsg);
                    break;
            }
            return true;
        }
    });

    public class ServerClass extends Thread {
        Socket socket;
        ServerSocket serverSocket;

        @Override
        public void run() {
            try {
                serverSocket = new ServerSocket(9869);
//                Log.d("In ServerClass line 245", serverSocket.toString());
                Log.d(TAG, "run: Line 51 " + serverSocket.toString());
                socket = serverSocket.accept();
                sendReceive = new SendReceive(socket);
                sendReceive.start();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private class SendReceive extends Thread {
        private Socket socket;
        private InputStream inputStream;
        private OutputStream outputStream;

        public SendReceive(Socket skt) {
            socket = skt;
            try {
                inputStream = socket.getInputStream();
                Log.d(TAG, "SendReceive: Line 70 " + inputStream.toString());
//                Log.d("In sendRecv line 273", inputStream.toString());
                outputStream = socket.getOutputStream();
//                Log.d("In sendRecv line 275", outputStream.toString());
                Log.d(TAG, "SendReceive: line 74 " + outputStream.toString() );
            } catch (IOException e) {
                e.printStackTrace();
            }
        }


        @Override
        public void run() {
            byte[] buffer = new byte[1024];
            int bytes;
            while (socket != null) {
                try {
                    bytes = inputStream.read(buffer);
                    Log.d("sendReceiveRun Line 285", socket.toString());
                    if(bytes > 0) {
                        Log.d("handlerProcess Line 292", socket.toString());
                        handler.obtainMessage(MESSAGE_READ, bytes, -1, buffer).sendToTarget();
                        Log.d("handlerDone Line 294", socket.toString());
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    socket = null;
                    Log.d("sRError Run Line 291", e.toString());
                }
            }
            Log.d("WasSocketNULL? Line 299", socket.toString());
        }
        public void write(final byte[] bytes) {
            new Thread(new Runnable(){
                @Override
                public void run() {
                    try {
                        Log.d("In Write line 320", bytes.toString());
                        outputStream.write(bytes);
                        Log.d("In Write line 322", bytes.toString());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }).start();
        }
    }

    public class ClientClass extends Thread {
        Socket socket;
        String hostAdd;

        public ClientClass(InetAddress hostAddress) {
            hostAdd = hostAddress.getHostAddress();
            socket = new Socket();
        }

        @Override
        public void run() {
            try {
                socket.connect(new InetSocketAddress(hostAdd, 9869), 500);
                Log.d("In ServerClass line 245", socket.toString());
                Log.d("In ServerClass line 246", hostAdd.toString());
                sendReceive = new SendReceive(socket);
                sendReceive.start();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void startClient(InetAddress hostAddress) {
        clientClass = new ClientClass(hostAddress);
        clientClass.start();
    }

    public void startServer() {
        serverClass = new ServerClass();
        serverClass.start();
    }


    public void writeMessage(String message) {
        sendReceive.write(message.getBytes());
    }

}
