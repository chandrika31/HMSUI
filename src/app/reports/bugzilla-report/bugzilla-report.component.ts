import { Component, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-bugzilla-report',
  templateUrl: './bugzilla-report.component.html',
  styleUrls: ['./bugzilla-report.component.css']
})
export class BugzillaReportComponent implements OnInit {
  bugzillaCols: any;
  bugzillaData: any = [];
  loading: boolean;
  items: MenuItem[];
  excelFileName: string;
  @ViewChild('dt', { static: false }) table: Table;
  index: string;
  type: string;

  constructor(private restApi: RestAPIService, private route: ActivatedRoute,
    private messageService: MessageService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Excel', icon: 'pi pi-file-excel', command: () => {
          this.table.exportCSV();
        }
      },
      {
        label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
          this.exportPdf();
        }
      },
    ];
    this.index = this.route.snapshot.queryParamMap.get('id');
    this.type = this.route.snapshot.queryParamMap.get('value');
    this.bugzillaCols = [
      { field: 'ticket_id', header: 'Ticket ID' },
      { field: 'assigned_to', header: 'Assigned To' },
      { field: 'ticket_status', header: 'Ticket Status' },
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'pname', header: 'Product' },
      { field: 'cname', header: 'Component' },
      { field: 'short_desc', header: 'Description' },
      { field: 'creation_ts', header: 'Created Date' }
    ];
    this.loading = true;
    this.onLoadData();
  }

  onFilterData() {
    if (this.index !== undefined && this.index !== null) {
      this.bugzillaData = this.bugzillaData.filter(y => {
        return (this.index === '3' && (y.status_code === 8 || y.status_code === 2))
          || (this.index === '2' && y.status_code === 5)
          || (this.index === '1' && y.status_code === 6)
          || (this.index === '0' && (y.status_code === 7 || y.status_code === 4))
      })
    }
  }

  onLoadData() {
    this.restApi.get(PathConstants.HMSReportURL).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        this.bugzillaData = data;
        if (this.type !== null && this.type !== undefined) {
          switch (this.type) {
            case '0':
              //all data
              this.bugzillaData = data;
              break;
            case '1':
              //head office
              this.bugzillaData = this.bugzillaData.filter(f => {
                return f.product_id === 2
              })
              break;
            case '2':
              //region
              this.bugzillaData = this.bugzillaData.filter(f => {
                return f.product_id === 3
              })
              break;
            case '3':
              //district
              this.bugzillaData = this.bugzillaData.filter(f => {
                return f.product_id === 4
              })
              break;
            case '4':
              //shops
              this.bugzillaData = this.bugzillaData.filter(f => {
                return f.product_id === 5
              })
              break;
          }
        }
        this.excelFileName = 'BUGZILLA_STATUS_REPORT ' + this.datepipe.transform(new Date(), 'dd-MM-yyyy hh:mm a');
        this.loading = false;
      } else {
        this.loading = false;
        this.table.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'No record found!'
        });
      }
    }, (err: HttpErrorResponse) => {
      this.loading = false;
      this.table.reset();
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
    }, () => this.onFilterData());
  }

  onDownload() {

  }
  exportPdf() {
    var rows = [];
    this.bugzillaData.forEach(element => {
      var temp = [element.bug_id, element.bug_severity,
      element.bug_status, element.assigned_to, element.short_desc,
      element.creation_ts];
      rows.push(temp);
    });
    // import("jspdf").then(jsPDF => {
    //   import("jspdf-autotable").then(x => {
    //     const doc = new jsPDF.default('l', 'pt', 'a4');
    //     doc.autoTable(this.bugzillaCols, rows);
    //     doc.save('HELPDESK_STATUS_REPORT.pdf');
    //   })
    // })
  }
}
