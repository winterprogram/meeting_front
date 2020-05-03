import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

// const colors: any = {
//   red: {
//     primary: '#ad2121',
//     secondary: '#FAE3E3'
//   },
//   blue: {
//     primary: '#1e90ff',
//     secondary: '#D1E8FF'
//   },
//   yellow: {
//     primary: '#e3bc08',
//     secondary: '#FDF1BA'
//   }
// };

@Component({
  selector: 'app-normal-user-dashboard',
  templateUrl: './normal-user-dashboard.component.html',
  styleUrls: ['./normal-user-dashboard.component.css']
})
export class NormalUserDashboardComponent implements  OnInit {

  public title: String;
  public createdForName: String;
  public createdForId: any;
  public createdForEmail: any;
  public userInfo: any;
  public createdByName: any;
  public name: String;

  public authToken: any
  public gentleReminder: Boolean = true;
  public meetings: any = []
  @ViewChild('modalAlert') modalAlert: TemplateRef<any>;

  ngOnInit() {
    this.createdForName = Cookie.get('receiverName')
    this.createdForId = Cookie.get('receiverId')
    this.createdForEmail = Cookie.get('receiverEmail')
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalstorage()

    if (Cookie.get('authToken') == null || Cookie.get('authToken') == '' || Cookie.get('authToken') == undefined) {
      this.router.navigate(['/login'])
    }

    if (this.userInfo.isAdmin == false) {
      this.getAllMeetings()
      this.getUpdates()
    } else {
      this.router.navigate(['/login'])
    }
    setInterval(() => {
      this.meetingReminder()
    }, 5000)
  }
  // ngAfterViewChecked(){
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-info-circle"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  public events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  constructor(
    private modal: NgbModal,
    private router: Router,
    public appService: AppService,
    public toastr: ToastrService,
    public socketService: SocketService) { }
    // ngAfterViewInit() {
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }
  

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    if (action == 'Edited') {
      this.modal.open(this.modalContent, { size: 'lg' });
    }
  }
  
  public getAllMeetings(): any {
    if (this.authToken) {
      this.appService.getNormalUserMeetings(this.createdForId)
        .subscribe((data) => {
          if (data.status === 200) {
            this.meetings = data.data
            console.log(this.meetings)
            for (let event of this.meetings) {
              event.title = event.title
              event.start = new Date(event.startDate)
              event.end = new Date(event.endDate)
              event.location = event.location
              event.purpose = event.purpose
              event.color = event.color
              event.actions = this.actions
              event.remindMe = true
              event.name = event.createdBy
            }
            this.events = this.meetings
            this.refresh.next();

          } else {
            this.toastr.error(data.message)
          }
        }, (error) => {
          this.toastr.error('something went wrong')
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
          this.authToken = null;
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

  public getUpdates() {
    this.socketService.getUpdatesFromAdmin(this.createdForId)
      .subscribe((data) => {
        this.getAllMeetings()
        this.toastr.info('Updates from Admin', data.message)
      })
  }

  public meetingReminder(): any {
    let currentTime = new Date().getTime();
    for (let meetingEvent of this.meetings) {

      if (((meetingEvent.start).getTime() - currentTime <= 60000) && ((meetingEvent.start).getTime() - currentTime > 0)) {

        if (meetingEvent.remindMe && this.gentleReminder && this.authToken != null) {
          this.toastr.info('One Minute to Start Meeting')
          this.modalData = { action: 'clicked', event: meetingEvent };
          this.modal.open(this.modalAlert, { size: 'sm' });
          break;
        }
      } else if (currentTime > (meetingEvent.start).getTime() && (currentTime - ((meetingEvent.start).getTime()) > 120000) && ((currentTime - (meetingEvent.start).getTime()) < 130000) && this.authToken != null) {
        this.toastr.info('Meeting just Started')

      }
    }
  }


}