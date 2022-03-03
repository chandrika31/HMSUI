import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from '../Helper/PathConstants';
import { MasterDataService } from '../masters-services/master-data.service';
import { AuthService } from '../services/auth.service';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-search-ticket',
  templateUrl: './search-ticket.component.html',
  styleUrls: ['./search-ticket.component.css']
})
export class SearchTicketComponent implements OnInit {
  TicketReportData: any = [];
  TicketReportCols: any = [];
  TicketID: any;
  ShowTable: boolean = false;
  bugStatusData: any = [];
  StatusOptions: SelectItem[];
  Status: any;
  TD: any = [];
  AllTD: any = [];
  username: string;
  showDialog: boolean = false;
  showComment: boolean = false;
  selectedDocId: number;
  Assignee: any;
  DefaultCC: any;
  URL: any;
  Subject: any;
  TicketDescription: any;
  reporter: any;
  TDData: any = [];
  TDCols: any = [];
  blockScreen: boolean;
  Ticket: any;
  ID: any;
  TT: [];
  login_User: any;
  loading: boolean;
  selected: any;
  dialogHeader: string;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.bugStatusData = this.masterDataService.getBugStatus();
    this.login_User = JSON.parse(this.authService.getCredentials()).user;
    this.username = this.login_User;
    this.onTD();
    this.TicketReportCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
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
      // { field: 'TicketID', header: 'TicketID' },
      // { field: 'reporter', header: 'Reporter' },
      // { field: 'ticketTime', header: 'Comment Date' },
      { field: 'description', header: 'Description' },
    ];
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
    const params = {
      'UserName': "ST",
      'TicketID': (this.ID !== undefined && this.ID !== null) ? this.ID : 0
    }
    this.restApiService.getByParameters(PathConstants.MYTicket, params).subscribe(res => {
      if (res.length !== 0 && res !== undefined && res !== null) {
        this.TicketReportData = res;
        let sno = 0;
        this.TicketReportData.forEach(result => {
          sno += 1;
          result.SlNo = sno;
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'warn',
          summary: 'Warning Message', detail: 'Invalid ticket id!'
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

  onKeyEnter(value) {
    const id = value.toString().trim();
    if (id !== '' && value !== undefined && value !== null) {
      this.onTicket();
    }
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
    this.URL = event.data.URL;
    this.dialogHeader = 'Update Ticket ' + this.ticketID + - 'Reported By - ' + this.reporter;
    this.StatusOptions = [{ label: event.data.Status, value: event.data.status_code }];
    this.Status = [{ label: event.data.Status, value: event.data.status_code }];
    this.onTD();
    this.showDialog = true;
  }

  get description() {
    return this.TDData.map((o) => o.description);
  }
  get ticketID() {
    return this.TDData.map((o) => o.TicketID);
  }

  onUpdate() {
    if (this.TicketID !== undefined) {
      const params = {
        'ticketID': this.TicketID,
        'reporter': this.username,
        'ticketdescription': this.TicketDescription,
        'Status': (this.Status !== undefined && this.Status !== null) ? this.Status.label : null,
        'StatusCode': (this.Status !== undefined && this.Status !== null) ? this.Status.value : null,
      }
      this.restApiService.post(PathConstants.TicketDescription, params).subscribe(res => {
        if (res) {
          this.blockScreen = false;
          this.onTicket();
          this.messageService.clear();
          this.messageService.add({
            key: 'd-err', severity: 'success',
            summary: 'Success Message', detail: 'Ticket ID: ' + this.TicketID + ' Updated Successfully !'
          });
          this.CancelTD();
          this.onTD();
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 'd-err', severity: 'error',
            summary: 'Error Message', detail: res.item2
          });
        }
      }, (err: HttpErrorResponse) => {
        this.blockScreen = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 'd-err', severity: 'error',
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
        'URL': "Tasmac-hms.com",
        'CC': this.DefaultCC
      }
      this.restApiService.put(PathConstants.UpdateTicket, params).subscribe(res => {
        if (res) {
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
  }

  ticketUpdate() {
    let ticketSelection = [];
    ticketSelection.forEach(res => {
      ticketSelection.push({
        TicketID: this.TicketID, AssignedTo: this.Assignee, Status: this.Status, Subject: this.Subject,
        Reporter: this.Assignee, URL: this.URL
      });
    })
  }

  onResetTable() {
    this.TDData = [];
    this.TD = [];
    this.ID = null;
  }

  onCancel() {
    this.Status = this.Assignee = this.TicketID = this.DefaultCC = this.Subject = this.URL = this.TicketDescription = null;
    this.StatusOptions = [];
  }

  CancelTD() {
    this.TD = [];
    this.TicketDescription = null;
  }

}