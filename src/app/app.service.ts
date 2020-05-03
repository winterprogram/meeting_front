import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient) {
  }
   private url = 'http://localhost:3000';
  // private url = 'http://15.206.28.103';
  public signUpFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('userName', data.userName)
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('countryName', data.countryName)
      .set('isAdmin', data.isAdmin)
      .set('countryCode', data.countryCode);
    return this.http.post(`${this.url}/signup`, params);
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)
    return this.http.post(`${this.url}/login`, params);
  }

  public forgotPassword(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
    return this.http.post(`${this.url}/forgotPassword`, params);
  }


  public getAllCountryPhoneFromJson(): Observable<any> {
    const data = this.http.get('../assets/data.json');
    return data;
  }

  public getAllCountryNamesFromJson(): Observable<any> {
    const data = this.http.get('../assets/countryNames.json');
    return data;
  }



  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public logout(userId, authToken): Observable<any> {
    const params = new HttpParams()
      .set('authToken', authToken)
    return this.http.post(`${this.url}/logout/${userId}`, params)
  }

  public getUsers(authToken): Observable<any> {
    return this.http.get(`${this.url}/view/all?authToken=${authToken}`);
  }
  public getSingleUser(userId): Observable<any> {
    return this.http.get(`${this.url}/view/${userId}?authToken=${Cookie.get('authToken')}`)
  }



  public meetingcreate
  (data): Observable<any> {
    const params = new HttpParams()
      .set('title', data.title)
      .set('startDate', data.startDate)
      .set('endDate', data.endDate)
      .set('createdBy', data.createdBy)
      .set('createdById', data.createdById)
      .set('createdByEmail', data.createdByEmail)
      .set('createdFor', data.createdFor)
      .set('createdForEmail', data.createdForEmail)
      .set('authToken', data.authToken)
      .set('location', data.location)
      .set('purpose', data.purpose)
    return this.http.post(`${this.url}/meetingcreate`, params)
  }

  public getAllMeetings(userId, authToken): Observable<any> {
    return this.http.get(`${this.url}/fetchallmeetings/${userId}?authToken=${authToken}`)
  }

  public getSelectedUserMeetings(createdById, createdFor, authToken): Observable<any> {
    return this.http.get(`${this.url}/fetchmeetingbyuser?createdById=${createdById}&createdFor=${createdFor}&authToken=${authToken}`)
  }

  public updateMeeting(data): Observable<any> {
    const params = new HttpParams()
      .set('title', data.title)
      .set('startDate', data.startDate)
      .set('endDate', data.endDate)
      .set('location', data.location)
      .set('purpose', data.purpose)
      .set('authToken', data.authToken)
    return this.http.put(`${this.url}/updateusermeeting/${data.meetingId}`, params)
  }

  public getSingleMeetingDetails(meetingId, authToken): Observable<any> {
    return this.http.get(`${this.url}/selectmeeting/${meetingId}?authToken=${authToken}`)
  }

  public getNormalUserMeetings(meetingId): Observable<any> {
    return this.http.get(`${this.url}/getmeetingbyuser/${meetingId}?authToken=${Cookie.get('authToken')}`)
  }

  public deleteMeeting(meetingId, authToken): Observable<any> {
    const params = new HttpParams()
      .set('authToken', authToken)
    return this.http.post(`${this.url}/deletemeetingforuser/${meetingId}`, params)
  }
}