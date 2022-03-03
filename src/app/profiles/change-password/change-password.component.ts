import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Helper/PathConstants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ChangeForm: FormGroup;
  districtsData: any = [];
  regionsData: any = [];
  password: any;
  ConfirmPassword: string;
  NewPassword: string;
  login_User: any;
  userName: any;
  @ViewChild('f', {static: false}) form: NgForm;

  constructor(private router: Router, private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService, private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.login_User = JSON.parse(this.authService.getCredentials());
    this.ChangeForm = this.fb.group({
      user: ['', Validators.required],
      new_pwd: ['', Validators.required],
      confirm_pwd: ['', Validators.required]
    })
    this.userName = this.login_User.user;
  }

  onViewUserinfo(event, panel) {
    panel.toggle(event);
    this.login_User = JSON.parse(this.authService.getCredentials()).user;
    this.userName = this.login_User.user;
  }

  onChangePassword(form: NgForm) {
    const params = {
      'UserId': this.login_User.Id,
      'Pswd': this.NewPassword.trim()
    };
    if (this.NewPassword !== undefined && this.NewPassword !== null && this.NewPassword.trim() !== '' &&
      this.ConfirmPassword !== undefined && this.ConfirmPassword !== null && this.ConfirmPassword.trim() !== '') {
      if (this.NewPassword.trim() === this.ConfirmPassword.trim()) {
        this.restApiService.put(PathConstants.ChangePassword, params).subscribe(res => {
          if (res) {
            this.onClear(form);
            this.messageService.clear();
            this.messageService.add({
              key: 't-err', severity: 'success',
              summary: 'Success Message', detail: 'Password Changed Successfully!'
            });
          } else {
            this.messageService.clear();
            this.messageService.add({
              key: 't-err', severity: 'error',
              summary: 'Error Message', detail: 'Please contact Administrator'
            });
          }
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Password does not Match!!!'
        });
      }
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: 'error',
        summary: 'Error Message', detail: 'Password does not Match!!!'
      });
    }
  }

  onClear(form: NgForm) {
    form.reset();
    this.userName = this.login_User.user;
  }
  
}
