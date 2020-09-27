# Riive Shareparking App
This is a backup of Riive, a shareparking app currently in development. You can view my portfolio writeup about it here: https://www.christopherfrydryck.cf/Riive.html

🎉 Big news! We are now upgraded to Expo SDK 36.0.0 (RN 61.4). We are currently working on bug fixes and regression testing, but everything is going smooth (as of now).

This app is built on React Native and expo.  To test the app, first run `npm install` to ensure the node modules are up to date. Then run `expo r -c` to run the expo app as a local host and cleared cache.  You can create an account via on the sign up screen with fake info for now and it will update in the Firebase DB.

To run the app, open the ios folder in Xcode and android in Android Studio, followed by building and running.

## To be completed:
+ Ability to add a location (In progress)
+ ~~Add edit payment screen~~
+ Add settings and promo screen
+ ~~Integrate tipsi-stripe for PCI compliance payment vendor~~
+ ~~Begin google maps integration~~

Of course there is more, but these are key milestones.

## Changelog
```json
{
    "versions": [{
        "release": "1.0.0",
        "major": 1,
        "minor": 0,
        "patch": 0,
        "isBeta": false,
        "isReleased": true,
        "contributors": [{
            "name": "Christopher Frydryck",
            "email": "chris@riive.net",
            "userID": "e8clD1B96thKlXRSA2lKUQW74mU2",
            "photo": "https://firebasestorage.googleapis.com/v0/b/riive-parking.appspot.com/o/users%2Fe8clD1B96thKlXRSA2lKUQW74mU2%2Fprofile-pic?alt=media&token=f79aed94-2030-4ef7-b72b-65b01d6bf414"
        }],
        "description": "",
        "added": "",
        "changed": "",
        "deprecated": "",
        "removed": "",
        "fixed": "",
        "security": "",
        "date": "Tue 25 Sep 2020 22:07:13 GMT-0400",
        "dateUnix": 1601093235528
    },
    {
        "release": "1.0.1",
        "major": 1,
        "minor": 0,
        "patch": 1,
        "isBeta": true,
        "isReleased": false,
        "contributors": [{
            "name": "Christopher Frydryck",
            "email": "chris@riive.net",
            "userID": "e8clD1B96thKlXRSA2lKUQW74mU2",
            "photo": "https://firebasestorage.googleapis.com/v0/b/riive-parking.appspot.com/o/users%2Fe8clD1B96thKlXRSA2lKUQW74mU2%2Fprofile-pic?alt=media&token=f79aed94-2030-4ef7-b72b-65b01d6bf414"
        }],
        "description": "",
        "added": "",
        "changed": "",
        "deprecated": "",
        "removed": "",
        "fixed": "",
        "security": "",
        "date": "Tue 16 Sep 2020 13:07:41 GMT-0400",
        "dateUnix": 1700283261000
    }]
}
```