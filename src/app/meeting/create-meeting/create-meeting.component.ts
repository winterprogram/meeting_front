import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';
import { AppService } from 'src/app/app.service';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

  
  public title: String;
  public startDate: any;
  public endDate: any;
  public createdBy: any;
  public createdById: any;
  public createdByEmail: any;
  public userInfo: any;
  public createdFor: any; 
  public createdForEmail: any;
  public authToken: String
  public allUsers: any[];
  public allUsersData: any[]
  public location: any;
  public purpose: any;
  public allUsersSort:any;

  createdForUserId: any;
  createdForArray: any;
  singleUserData: any;


  constructor(public router: Router, public toastr: ToastrService, public appService: AppService, public socketService: SocketService) { }

  ngOnInit() {
    this.createdBy = Cookie.get('receiverName')
    this.createdById = Cookie.get('receiverId')
    this.createdByEmail = Cookie.get('receiverEmail')
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalstorage()

    if(Cookie.get('authToken')  == null  || Cookie.get('authToken')  == '' || Cookie.get('authToken')  == undefined){
      this.router.navigate(['/login'])
    }

    if (this.userInfo.isAdmin === true) {
      this.getAllUsers()
    } else {
      this.router.navigate(['/user/normal/dashboard'])
    }
    // console.log(this.startDate);
  }
 

 

  // public displaySelectedUser(user) {
  //   console.log(user)
  //   this.createdFor = user
  //   console.log(this.createdFor);
  //   this.toastr.info(`You have selected meeting with ${user.firstName} ${user.lastName}`)
  // }

  public comparingDates(startDate: any, endDate: any): boolean {
    let start = new Date(startDate);
    let end = new Date(endDate);
    if (end < start) {
      return true;
    } else {
      return false;
    }
  }

  public validateWithTodayDate(startDate: Date): boolean {
    let start = new Date(startDate);
    let end: any = new Date();
    if (end > start) {
      return true;
    } else {
      return false;
    }
  }

  public onChangeEvent() {
    this.createdForUserId = this.createdFor;
    
    this.getSingleUserData();
    

  }

  public getSingleUserData(): any {
    
      this.appService.getSingleUser(this.createdFor)
        .subscribe((data) => {
          if (data.status === 200) {
            this.singleUserData = data.data
           
            
            
          } else {
            this.toastr.error(data.message)
          }
        }, (error) => {
          this.toastr.error('something went wrong')
        })
    
  }

  public createMeeting(): any {
    if (!this.startDate) {
      this.toastr.warning('Choose the Start Date for Meeting')
    } else if (!this.endDate) {
      this.toastr.warning('Choose the End Date for Meeting')
    } else if (!this.title) {
      this.toastr.warning('Title of Meeting is Missing')
    } else if (!this.createdFor) {
      this.toastr.warning('Select the user for Meeting')
    } else if (!this.location) {
      this.toastr.warning('Select the location for Meeting')
    } else if (!this.purpose) {
      this.toastr.warning('Select the purpose for Meeting')
    } else if(this.comparingDates(this.startDate, this.endDate)) {
      this.toastr.warning('End Date/Time cannot be before Start Date/Time')
    } else if(this.validateWithTodayDate(this.startDate) && this.validateWithTodayDate(this.endDate)) {
      this.toastr.warning('Meeting cannot be Schedulded before time')
    } 
    else {
      // console.log(this.createdFor.userId);
      let data = {
        startDate: this.startDate.getTime(),
        endDate: this.endDate.getTime(),
        title: this.title,
        createdFor: this.createdFor,
        createdForEmail: this.singleUserData.email,
        createdBy: this.createdBy,
        createdByEmail: this.createdByEmail,
        createdById: this.createdById,
        authToken: this.authToken,
        location:this.location,
        purpose:this.purpose
      }
      // console.log(data)
      this.appService.createMeeting(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.toastr.success('meeting created')
            
            let notify = {
              message: `${this.title} has been created by ${this.createdBy}`,
              userId: data.createdFor
            }
            this.notifyUpdateToNormalUser(notify)
            setTimeout(() => {
              this.router.navigate(['/user/admin/dashboard'])
            }, 500)
          } else {
            this.toastr.error(apiResponse.message)
          }
        }, (error) => {
          this.toastr.error('something went wrong')
        })
    }
  }

  public getAllUsers() {
    if (this.authToken) {
      this.appService.getUsers(this.authToken)
        .subscribe((response) => {
          if (response.status === 200) {
            this.allUsersData = response.data 
            this.allUsers = [] 
            for (let i = 0; i < this.allUsersData.length; i++) {
              if(this.allUsersData[i].isAdmin==false){
              let user = {
                name:this.allUsersData[i].firstName + ' ' + this.allUsersData[i].lastName,
                email: this.allUsersData[i].email,
                userId: this.allUsersData[i].userId
              }
              this.allUsers.push(user)
              this.allUsersSort=this.allUsers.sort((obj1, obj2) => {
                if (obj1.name > obj2.name) {
                    return 1;
                }
            
                if (obj1.name < obj2.name) {
                    return -1;
                }
            
                return 0;
            });
            }
            else{}
            }
          } else {
            this.toastr.error(response.message)
          }
        }, (error) => {
          this.toastr.error('something went wrong')
          console.log(error)
        })
    } else {
      this.toastr.info('authorization token missing, try logging in again')
      this.router.navigate(['/login'])
    }
  }

  public logout: any = (userId) => {
    this.appService.logout(userId, this.authToken)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          this.socketService.disconnectedSocket()
          this.socketService.exitSocket()
          this.router.navigate(['/']);
        } else {
          this.toastr.error(apiResponse.message)
        }
      }, (err) => {
        this.toastr.error('some error occured')
      });
  }

  public goBack() {
    this.router.navigate(['/user/admin/dashboard'])
  }

  public notifyUpdateToNormalUser(data): any {
    this.socketService.notifyUpdates(data)
  }



}