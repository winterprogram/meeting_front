import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public email: any;
  public userName: any;
  public password: any;
  public country: any;
  public mobileNumber: any;
  public isAdmin: boolean;

  public countryName: string;
  public allCountries: any;
  public countryCode: string;
  public countries: any[] = [];
  public countryCodes: string[];
  public userType: any;



  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getAllCountries()
    this.getAllCountryPhone()
    this.checkUserType()
  }
  public getAllCountries() {
    this.appService.getAllCountryNamesFromJson()
      .subscribe((data) => {
        this.allCountries = data;
        for (let x in data) {
          let singleCountryData = {
            code: x,
            name: data[x]
          };
          this.countries.push(singleCountryData)
        }
        this.countries = this.countries.sort((first, second) => {
          return first.name.toUpperCase() < second.name.toUpperCase() ? -1 : (first.name.toUpperCase() > second.name.toUpperCase() ? 1 : 0);
        })
      })
  }
  public goToSignIn: any = () => {
    this.router.navigate(['/login']);
  } // end goToSignIn

  
  public getAllCountryPhone() {
    this.appService.getAllCountryPhoneFromJson()
      .subscribe((data) => {
        this.countryCodes = data;
      })
  }

  public checkAdmin = (x) => {
    if (String(x).includes('-admin')) {
      this.checkUserType()
      return false

    } else {
      return true
    }
  }

  public onChangeEvent() {
    this.countryCode = this.countryCodes[this.country];
    // console.log(this.countryCode)
    this.countryName = this.allCountries[this.country];

  }

  public checkUserType() {

    if (this.userType === "normalUser") {
      this.isAdmin = false
    }
    else if (this.userType === "admin" && String(this.userName).includes('-admin') === true) {
      this.isAdmin = true;

    }
    else

      this.isAdmin = false;

  }
  

  public signUpFunction: any = () => {
    // let regex = /^[a-zA-Z]+\d+/;
    // console.log(this.country);
    if (!this.userName) {
      this.toastr.warning('enter username');
    } else if (!this.firstName) {
      this.toastr.warning('enter first name');
    } else if (!this.lastName) {
      this.toastr.warning('enter last name');
    } else if (!this.mobileNumber) {
      this.toastr.warning('enter mobileNumber');
    } else if (!this.email) {
      this.toastr.warning('enter email');
    } else if (!this.password) {
      this.toastr.warning('enter password');
    // }else if (this.password.match(regex)) {
    //   this.toastr.warning('password is not valid');
    // }  
    }else if (!this.userType) {
      this.toastr.warning('Choose userType');
    } else if (this.mobileNumber.toString().length != 10) {
      this.toastr.warning('Please enter 10 digit mobile number');

    } else if (this.isAdmin === true && String(this.userName).includes('-admin') === false) {

      this.toastr.warning(' Write -admin at the end of username');
    }
    else if (this.isAdmin === false && this.userType === "admin") {
      this.toastr.warning('Please write -admin at the end of username');
    }
    else if (this.userType === "normalUser" && String(this.userName).includes('-admin') === true) {
      this.toastr.warning('Please remove -admin from username or select admin as usertype')
    }


    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        email: this.email,
        password: this.password,
        userName: this.userName,
        isAdmin: this.isAdmin,
        countryName: this.country,
        countryCode:this.countryCode
      }
      // console.log(data);
      this.appService.signUpFunction(data)
        .subscribe((apiResponse) => {
          // console.log(apiResponse);
          if (apiResponse.status === 200) {
            this.toastr.success('Signup successful');
            setTimeout(() => {
              this.goToSignIn();
            }, 1000);
          } else {
            this.toastr.error(apiResponse.message);
          }
        }, (err) => {
          this.toastr.error('some error occured');
        });
    } // end condition
  } // end signupFunction


}