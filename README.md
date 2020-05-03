# Meeting App (Meeting Planner) 

This application is built to schedule meetings. Typically this web is much more usefull in mid-scale to large-scale companies where there is an interaction involved with 3rd person like receptionist to book conference rooms for meetings. 

Project urls:-

1) Angular :- http://13.233.86.6

   Github Link :- https://github.com/winterprogram/meeting_front

2) Node App :- http://15.206.28.103

    Github Link :- https://github.com/winterprogram/meeting_back

Note :- Node url is protected by Cros, please use localhost:3000 to test Rest apis.

## Installing

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

