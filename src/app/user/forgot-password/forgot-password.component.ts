import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string

  constructor(private router: Router,
    private toastr: ToastrService,
    public appService: AppService) { }

    ngOnInit() {
    }
  
    public loginFunction() {
      this.router.navigate(['/login'])
    }
  
    public signUpFunction() {
      this.router.navigate(['/sign-up'])
    }

  public sendResetLink() {
    if (!this.email) {
      this.toastr.warning('email required')
    } else {
      let data = {
        email: this.email
      };
      this.appService.forgotPassword(data)
        .subscribe((response) => {
          this.toastr.success('Please check your email to reset password')
          if (response.status === 200) {
            setTimeout(() => {
              this.router.navigate(['/login'])
            }, 1000)
          } else {
            this.toastr.error(response.message)
          }
        }, (error) => {
          this.toastr.error('something went wrong')
        })
    }

  }

  

}