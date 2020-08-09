# Leo App

Users can view crime precautions and news in their region and can mark or unmark themselves in trouble. The app also provides crime hotspots in particular region.

The app is written in Kotlin and based on [MVVM (Model-View-ViewModel)](https://developer.android.com/jetpack/guide) architecture.

### Notable Features

- Travel Safe
  - Intuitive map of crime hotspots in your region.
  - Crime hotspots are colored according to frequency of crimes in region.
- Recent Crime News
  - Get to know recent crime incidents in your region.
- Live location tracking
  - The location is stored locally on your smartphone.
  - Remembers your last location.
  - User can explicity share location via different platforms.
  - Location is implicitly shared only when trouble is detected.
- SMS Notification
  - Peers are notified via SMS when user is detected in trouble
- Power Button Detection
  - Trouble is detected when power button is pressed 5 times.
- WiFi Direct
  - To create P2P connections with nearby peers so trouble detection can seamlessly work even when there is no cellular reception.
- Fall Detection
  - Detecting trouble when mobile falls using algorithm applied on data received through accelerometer sensor.
- Quick Settings Tile
  - Quick settings tile in system panel to easily notify when you are in trouble.

## Installation

1. Clone the repository from github or download it as a zip
2. Unzip the github project to a folder (only if you downloaded it).
3. Open Android Studio.
4. Go to `File -> New -> Import Project`. Then choose the `Leo_Kotlin` folder and then click `Next->Finish`.
5. It will build the Gradle automatically and will be ready for use (make sure you are connected to internet).
6. In some versions of Android Studio a certain error occurs-
   `error:package android.support.v4.app does not exist.`
   To fix it go to `Gradle Scripts -> build.gradle(Module:app)` and the add the dependecies:

```java
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'androidx.appcompat:appcompat:1.1.0'
}
```

## Directory structure

```text
.
├── app ->  Containes the application relevant files
│   ├── build.gradle(app-level) ->  To automate and manage the build process
│   ├── debug -> Contains debug version of apk
│   ├── release -> Contains release version of apk
│   └── src -> Contains source files for the application
│       ├── main -> Contains all the source code files
│       │   ├── AndroidManifest.xml -> Describes essential information about app
│       │   ├── java/com/rohit2810/leo_kotlin
│       │   │    ├── Application.kt -> Base class containing components like Activities and Services
│       │   │    ├── MainActivity.kt -> Base activity for all fragments
│       │   │    ├── database -> Contains all the database related files
│       │   │    ├── models -> Contains all the model classes
│       │   │    ├── network -> Contains interfaces to simplify api calls
│       │   │    ├── receivers -> Contains receivers for power button and notifications
│       │   │    ├── repository -> Contains design patterns that isolates data sources from the rest of the app
│       │   │    ├── services
│       │   │    ├── ui -> Contains the UI files for every fragments
│       │   │    │   ├── emergencyContacts
│       │   │    │   ├── intro
│       │   │    │   ├── login
│       │   │    │   ├── main
│       │   │    │   ├── map
│       │   │    │   ├── news
│       │   │    │   ├── otp
│       │   │    │   ├── permissionRequest
│       │   │    │   ├── register
│       │   │    │   ├── settings
│       │   │    │   └── splash
│       │   │    └── utils -> Contains the utility functions
│       │   └── res -> Contains resource files written in xml for the application
│       │       ├── anim -> Contains animation files
│       │       ├── drawable -> Contains logos and vector assets
│       │       ├── layout -> Contains layout files for every fragment
│       │       ├── menu -> Contains layout file for menu
│       │       ├── navigation -> Contains navigation graph
│       │       ├── raw -> Contains lottie animation files
│       │       ├── values -> Contains values of colors, strings etc
│       │       └── xml-> Contains xml file for network security config
└── build.gradle -> To automate and manage the build process
```

## Building an APK

1. Go to `Build -> Generate Signed APK`
2. Choose `APK -> Next`
3. If you already have keystore use that otherwise click on `Create New`. Fill in the form with the required details. Click on the icon on the right with the 3 dots ("..."), which will open up a navigator window asking you to navigate and select a `.jks` file. Navigate to a folder where you want your keystore file saved.
4. Create a key for your application and fill in all the required details.
5. Click on Next and then select Release.
6. You will get popup indicating the apk file path when android studio finishes build.

## Technogolies / Frameworks Used

- [Jetpack Navigation](https://developer.android.com/guide/navigation) - Helps in implementing navigation across different fragments.
- [Android lifecycle extension](https://developer.android.com/jetpack/androidx/releases/lifecycle) - Components which help you produce better-organized, and often lighter-weight code, that is easier to maintain.
- [Retrofit](https://square.github.io/retrofit/) - Retrofit is the class through which your API interfaces are turned into callable objects. Used to make network requests in android.
- [Moshi](https://github.com/square/moshi) - Modern JSON library for Android and Java
- [Lottie](https://github.com/airbnb/lottie-android) - Mobile library for Android and iOS that parses Adobe After Effects animations
- [Glide](https://github.com/bumptech/glide) - Fast and efficient open source media management and image loading framework
- [Room Persistence](https://developer.android.com/topic/libraries/architecture/room) - Provides an abstraction layer over SQLite.
- [Data Binding](https://developer.android.com/topic/libraries/data-binding) - Support library that allows to bind UI components in layouts to data sources in app
