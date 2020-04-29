import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { MeetingModule } from './meeting/meeting.module';
import { LoginComponent } from './user/login/login.component';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Routes, RouterModule } from '@angular/router';
import { DashboardModule } from './dashboard/dashboard.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './user/signup/signup.component';
import { FlatpickrModule } from 'angularx-flatpickr';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlatpickrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: '*', component: HomeComponent },
      { path: '**', component: HomeComponent }
    ]),
    UserModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MeetingModule,
    DashboardModule,

  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }