# Meeting App (Meeting Planner) 

This application is built to schedule meetings. Typically this web is much more usefull in mid-scale to large-scale companies where there is an interaction involved with 3rd person like receptionist to book conference rooms for meetings. 

Project urls:-

1) Angular :- http://13.233.86.6

   Github Link :- https://github.com/winterprogram/meeting_front

2) Node App :- http://15.206.28.103

    Github Link :- https://github.com/winterprogram/meeting_back

Note :- Node url is protected by Cros, please use localhost:3000 to test Rest apis.

## Installing

### Step - 1

Note : You can skip this steps if you have Node and npm installed on your system.
 
1) To start with this, install node and npm

* [NodeJs](https://nodejs.org/en/) -  to install node (node version >12.0.0)

2) Install git 


* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) -  install Git

3) Use npm to install Angular CLI as shown below

```
npm install -g @angular/cli
```

### Step - 2

```
cd meeting_front
```

1) For windows to install all package dependencies :- 

```
npm install 
```
1) For linus/macOs to install all package dependencies :- 

```
sudo npm install 
```

### Step - 3

To run node server locally

```
ng serve
```

## More about the app

Application consist of:-

1) User Module:-
 a) Signup component :- This module is responsible for registering users and admin by asking basic deatils like firstname, Country, phone no etc.

 b) Login - User/admin are able to login using the email and password provided during signup.

 c) Forgot password - User/admin can reset password using a link which is sent to their registered mail.

2) Dashboard module :-
  
 a) Normal-user-dashboard component - Normal users are redirectred to this dasboard, where they can view meeting scheduled for the day which is assigned by the admin. When the meeting is created by the admin and if the user is online, then user will receive a tost message update and email. Similary, on update and delete of meeting a tost message is visible to the user if they are online. 

 b) Admin-dashboard component - Admin users are redirected to this, in this admin can see all the users and can see all meetings for the users. In this admin can select any user and can create, update and delete meeting. 

3) Meeting Module :-

 a) Creating-meeting - In this module admin can create a new meeting for the user.

 b) update-meeting component - In this compoenent admin can update and delete the user meeting. 


##  Intuitive Thinking

This Angular app is responsive which can be viewed on mobile browser, but in this era of mobile app, there is a always a need of mobile version. So that people using this can access it from any where. 

### Solution 

We can built a cross platform app, which can run on web, android and iOS using same code base, this is only if the main Angular app that we have coded is responsive for mobile. Alternatively, we can use [NativeScript](https://www.nativescript.org/) but in that we have to change few things and also have to learn NativeScript cli. 

To avoid such things we can use [Cordova](https://cordova.apache.org/) or [Capacitor](https://capacitor.ionicframework.com/)

#### What is Cordova and Capacitor?

Cordova wraps your HTML/JavaScript app into a native container which can access the device functions of several platforms. These functions are exposed via a unified JavaScript API, allowing you to easily write one set of code to target nearly every phone or tablet on the market today and publish to their app stores.

Capacitor invoke Native SDKs on iOS, Android, and the Web with one code base. Optimized for Ionic Framework apps, or use with any web app framework like Angular, Vuejs etc. 

In this case will use Capacitor as it very well optimized for web app framework in our case Angular. 

## To run iOS and Android app in our local system

### Step - 1 

To install capacitor

```
npm install --save @capacitor/core @capacitor/cli
```

### Step -2 

To initialize Capacitor with your app information.(Ignore this step as capacitor.config.json is already configured by author)

```
npx cap init
```
Note :- npx is a new utility available in npm 5 or above that executes local binaries/scripts to avoid global installs

### Step - 3 

Install [Android Studio](https://developer.android.com/studio)

Install [Xcode](https://developer.apple.com/xcode/)

### Step - 4

To run android app using Android studio, run below command in Visual studio code it will compile android code and open Android studio automatically then AVD to test app the app. 

```
npx cap open android
```
To run iOS app locally using Xcode, run below command.

```
npx cap open ios
```

Note:- The app works same as it works on web with all notifications (toastr) and functionality. 

