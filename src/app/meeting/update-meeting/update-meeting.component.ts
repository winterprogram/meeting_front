import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-update-meeting',
  templateUrl: './update-meeting.component.html',
  styleUrls: ['./update-meeting.component.css']
})
export class UpdateMeetingComponent implements OnInit {
  location: Date;
  purpose: any;
  allUsersData: any;
  allUsers: any[];
  userName: any;
  fullNameCreatedFor: string;

  constructor(
    public appService: AppService,
    private toastr: ToastrService,
    public router: Router,
    public route: ActivatedRoute,
    public socketService: SocketService
  ) { }

  
  public meetingId: any

  public title: String;
  public startDate: any;
  public endDate: any;
  public createdBy: any;
  public createdById: any;
  public createdByEmail: any;
  public userInfo: any;
  public authToken: any
  public createdFor: any; 
  public createdForEmail: any;
  public meetings: any;
  

  ngOnInit() {
    
    this.meetingId = this.route.snapshot.paramMap.get('meetingId');
    this.createdBy = Cookie.get('receiverName')
    this.createdById = Cookie.get('receiverId')
    this.createdByEmail = Cookie.get('receiverEmail')
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalstorage()
    this.userName=this.userInfo.userName;

    if(Cookie.get('authToken')  == null  || Cookie.get('authToken')  == '' || Cookie.get('authToken')  == undefined){
      this.router.navigate(['/'])
    }
    
   
    // this.getAllUsers();

    if (this.userInfo.isAdmin === true) {
      this.getSingleMeetingDetails()
    } else {
      this.router.navigate(['/user/normal/dashboard'])
    }
  }

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

  public getSingleUserDetails(){
    // console.log(this.createdFor);
    this.appService.getSingleUser(this.createdFor)
    .subscribe((data)=>{
      if(data.status === 200){
       

        this.fullNameCreatedFor=`${data.data.firstName} ${data.data.lastName}`
        // console.log(this.fullNameCreatedFor);
      }
      else {
        this.toastr.warning(data.message)
      }
    }, (error) => {
      this.toastr.error('something went wrong')
    })
  }

  public getSingleMeetingDetails() {
    this.appService.getSingleMeetingDetails(this.meetingId, this.authToken)
      .subscribe((data) => {
        
        if (data.status === 200) {
          this.meetings = data.data
          // console.log(this.meetings)
          this.toastr.success('Meeting Found')
          this.title = this.meetings.title
          this.createdBy = this.meetings.createdBy
          this.createdByEmail = this.meetings.createdByEmail
          this.createdById = this.meetings.createdById
          this.createdFor = this.meetings.createdFor
          this.createdForEmail = this.meetings.createdForEmail
          this.location=this.meetings.location
          this.purpose=this.meetings.purpose
          this.endDate = new Date(this.meetings.endDate)
          this.startDate = new Date(this.meetings.startDate)
          this.getSingleUserDetails();
        } else {
          this.toastr.warning(data.message)
        }
      }, (error) => {
        this.toastr.error('something went wrong')
      })
  }



  public updateMeeting() {
    if (!this.title) {
      this.toastr.warning('Title required')
    } else if (!this.startDate) {
      this.toastr.warning('Start Date is Required')
    } else if (!this.endDate) {
      this.toastr.warning('End Date is required')
    } else if(this.comparingDates(this.startDate, this.endDate)) {
      this.toastr.warning('End Date/Time cannot be before Start Date/Time')
    } else if(this.validateWithTodayDate(this.startDate) && this.validateWithTodayDate(this.endDate)) {
      this.toastr.warning('Meeting cannot be Schedulded before time')
    } else {
      let data = {
        meetingId: this.meetingId,
        title: this.title,
        startDate: this.startDate.getTime(),
        endDate: this.endDate.getTime(),
        location:this.location,
        purpose:this.purpose,
        authToken: this.authToken // pops out invalid token
      }
      this.appService.updateMeeting(data)
        .subscribe((data) => {
          if (data.status === 200) {
           
            this.toastr.success('Meeting Updated Successfully')
            let notify = {
              message: `Your Meeting with name ${this.title} has been updated by ${this.createdBy}`,
              userId: this.createdFor
            }
            this.notifyUpdateToNormalUser(notify)
            setTimeout(() => {
              this.router.navigate(['/user/admin/dashboard'])
            }, 1000)
          } else {
            this.toastr.warning(data.message)
          }
        }, (error) => {
          this.toastr.error('Something went wrong')
        })
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
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(apiResponse.message)
        }
      }, (err) => {
        this.toastr.error('some error occured')
      });
  }

  public deleteMeeting(meetingId) {
    this.appService.deleteMeeting(meetingId, this.authToken)
      .subscribe((data) => {
        if (data.status === 200) {
          // console.log(data);
          this.toastr.success('Meeting deleted successfully')
          let notify = {
            message: `${this.title} has been deleted by ${this.createdBy}`,
            userId: this.createdFor
          }
          this.notifyUpdateToNormalUser(notify)
          setTimeout(() => {
            this.router.navigate(['/user/admin/dashboard'])
          }, 1000)
        } else {
          this.toastr.warning(data.message)
        }
      }, (err) => {
        this.toastr.error('something went wrong')
      })
  }

 


  public notifyUpdateToNormalUser(data): any {
    this.socketService.notifyUpdates(data)
  }

  public goBack() {
    this.router.navigate(['/user/admin/dashboard'])
  }

  // public getAllUsers() {
  //   if (this.authToken) {
  //     this.appService.getUsers(this.authToken)
  //       .subscribe((response) => {
  //         if (response.status === 200) {
  //           this.allUsersData = response.data // store every user data om allUsersData
  //           this.allUsers = [] // store the users to show 'em online
  //           for (let i = 0; i < this.allUsersData.length; i++) {
  //             let user = {
  //               name:this.allUsersData[i].firstName + ' ' + this.allUsersData[i].lastName,
  //               email: this.allUsersData[i].email,
  //               userId: this.allUsersData[i].userId
  //             }
  //             this.allUsers.push(user)

  //           }
  //         } else {
  //           this.toastr.error(response.message)
  //         }
  //       }, (error) => {
  //         this.toastr.error('something went wrong')
  //         console.log(error)
  //       })
  //   } else {
  //     this.toastr.info('authorization token missing, try logging in again')
  //     this.router.navigate(['/login'])
  //   }
  // }

}
