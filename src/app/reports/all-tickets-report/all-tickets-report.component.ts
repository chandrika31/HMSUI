import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-tickets-report',
  templateUrl: './all-tickets-report.component.html',
  styleUrls: ['./all-tickets-report.component.css']
})
export class AllTicketsReportComponent implements OnInit {
  ticketCols: any;
  ticketData: any = [];
  loading: boolean;
  userInfo: any;
  excelFileName: string;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApi: RestAPIService, private route: ActivatedRoute,
    private messageService: MessageService, private authService: AuthService, private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.userInfo = this.authService.getLoggedUser();
    let value: any = this.route.snapshot.queryParamMap.get('id');
    value = (value * 1);
    this.ticketCols = [
      { field: 'TicketID', header: 'Ticket_ID' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component_Name' },
      { field: 'Status', header: 'Status' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'TicketDate', header: 'Ticket_Date' },
      { field: 'lastdiffed', header: 'Modified_Date' },
      { field: 'REGNNAME', header: 'Region' },
      { field: 'Dname', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' }
    ];
    this.loading = true;
    this.restApi.get(PathConstants.AllTicketsGetURL).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        this.ticketData = data;
        if (value !== undefined && value !== null && value !== 1 && value !== 6) {
          this.ticketData = this.ticketData.filter(y => {
            return (value === y.product_id)
          })
        } else if (value === 6) {
          this.ticketData = this.ticketData.filter(y => {
            const user_id = (y.userid * 1);
            return (this.userInfo.Id === user_id)
          })
        }
        this.excelFileName = 'TICKET_STATUS_REPORT ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
        this.loading = false;
        if (this.ticketData.length !== 0) {
          this.messageService.clear();
        } else {
          this.table.reset();
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'warn',
            summary: 'Warning Message', detail: 'No record found!'
          });
        }
      } else {
        this.loading = false;
        this.table.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'warn',
          summary: 'Warning Message', detail: 'No record found!'
        });
      }
    }, (err: HttpErrorResponse) => {
      this.table.reset();
      this.loading = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please contact administrator!'
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please check your network connection!'
        });
      }
    });
  }
}
