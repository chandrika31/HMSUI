import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/helper/PathConstants';
import { Table } from 'primeng/table/table';
import { MenuItem } from 'primeng/api/menuitem';
import { MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calamity-report',
  templateUrl: './calamity-report.component.html',
  styleUrls: ['./calamity-report.component.css']
})
export class CalamityReportComponent implements OnInit {
  maxDate: Date = new Date();
  TheftCols: any;
  TheftData: any = [];
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
    this.TheftCols = [
      { field: 'LocName', header: 'Location' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'Shopcode', header: 'Shop Code' },
      { field: 'Reason', header: 'Reason' },
      { field: 'IssueName', header: 'Issue Type' },
      { field: 'StatusName', header: 'Status' },
      { field: 'DocDate', header: 'Doc.Date.' },
      { field: 'Address', header: 'Address' },
      { field: 'URL', header: 'Video URL' },
      { field: 'ImageURL', header: 'Image URL' },
      { field: 'CompletedDate', header: 'Completed Date' },
      { field: 'CreatedDate', header: 'Created Date' }
    ];
    this.excelFileName = 'THEFT_REPORT_BY_DATE ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
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
    this.restApiService.getByParameters(PathConstants.CalamityDetailsGet, params).subscribe(res => {
      if (res.length !== 0 && res !== null && res !== undefined) {
        this.loading = false;
        this.TheftData = res;
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