import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api/selectitem';
import { PathConstants } from 'src/app/helper/PathConstants';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  Name: any;
  Phone: any;
  Email: any;
  FileName: any;
  regionOptions: SelectItem[];
  rcode: any;
  districtOptions: SelectItem[];
  dcode: any;
  Address: string;
  LocationURL: string;
  maxDate: Date = new Date();
  blockScreen: boolean;
  districtsData: any;
  regionsData: any;
  User_Id: any;
  viewDate: any;
  UserProfileData: any = [];
  UserProfileCols: any;
  isEditClicked: boolean;
  loading: Boolean;
  locationsData: any;
  locationOptions: SelectItem[];
  location: any;
  disableDM: boolean;
  disableRM: boolean;
  uploadedFiles: any[] = [];
  login_details: any;
  Username: any;
  RMName: string;
  RMDistrict: any;
  RMPhnNo: number;
  RMEmailId: string;
  uploadURL: string;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.login_details = this.authService.getLoggedUser();
    this.locationsData = this.masterDataService.getProducts();
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.assignDefaultValues();
    this.getUserProfile();
    this.UserProfileCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'Name', header: 'Name' },
      { field: 'Address', header: 'Address' },
      { field: 'Phone', header: 'Phone Number' },
      { field: 'Email', header: 'Email' },
      { field: 'LocationURL', header: 'Location URL' },
      { field: 'Region', header: 'Region' },
      { field: 'District', header: 'District' },
    ]
  }

  assignDefaultValues() {
    this.isEditClicked = false;
    this.User_Id = this.login_details.Id;
    this.UserProfileData = [];
    this.blockScreen = false;
    this.Username = this.login_details.RealName;
    this.User_Id = this.login_details.Id;
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    switch (type) {
      case 'RM':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'DM':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if (this.rcode.value === d.rcode) {
              districtSeletion.push({ label: d.name, value: d.code });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
    }
  }

  onSave(form: NgForm) {
    this.blockScreen = true;
    const params = {
      'UserId': (this.User_Id !== null && this.User_Id !== undefined) ? this.User_Id : null,
      'LocationURL': this.LocationURL,
      'Dcode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode.value : null,
      'Rcode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode.value : null,
      'Name': this.Name,
      'Address': this.Address,
      'Phone': this.Phone,
      'MailId': this.Email,
      'FileName': this.FileName,
      'RMName': this.RMName,
      'RMPhone': this.RMPhnNo,
      'RMDistrict': (this.RMDistrict !== undefined && this.RMDistrict !== null) ? this.RMDistrict.value : null,
      'RMEmailId': this.RMEmailId
      // 'User': this.user
    }
    this.restApiService.post(PathConstants.UserProfilePost, params).subscribe(res => {
      if (res.item1) {
        form.reset();
        this.assignDefaultValues();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Saved Successfully !'
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please Contact Administrator !'
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please Contact Administrator!'
        });
      }
    });
  }

  resetFormFields(form) {
    form.controls.rname.reset();
    form.controls.user_name.reset();
    form.controls.user_phno.reset();
    form.controls.user_dname.reset();
    form.controls.user_addr.reset();
    form.controls.user_mailid.reset();
    form.controls.user_loc.reset();
    form.controls.rm_name.reset();
    form.controls.rm_dname.reset();
    form.controls.rm_phno.reset();
    form.controls.rm_email.reset();
    form.controls.prof_pic.reset();
  }

  getUserProfile() {
    this.UserProfileData = [];
    this.restApiService.getByParameters(PathConstants.UserProfileGet, {Id: this.User_Id}).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.Address = res[0].Address;
        this.Phone = res[0].Phone;
        this.Email = res[0].MailId;
        this.LocationURL = res[0].LocationURL;
        this.regionOptions = [{ label: res[0].REGNNAME, value: res[0].Rcode }];
        this.rcode = [{ label: res[0].REGNNAME, value: res[0].Rcode }];
        this.districtOptions = [{ label: res[0].Dname, value: res[0].Dcode }];
        this.dcode = [{ label: res[0].Dname, value: res[0].Dcode }];
        this.RMName = res[0].RMName;
        this.RMPhnNo = res[0].RMPhone;
        this.RMEmailId = res[0].RMEmailId;
        this.RMDistrict = [{ label: res[0].RMDistrictName, value: res[0].RMDistrict }];
        this.FileName = res[0].FileName;
      }
    })
  }

  onSelectImage(event) {
    this.FileName = event.files[0].name;
    this.uploadURL = 'C:/Users/chandrika/hms/HMSUI/src/assets/images/profiles' + this.FileName;

  }

  onUpload(event) {
    const reader = new FileReader();
    for (let file of event.files) {
      this.uploadedFiles.push(file);
      reader.readAsDataURL(file);
    }
    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  onClear(form: NgForm) {
    form.reset();
    this.assignDefaultValues();
  }
}