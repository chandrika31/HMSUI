import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { MasterDataService } from '../../masters-services/master-data.service';
import { AuthService } from '../../services/auth.service';
import { RestAPIService } from '../../services/restAPI.service';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { Table } from 'primeng/table/table';

@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css']
})
export class MyTicketsComponent implements OnInit {
  TicketReportCols: any = [];
  TicketReportData: any = [];
  showDialog: boolean = false;
  showComment: boolean = false;
  selectedDocId: number;
  username: string;
  Assignee: any;
  DefaultCC: any;
  Subject: any;
  TicketDescription: any;
  Status: any;
  reporter: any;
  bugStatusData: any = [];
  TDData: any = [];
  TDCols: any = [];
  StatusOptions: SelectItem[];
  TicketID: any;
  TD: any = [];
  AllTD: any = [];
  blockScreen: boolean;
  login_User: any;
  loading: boolean;
  selected: any;
  excelFileName: string;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.bugStatusData = this.masterDataService.getBugStatus();
    this.login_User = JSON.parse(this.authService.getCredentials()).user;
    this.username = this.login_User;
    // this.region = this.authService.getr
    this.onTicket();
    this.onTD();
    this.TicketReportCols = [
      { field: 'TicketID', header: 'Ticket ID' },
      { field: 'TicketDate', header: 'Ticket Date' },
      { field: 'lastdiffed', header: 'Modified Date' },
      { field: 'Status', header: 'Status' },
      { field: 'location', header: 'Location' },
      { field: 'ComponentName', header: 'Component Name' },
      { field: 'Subject', header: 'Subject' },
      { field: 'Assignee', header: 'Assignee' },
      { field: 'DefaultCC', header: 'DefaultCC' },
      { field: 'URL', header: 'URL' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'REGNNAME', header: 'Region' },
      { field: 'Dname', header: 'District' },
      { field: 'shop_number', header: 'Shop_Number' },
    ];
    this.TDCols = [
      { field: 'TicketID', header: 'TicketID' },
      { field: 'reporter', header: 'Reporter' },
      { field: 'ticketTime', header: 'Comment Date' },
      { field: 'description', header: 'Description' },
    ];
    this.excelFileName = 'MY_TICKET_REPORT ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
  }

  onSelect(type) {
    let statusSeletion = [];
    switch (type) {
      case 'Status':
        if (this.bugStatusData.length !== 0) {
          this.bugStatusData.forEach(bs => {
            statusSeletion.push({ label: bs.name, id: bs.id });
          });
          this.StatusOptions = statusSeletion;
          this.StatusOptions.unshift({ label: '-select-', value: null });
        }
        break;
    }
  }

  onTicket() {
    this.loading = true;
    const params = {
      'UserName': this.username,
      'TicketID': "A"
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res) {
        this.TicketReportData = res;
        this.loading = false;
      } else {
        this.table.reset();
        this.loading = false;
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

  onTD() {
    const params = {
      'UserName': this.username,
      'TicketID': "TD"
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res) {
        this.AllTD = res;
        if (this.TicketID !== undefined) {
          let ATD = [];
          ATD = this.AllTD;
          ATD.forEach(AllTD => {
            if (this.TicketID === AllTD.ticket_id) {
              this.TD.push({ TicketID: AllTD.ticket_id, description: AllTD.description, reporter: AllTD.reporter, ticketTime: AllTD.ticketTime });
            }
          });
        }
      }
    });
  }

  onRowSelect(event) {
    this.onResetTable();
    this.TicketID = event.data.TicketID;
    this.Assignee = event.data.Assignee;
    this.DefaultCC = event.data.DefaultCC;
    this.reporter = event.data.reporter;
    this.Subject = event.data.Subject;
    // this.URL = event.data.URL;
    this.StatusOptions = [{ label: event.data.Status, value: event.data.Status }];
    this.Status = event.data.Status;
    this.onTD();
    this.TDData = this.TD
    this.showDialog = true;
  }

  onComment() {
    this.showComment = true;
  }

  onUpdate() {
    if (this.TicketID !== undefined) {
      const params = {
        'ticketID': this.TicketID,
        'reporter': this.username,
        'ticketdescription': this.TicketDescription,
        'Status': (this.Status.label === undefined) ? this.Status : this.Status.label
      }
      this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
        if (res) {
          this.blockScreen = false;
          this.onTicket();
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket ID: ' + this.TicketID + ' Updated Successfully !'
          });
          this.onCancel();
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: res.item2
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
  }

  onSave() {
    this.blockScreen = true;
    if (this.TicketID !== undefined) {
      const params = {
        'ticket_id': this.TicketID,
        'assingedTo': this.username,
        'Ticketstatus': (this.Status.label === undefined) ? this.Status : this.Status.label,
        'short_desc': this.Subject,
        // 'reporter': '42',
        // 'URL': this.URL,
        'CC': this.DefaultCC
      }
      this.restApiService.put(PathConstants.UpdateTicket, params).subscribe(res => {
        if (res) {
          // this.TicketID = res.item3;
          // this.ticketUpdate();
          this.onUpdate();
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket Updated Successfully !'
          });
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: 'error',
            summary: 'Error Message', detail: res.item2
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
    // this.router.navigate(['/TicketDescription']);
  }

  ticketUpdate() {
    let ticketSelection = [];
    ticketSelection.forEach(res => {
      ticketSelection.push({
        TicketID: this.TicketID, AssignedTo: this.Assignee, Status: this.Status, Subject: this.Subject,
        Reporter: this.Assignee,
      });
      //URL: this.URL
    })
    // this.ticketView = ticketSelection;
  }

  onResetTable() {
    this.TDData = [];
    this.TD = [];
  }

  onCancel() {
    this.Status = null; this.Assignee = null; this.TicketID = null;
    this.DefaultCC = null; this.Subject = null; this.TicketDescription = null;
    this.StatusOptions = [];
    this.showDialog = this.showComment = false;
    // this.URL 
  }
}
