import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { DatePipe } from '@angular/common';
import { MessageService, MenuItem } from 'primeng/api';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-ticket-report',
  templateUrl: './ticket-report.component.html',
  styleUrls: ['./ticket-report.component.css']
})
export class TicketReportComponent implements OnInit {
  maxDate: Date = new Date();
  TicketReportCols: any;
  TicketReportData: any = [];
  fromDate: any;
  toDate: any;
  showCloseDate: boolean;
  districtsData: any = [];
  regionsData: any = [];
  locationsData: any = [];
  regionOptions: SelectItem[];
  rcode: string;
  districtOptions: SelectItem[];
  dcode: string;
  locationOptions: SelectItem[];
  location: any;
  componentOptions: SelectItem[];
  compId: any;
  disableDM: boolean;
  disableRM: boolean;
  disableShop: boolean;
  componentsData: any[];
  items: MenuItem[];
  shopOptions: SelectItem[];
  shopData: any = [];
  shopCode: any;
  loading: boolean;
  excelFileName: string;
  @ViewChild('dt', { static: false }) table: Table;
  loggedInRcode: any;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService,
    private authService: AuthService) { }

  ngOnInit() {
    this.showCloseDate = false;
    this.loggedInRcode = this.authService.getLoggedUser().RCode;
    this.shopData = this.masterDataService.getShops();
    this.items = [
      {
        label: 'Excel', icon: 'pi pi-file-excel', command: () => {
          this.table.exportCSV();
        }
      }
    ];
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.locationsData = this.masterDataService.getProducts();
    this.TicketReportCols = [
      { field: 'TicketID', header: 'Ticket_ID' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component_Name' },
      { field: 'Status', header: 'Status' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'TicketDate', header: 'Ticket_Date' },
      { field: 'lastdiffed', header: 'Modified_Date' },
      { field: 'URL', header: 'URL' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'REGNNAME', header: 'Region' },
      { field: 'Dname', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' },
    ];
    // this.TicketReportData = [{ TicketID: "RAM" }, { location: "SUBASH" }];
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    let locationSeletion = [];
    let shopSeletion = [];
    switch (type) {
      case 'R':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: 'All', value: 'All' });
          this.regionOptions.unshift({ label: '-select', value: null });
        }
        break;
      case 'D':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if (this.rcode === d.rcode) {
              districtSeletion.push({ label: d.name, value: d.code });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: 'All', value: 'All' });
          this.districtOptions.unshift({ label: '-select', value: null });
        }
        break;
      case 'L':
        if (this.locationsData.length !== 0) {
          this.locationsData.forEach(d => {
            locationSeletion.push({ label: d.name, value: d.id });
          })
          this.locationOptions = locationSeletion;
          this.locationOptions.unshift({ label: '-Select-', value: null });
          if (this.location.value === 2) {
            this.disableDM = this.disableRM = this.disableShop = true;
          } else if (this.location.value === 5) {
            this.disableDM = this.disableRM = this.disableShop = false;
          } else if (this.location.value === 4) {
            this.disableDM = this.disableRM = false;
            this.disableShop = true;
          } else if (this.location.value === 3) {
            this.disableDM = this.disableShop = true;
            this.disableRM = false;
          }
        }
        break;
      case 'C':
        this.componentsData = [];
        this.restApiService.get(PathConstants.ComponentsURL).subscribe((res: any) => {
          res.forEach(x => {
            if (this.location.value === 3 && x.product_id === 3) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
              this.disableShop = true;
            } else if (this.location.value === 4 && x.product_id === 4) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
            } else if (this.location.value === 5 && x.product_id === 5) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
            } else if (this.location.value === 2 && x.product_id === 2) {
              this.componentsData.push({ label: x.name, value: x.id, desc: x.description });
            }
          });
          this.componentOptions = this.componentsData;
          this.componentOptions.unshift({ label: 'All', value: 1 });
          this.componentOptions.unshift({ label: '-select', value: null });
        });
        break;
      case 'S':
        if (this.shopData.length !== 0) {
          this.shopData.forEach(s => {
            if (this.dcode === s.dcode) {
              shopSeletion.push({ label: s.shop_num, value: s.shop_num });
            }
          })
          this.shopOptions = shopSeletion;
          this.shopOptions.unshift({ label: 'All', value: null });
        }
        break;
    }
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({
          key: 'msgKey', severity: 'warn', life: 5000
          , summary: 'Invalid Date!', detail: 'Please select the valid date'
        });
      }
      return this.fromDate, this.toDate;
    }
  }

  onView() {
    const params = {
      'RCode': (this.rcode !== undefined && this.rcode !== null) ? this.rcode : 'All',
      'DCode': (this.dcode !== undefined && this.dcode !== null) ? this.dcode : 'All',
      'Product': this.location.value,
      'Component': (this.compId !== undefined && this.compId !== null) ? this.compId.value : 1,
      'Shops': (this.shopCode !== undefined && this.shopCode !== null) ? this.shopCode : 'All',
      'FDate': this.datepipe.transform(this.fromDate, 'yyyy-MM-dd'),
      'TDate': this.datepipe.transform(this.toDate, 'yyyy-MM-dd'),
    }
    this.restApiService.getByParameters(PathConstants.TicketReport, params).subscribe(res => {
      if (res.length !== 0) {
        this.TicketReportData = res;
        this.loading = false;
        this.excelFileName = this.location.label + ' TICKET_REPORT ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
      } else {
        this.loading = false;
        this.table.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'warn',
          summary: 'Warning Message', detail: 'No records has been found!'
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      this.table.reset();
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please Contact Administrator!'
        });
      }
    })
  }

  onResetFields(field) {
    if (field === 'RM') {
      this.dcode = null;
      this.shopCode = null;
    } else if (field === 'L') {
      this.compId = null;
      this.dcode = null;
      this.rcode = null;
      this.shopCode = null;
      this.componentsData = [];
    }
  }
}
