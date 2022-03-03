import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { RestAPIService } from '../../services/restAPI.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MasterDataService } from '../../masters-services/master-data.service';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { PathConstants } from '../../helper/PathConstants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-relocation-form',
  templateUrl: './relocation-form.component.html',
  styleUrls: ['./relocation-form.component.css']
})
export class RelocationFormComponent implements OnInit {
  shopOptions: SelectItem[];
  shopNo: any;
  regionOptions: SelectItem[];
  rcode: any;
  districtOptions: SelectItem[];
  dcode: any;
  reasonOptions: SelectItem[];
  reason: any;
  statusOptions: SelectItem[];
  status: any;
  fromAddress: string;
  toAddress: string;
  docDate: any;
  completedDate: any;
  user: any;
  blockScreen: boolean;
  districtsData: any;
  regionsData: any;
  shopData: any;
  reasonData: any;
  statusData: any;
  Relocation_Id: any;
  viewDate: any;
  relocationDetailsData: any = [];
  relocationDetailsCols: any;
  isEditClicked: boolean;
  loading: Boolean;
  locationsData: any;
  locationOptions: SelectItem[];
  location: any;
  disableDM: boolean;
  disableShop: boolean;
  showCDate: boolean;
  disableStatus: boolean;
  newShopNum: any;
  isSaved: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.user = JSON.parse(this.authService.getCredentials()).user;
    this.locationsData = this.masterDataService.getProducts();
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.shopData = this.masterDataService.getShops();
    this.statusData = this.masterDataService.getBugStatus();
    this.assignDefaultValues();
    this.relocationDetailsCols = [
      { field: 'SlNo', header: 'S.No.' },
      { field: 'LocName', header: 'Location Name' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'ShopCode', header: 'Shop Code' },
      { field: 'Reason', header: 'Reason' },
      { field: 'FromAddress', header: 'From Address' },
      { field: 'ToAddress', header: 'To Address' },
      { field: 'StatusName', header: 'Status' },
      { field: 'DocDate', header: 'Doc.Date.' },
      { field: 'CompletedDate', header: 'Completed Date' }
    ]
  }

  assignDefaultValues() {
    this.statusOptions = [{ label: 'OPEN', value: 2 }];
    this.status = { label: 'OPEN', value: 2 };
    this.isEditClicked = false;
    this.relocationDetailsData = [];
    this.isSaved = false;
    this.blockScreen = false;
    this.showCDate = false;
    this.disableStatus = true;
    this.viewDate = null;
    this.location = null;
    this.locationOptions = null;
    this.rcode = null;
    this.regionOptions = null;
    this.dcode = null;
    this.districtOptions = null;
    this.shopNo = null;
    this.shopOptions = null;
  }

  onSelect(type) {
    let locationSeletion = [];
    let regionSelection = [];
    let districtSeletion = [];
    let shopSeletion = [];
    let reasonSeletion = [];
    let statusSelection = [];
    switch (type) {
      case 'L':
        if (this.locationsData.length !== 0) {
          this.locationsData.forEach(d => {
            if (d.id !== 2) {
              locationSeletion.push({ label: d.name, value: d.id });
            }
          })
          this.locationOptions = locationSeletion;
          this.locationOptions.unshift({ label: '-Select-', value: 'All' });
          if (this.location !== undefined && this.location !== null) {
            if (this.location.value === 5) {
              this.disableDM = false;
              this.disableShop = false;
            } else if (this.location.value === 4) {
              this.disableDM = false;
              this.disableShop = true;
            } else if (this.location.value === 3) {
              this.disableDM = this.disableShop = true;
            } else if (this.location.value === 9) {
              this.disableDM = true;
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
      case 'RE':
        if (this.reasonData.length !== 0) {
          this.reasonData.forEach(r => {
            if (r.type === 2) {
              reasonSeletion.push({ label: r.name, value: r.id });
            }
          })
          this.reasonOptions = reasonSeletion;
          this.reasonOptions.unshift({ label: '-select-', value: null });
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
    }
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
      this.fromAddress = (this.rcode !== undefined && this.rcode !== null) ? this.rcode.address : null;
    } else if (field === 'DM') {
      this.shopNo = null;
      this.fromAddress = (this.dcode !== undefined && this.dcode !== null) ? this.dcode.address : null;
    } else if (field === 'SH') {
      this.fromAddress = (this.shopNo !== undefined && this.shopNo !== null) ? this.shopNo.address : null;
    }
  }

  onSave(form: NgForm) {
    this.isSaved = true;
    this.blockScreen = true;
    const params = {
      'Id': (this.Relocation_Id !== null && this.Relocation_Id !== undefined) ? this.Relocation_Id : 0,
      'Location': this.location.value,
      'Dcode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode.value : 0,
      'Rcode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode.value : 0,
      'Status': this.status.value,
      'Reason': this.reason,
      'ShopCode': (this.shopNo !== undefined && this.shopNo !== null) ? this.shopNo.value : 0,
      'FromAddress': this.fromAddress,
      'ToAddress': this.toAddress,
      'DocDate': (this.isEditClicked && this.docDate !== undefined
        && this.docDate !== null) ? this.docDate : this.datepipe.transform(this.docDate, 'yyyy-MM-dd'),
      'CompletedDate': (this.isEditClicked && this.completedDate !== undefined
        && this.completedDate !== null) ? this.datepipe.transform(this.completedDate, 'yyyy-MM-dd') : null,
      'User': this.user,
      'NewShopNo': (this.newShopNum !== undefined && this.newShopNum !== null) ?
        this.newShopNum : null
    }
    this.restApiService.post(PathConstants.RelocationDetailsPost, params).subscribe(res => {
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

  resetFormFields(form) {
    form.controls.loc.reset();
    form.controls.rname.reset();
    form.controls.dname.reset();
    form.controls.shop.reset();
    form.controls.fromAddr.reset();
    form.controls.toAddr.reset();
    form.controls.reasonText.reset();
    form.controls.stats.reset();
    form.controls.ddate.reset();
    form.controls.newShopNum.reset();
  }

  getRelocationDetails() {
    if (this.viewDate !== null && this.viewDate !== undefined && this.viewDate.toString().trim() !== '') {
      this.relocationDetailsData = [];
      const params = {
        'FDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd'),
        'TDate': this.datepipe.transform(this.viewDate, 'yyyy-MM-dd')
      }
      this.restApiService.getByParameters(PathConstants.RelocationDetailsGet, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.relocationDetailsData = res;
          let sno = 1;
          this.relocationDetailsData.forEach(t => {
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
      this.resetFormFields(form);
      this.disableStatus = false;
      this.showCDate = true;
      this.Relocation_Id = row.Id;
      this.reason = row.Reason;
      this.fromAddress = row.FromAddress;
      this.toAddress = row.ToAddress;
      this.docDate = (this.datepipe.transform(row.DocDate, 'yyyy-MM-dd'));
      this.completedDate = row.CompletedDate;
      this.locationOptions = [{ label: row.LocName, value: row.Location }];
      this.location = { label: row.LocName, value: row.Location };
      this.regionOptions = [{ label: row.REGNNAME, value: row.Rcode }];
      this.rcode = { label: row.REGNNAME, value: row.Rcode };
      this.districtOptions = [{ label: row.Dname, value: row.Dcode }];
      this.dcode = { label: row.Dname, value: row.Dcode };
      this.statusOptions = [{ label: row.StatusName, value: row.Status }];
      this.status = { label: row.StatusName, value: row.Status };
      if (row.Location === 4) {
        this.disableShop = true;
        this.shopNo = null;
      } else {
        this.disableShop = false;
        this.shopOptions = [{ label: row.Shopcode, value: row.Shopcode }];
        this.shopNo = { label: row.Shopcode, value: row.Shopcode };
      }
      this.newShopNum = row.NewShopNo;
    }
  }

  onClear(form: NgForm) {
    form.reset();
    form.form.markAsUntouched();
    form.form.markAsPristine();
    this.assignDefaultValues();
  }
}
