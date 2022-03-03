import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/helper/PathConstants';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reloctaion-report',
  templateUrl: './reloctaion-report.component.html',
  styleUrls: ['./reloctaion-report.component.css']
})
export class ReloctaionReportComponent implements OnInit {
  RelocationCols: any;
  RelocationData: any = [];
  fromDate: any;
  toDate: any;
  items: MenuItem[];
  loading: boolean;
  excelFileName: string;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Excel', icon: 'pi pi-file-excel', command: () => {
          this.table.exportCSV();
        }
      }
    ];
    this.RelocationCols = [
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'ShopCode', header: 'Shop Code' },
      { field: 'Reason', header: 'Reason' },
      { field: 'FromAddress', header: 'From Address' },
      { field: 'ToAddress', header: 'To Address' },
      { field: 'StatusName', header: 'Status' },
      { field: 'DocDate', header: 'Doc.Date.' },
      { field: 'CompletedDate', header: 'Completed Date' },
      { field: 'CreatedDate', header: 'Created Date' }
    ];
    this.excelFileName = 'RELOCATION_REPORT_BY_DATE ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
  }

  checkValidDateSelection() {
    this.table.reset();
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
    this.table.reset();
    this.loading = true;
    const params = {
      'FDate': this.datepipe.transform(this.fromDate, 'yyyy-MM-dd'),
      'TDate': this.datepipe.transform(this.toDate, 'yyyy-MM-dd')
    }
    this.restApiService.getByParameters(PathConstants.RelocationDetailsGet, params).subscribe(res => {
      if (res.length !== 0) {
        this.loading = false;
        this.RelocationData = res;
      } else {
        this.loading = false;
        this.table.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'warn',
          summary: 'Warning Message', detail: 'No records been found!'
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
}

