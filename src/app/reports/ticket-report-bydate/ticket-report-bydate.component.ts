import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ticket-report-bydate',
  templateUrl: './ticket-report-bydate.component.html',
  styleUrls: ['./ticket-report-bydate.component.css']
})
export class TicketReportBydateComponent implements OnInit {
  maxDate: Date = new Date();
  TicketReportCols: any;
  TicketReportData: any = [];
  fromDate: any;
  toDate: any;
  items: MenuItem[];
  loading: boolean;
  excelFileName: string;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Excel', icon: 'pi pi-file-excel', command: () => {
          this.table.exportCSV();
        }
      }
    ];
    this.TicketReportCols = [
      // { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'TicketID', header: 'Ticket_ID' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component' },
      { field: 'Status', header: 'Status' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'TicketDate', header: 'Ticket_Date' },
      { field: 'lastdiffed', header: 'Modified_Date' },
      { field: 'REGNNAME', header: 'Region' },
      { field: 'Dname', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' },
    ];
    this.excelFileName = 'TICKET_REPORT_BY_DATE ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
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
      'TDate': this.datepipe.transform(this.toDate, 'yyyy-MM-dd'),
      'Type': 1
    }
    this.restApiService.getByParameters(PathConstants.TicketReport, params).subscribe(res => {
      if (res.length !== 0) {
        this.loading = false;
        this.TicketReportData = res;
      } else {
        this.loading = false;
        this.table.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'No records been found'
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
