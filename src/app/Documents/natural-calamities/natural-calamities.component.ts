import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PathConstants } from 'src/app/helper/PathConstants';
import { SelectItem } from 'primeng/api/selectitem';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-natural-calamities',
  templateUrl: './natural-calamities.component.html',
  styleUrls: ['./natural-calamities.component.css']
})
export class NaturalCalamitiesComponent implements OnInit {
  shopOptions: SelectItem[];
  shopNo: any;
  regionOptions: SelectItem[];
  rcode: any;
  districtOptions: SelectItem[];
  dcode: any;
  reason: string;
  statusOptions: SelectItem[];
  status: any;
  issueTypeOptions: SelectItem[];
  issueType: any;
  address: string;
  docDate: any;
  completedDate: any;
  maxDate: Date = new Date();
  user: any;
  blockScreen: boolean;
  districtsData: any;
  regionsData: any;
  shopData: any;
  statusData: any;
  issuesData: any;
  urlPath: string;
  isEditClicked: boolean;
  viewDate: any;
  calamityDetailsCols: any;
  calamityDetailsData: any = [];
  DocId: any;
  loading: Boolean;
  locationsData: any;
  locationOptions: SelectItem[];
  location: any;
  disableShop: boolean;
  selectedVType: number;
  selectedIType: number;
  isVideoURLDisabled: boolean;
  isImageURLDisabled: boolean;
  showCDate: boolean;
  imageURLPath: string;
  videoURLPath: string;
  disableStatus: boolean;
  minDate: Date;
  isSaved: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.minDate = this.masterDataService.getMinDate();
    this.user = JSON.parse(this.authService.getCredentials()).user;
    this.locationsData = this.masterDataService.getProducts();
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.shopData = this.masterDataService.getShops();
    this.statusData = this.masterDataService.getBugStatus();
    this.issuesData = this.masterDataService.getIssuesType();
    this.assignDefaultValues();
    this.calamityDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'LocName', header: 'Location Name' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'Shopcode', header: 'Shop Code' },
      { field: 'Reason', header: 'Reason' },
      { field: 'IssueName', header: 'Issue Type' },
      { field: 'StatusName', header: 'Status' },
      { field: 'DocDate', header: 'Doc.Date.' },
      { field: 'Address', header: 'Address' },
      { field: 'VideoURL', header: 'Video URL' },
      { field: 'ImageURL', header: 'Image URL' },
      { field: 'CompletedDate', header: 'Completed Date' }
    ];
  }

  assignDefaultValues() {
    this.statusOptions = [{ label: 'OPEN', value: 2 }];
    this.status = { label: 'OPEN', value: 2 };
    this.isEditClicked = false;
    this.disableStatus = true;
    this.calamityDetailsData = [];
    this.blockScreen = false;
    this.showCDate = false;
    this.isImageURLDisabled = true;
    this.isVideoURLDisabled = true;
    this.locationOptions = null;
    this.location = null;
    this.regionOptions = null;
    this.rcode = null;
    this.districtOptions = null;
    this.dcode = null;
    this.shopOptions = null;
    this.shopNo = null;
    this.issueType = null;
    this.issueTypeOptions = null;
    this.isSaved = false;
  }

  onSelect(type) {
    let locationSeletion = [];
    let regionSelection = [];
    let districtSeletion = [];
    let shopSeletion = [];
    let statusSelection = [];
    let issueTypeSelection = [];
    switch (type) {
      case 'L':
        if (this.locationsData.length !== 0) {
          this.locationsData.forEach(d => {
            if (d.id !== 2 && d.id !== 3) {
              locationSeletion.push({ label: d.name, value: d.id });
            }
          })
          this.locationOptions = locationSeletion;
          this.locationOptions.unshift({ label: '-Select-', value: 'All' });
          if (this.location !== undefined && this.location !== null) {
            if (this.location.value === 5) {
              this.disableShop = false;
            } else if (this.location.value === 4) {
              this.disableShop = true;
            } else if (this.location.value === 9) {
              this.disableShop = true;
            }
          }
        }
        break;
      case 'RM':
        if (this.regionsData.length !== 0) {
          if (this.user.RoleId === 3 || this.user.RoleId === 4) {
            this.regionsData.forEach(r => {
              if (r.code === this.user.RCode) {
                regionSelection.push({ label: r.name, value: r.code, address: r.address });
              }
            })
          } else {
            this.regionsData.forEach(r => {
              regionSelection.push({ label: r.name, value: r.code, address: r.address });
            })
          }
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'DM':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if (this.rcode.value === d.rcode) {
              districtSeletion.push({ label: d.name, value: d.code, address: d.address });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'SH':
        if (this.shopData.length !== 0) {
          this.shopData.forEach(s => {
            if (this.dcode.value === s.dcode) {
              shopSeletion.push({ label: s.shop_num, value: s.shop_num, address: s.address });
            }
          })
          this.shopOptions = shopSeletion;
          this.shopOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'ST':
        if (this.statusData.length !== 0) {
          this.statusData.forEach(st => {
            const id = (st.id * 1);
            if (id === 2 || id === 7 || id === 3) {
              statusSelection.push({ label: st.name, value: st.id });
            }
          })
          this.statusOptions = statusSelection;
          this.statusOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'IT':
        if (this.issuesData.length !== 0) {
          this.issuesData.forEach(it => {
            issueTypeSelection.push({ label: it.type, value: it.id });
          })
          this.issueTypeOptions = issueTypeSelection;
          this.issueTypeOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
      this.address = (this.rcode !== undefined && this.rcode !== null) ? this.rcode.address : null;
    } else if (field === 'DM') {
      this.shopNo = null;
      this.address = (this.dcode !== undefined && this.dcode !== null) ? this.dcode.address : null;
    } else if (field === 'SH') {
      this.address = (this.shopNo !== undefined && this.shopNo !== null) ? this.shopNo.address : null;
    }
  }

  onSave(form: NgForm) {
    this.isSaved = true;
    this.blockScreen = true;
    const params = {
      'Id': (this.DocId !== null && this.DocId !== undefined) ? this.DocId : 0,
      'Location': this.location.value,
      'Dcode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode.value : 0,
      'Rcode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode.value : 0,
      'Status': this.status.value,
      'Reason': this.reason,
      'ShopCode': (this.shopNo !== undefined && this.shopNo !== null) ? this.shopNo.value : 0,
      'Address': this.address,
      'IssueType': this.issueType.value,
      'DocDate': (this.isEditClicked && this.docDate !== undefined
        && this.docDate !== null) ? this.docDate : this.datepipe.transform(this.docDate, 'yyyy-MM-dd'),
      'CompletedDate': (this.isEditClicked && this.completedDate !== undefined
        && this.completedDate !== null) ? this.datepipe.transform(this.completedDate, 'yyyy-MM-dd') : null,
      'VideoURL': this.videoURLPath,
      'ImageURL': this.imageURLPath,
      'User': this.user
    }
    this.restApiService.post(PathConstants.CalamityDetailsPost, params).subscribe(res => {
      if (res.item1) {
        this.onClear(form);
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Saved Successfully !'
        });
      } else {
        this.isSaved = false;
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: res.item2
        });
      }
    }, (err: HttpErrorResponse) => {
      this.isSaved = false;
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

  getCalamityDetails() {
    if (this.viewDate !== null && this.viewDate !== undefined && this.viewDate.toString().trim() !== '') {
      this.calamityDetailsData = [];
      const params = {
        'FDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd'),
        'TDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd')
      }
      this.restApiService.getByParameters(PathConstants.CalamityDetailsGet, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.calamityDetailsData = res;
          let sno = 1;
          this.calamityDetailsData.forEach(t => {
            t.SlNo = sno;
            sno += 1;
          })
        } else {
          this.messageService.add({
            key: 't-err', severity: 'warn',
            summary: 'Warning Message', detail: 'No data found for selected date!'
          });
        }
      })
    }
  }

  onRowSelect(row, index, form: NgForm) {
    if (row !== undefined && row !== null) {
      this.showCDate = true;
      form.reset();
      this.disableStatus = false;
      this.DocId = row.CId;
      this.reason = row.Reason;
      this.address = row.Address;
      this.videoURLPath = row.VideoURL;
      this.selectedVType = (row.VideoURL !== undefined && row.VideoURL !== null && row.VideoURL.trim() !== '')
        ? 1 : 0;
      this.imageURLPath = row.ImageURL;
      this.selectedIType = (row.ImageURL !== undefined && row.ImageURL !== null && row.ImageURL.trim() !== '')
        ? 1 : 0;
      this.completedDate = row.CompletedDate;
      this.docDate = (this.datepipe.transform(row.DocDate, 'yyyy-MM-dd'));
      this.locationOptions = [{ label: row.LocName, value: row.Location }];
      this.location = { label: row.LocName, value: row.Location };
      this.regionOptions = [{ label: row.REGNNAME, value: row.Rcode }];
      this.rcode = { label: row.REGNNAME, value: row.Rcode };
      this.districtOptions = [{ label: row.Dname, value: row.Dcode }];
      this.dcode = { label: row.Dname, value: row.Dcode };
      this.statusOptions = [{ label: row.StatusName, value: row.Status }];
      this.status = { label: row.StatusName, value: row.Status };
      this.issueTypeOptions = [{ label: row.IssueName, value: row.IssueType }];
      this.issueType = { label: row.IssueName, value: row.IssueType };
      if (row.Location === 4) {
        this.disableShop = true;
        this.shopNo = null;
      } else {
        this.disableShop = false;
        this.shopOptions = [{ label: row.Shopcode, value: row.Shopcode }];
        this.shopNo = { label: row.Shopcode, value: row.Shopcode };
      }
    }
  }

  onClear(form: NgForm) {
    form.reset();
    form.form.markAsUntouched();
    form.form.markAsPristine();
    this.assignDefaultValues();
  }
  openGoogleDrive() {
    const google_drive_url = 'https://drive.google.com/drive/u/1/folders/1x9tnr1T0ekG5DP7yK847m53bQYF-Mryt';
    const username = 'tasmaccloud@gmail.com';
    const password = 'Tasmac@123';
    window.open(google_drive_url);
  }
}