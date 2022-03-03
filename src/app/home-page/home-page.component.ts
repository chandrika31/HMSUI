import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { RestAPIService } from '../services/restAPI.service';
import { PathConstants } from '../helper/PathConstants';
import { LocationStrategy } from '@angular/common';
import { AuthService } from '../services/auth.service';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { MasterDataService } from '../masters-services/master-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  chartJs = Chart;
  chartLabelPlugin = ChartDataLabels;
  blockScreen: boolean;
  pieOptions: any;
  chart: ChartModule;
  pieChartOptions: any;
  pieChartLabels: string[];
  pieChartColor: any;
  pieChartData: any[];
  plugin: any;
  pieData: any;
  pieLabels: string[] = [];
  bug_count: any = [];
  userInfo: any;
  allBugsCount: any = 0;
  myBugsCount: any = 0;
  headOfficeBugsCount: any = 0;
  regionBugsCount: any = 0;
  districtBugsCount: any = 0;
  shopBugsCount: any = 0;
  titleDownloadtext: string;
  OverallSLAHeadertext: string;
  OverAllSLAtext: string;
  OverallHOSLAtext: string;
  OverallRegionSLAtext: string;
  OverallDistrictSLAtext: String;
  OverallShopSLAtext: string;
  roleId: any;
  rname: string;
  dname: string
  bugStatusData: any = [];
  bug_count_ho: any = [];
  bug_count_ro: any = [];
  bug_count_do: any = [];
  bug_count_sh: any = [];
  pieDataForShops: any;
  pieDataForDistrict: any;
  pieDataForRegion: any;
  pieDataForHO: any;

  constructor(private locationStrategy: LocationStrategy, private restApi: RestAPIService,
    private authService: AuthService, private router: Router, private masterService: MasterDataService) { }

  ngOnInit() {
    this.preventBackButton();
    this.userInfo = this.authService.getLoggedUser();
    this.roleId = this.userInfo.RoleId;
    this.rname = this.userInfo.Region;
    this.dname = this.userInfo.District;
    this.onLoadGridValues();
    this.titleDownloadtext = 'Click to download .pdf';
    this.OverAllSLAtext = 'Overall SLA Status For Q1(Jan to March 2021)';
    this.OverallHOSLAtext = 'SLA For HeadOffice';
    this.OverallRegionSLAtext = (this.roleId === 1 || this.roleId === 2) ?
      'SLA For All RMC' : 'SLA For Region - ' + this.rname;
    this.OverallDistrictSLAtext = (this.roleId === 1 || this.roleId === 2) ?
      'SLA For All DMC' : (this.roleId === 3) ? 'SLA For District' : 'SLA For District - ' + this.dname;
    this.OverallShopSLAtext = 'SLA For Shops';
    this.OverallSLAHeadertext = 'Tasmac ' + ((this.roleId === 1 || this.roleId === 2) ? ' Head Office' :
      (this.roleId === 3) ? ' Region Office - ' + this.rname :
        (this.roleId === 4) ? ' District Office - ' + this.dname : '');
    this.restApi.get(PathConstants.BugStatus).subscribe(bugstatus => {
      bugstatus.forEach(bs => {
        this.bugStatusData.push({ 'name': bs.value, 'id': bs.id });
      });
      this.onLoadChart();
    });
  }

  onLoadGridValues() {
    this.restApi.getByParameters(PathConstants.DashboardTicketCount, { 'userId': this.userInfo.Id }).subscribe(data => {
      if (data.length !== 0 && data !== undefined && data !== null) {
        data.forEach((d, index) => {
          d.forEach(i => {
            if (index === 0) {
              this.allBugsCount = i.total_bugs;
            } else if (index === 1) {
              this.myBugsCount = i.user_bugs + ' / ' + this.allBugsCount;
            } else {
              if (i.product_id === 2) {
                this.headOfficeBugsCount = i.product_bugs + ' / ' + this.allBugsCount;
              } else if (i.product_id === 3) {
                this.regionBugsCount = i.product_bugs + ' / ' + this.allBugsCount;
              } else if (i.product_id === 4) {
                this.districtBugsCount = i.product_bugs + ' / ' + this.allBugsCount;
              } else if (i.product_id === 5) {
                this.shopBugsCount = i.product_bugs + ' / ' + this.allBugsCount;
              }
            }
          })
        })
      }
    });

  }

  onLoadChart() {
    this.bugStatusData.forEach(b => {
      if (b.id === 7 || b.id === 6 || b.id === 5 || b.id === 2) {
        this.pieLabels.push(b.name);
      }
    })
    let filteredArr = [];
    this.restApi.getByParameters(PathConstants.HMSReportURL, { 'value': 1 }).subscribe(res => {
      res.forEach(x => {
        if (x.status_code === 8) {
          x.bug_status = 'OPEN';
        } else if (x.status_code === 4) {
          x.bug_status = 'COMPLETED';
        }
      })
      if (this.roleId === 1 || this.roleId === 2) {
        filteredArr = res;
      } else if (this.roleId === 3) {
        filteredArr = res.filter(f => {
          return f.product_id === 3 || f.product_id === 4 || f.product_id === 5
        })
      } else if (this.roleId === 4) {
        filteredArr = res.filter(f => {
          return f.product_id === 4 || f.product_id === 5
        })
      }
      for (let i = 0; i < this.pieLabels.length; i++) {
        let count = 0
        filteredArr.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            count += c.bug_count
          }
        })
        this.bug_count.push(count);
      }
      this.pieData = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count,
            backgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ],
            hoverBackgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ]
          }]
      };
      let filteredArrHO = res.filter(f => {
        return f.product_id === 2
      })
      for (let i = 0; i < this.pieLabels.length; i++) {
        let count = 0
        filteredArrHO.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            count += c.bug_count
          }
        })
        this.bug_count_ho.push(count);
      }
      this.pieDataForHO = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count_ho,
            backgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ],
            hoverBackgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ]
          }]
      };
      let filteredArrRO = res.filter(f => {
        return f.product_id === 3
      })
      for (let i = 0; i < this.pieLabels.length; i++) {
        let count = 0
        filteredArrRO.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            count += c.bug_count
          }
        })
        this.bug_count_ro.push(count);
      }
      this.pieDataForRegion = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count_ro,
            backgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ],
            hoverBackgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ]
          }]
      };
      let filteredArrDO = res.filter(f => {
        return f.product_id === 4
      })
      for (let i = 0; i < this.pieLabels.length; i++) {
        let count = 0
        filteredArrDO.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            count += c.bug_count
          }
        })
        this.bug_count_do.push(count);
      }
      this.pieDataForDistrict = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count_do,
            backgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ],
            hoverBackgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ]
          }]
      };
      let filteredArrSH = res.filter(f => {
        return f.product_id === 5
      })
      for (let i = 0; i < this.pieLabels.length; i++) {
        let count = 0
        filteredArrSH.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            count += c.bug_count
          }
        })
        this.bug_count_sh.push(count);
      }
      this.pieDataForShops = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count_sh,
            backgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ],
            hoverBackgroundColor: [
              "#00e71b",
              "#ffc400",
              "#1985ff",
              "#FF0000",
            ]
          }]
      };
    })
    //Pie chart show data inside each slices
    this.chartJs.plugins.unregister(this.chartLabelPlugin);
    this.plugin = ChartDataLabels;
    this.pieOptions = {
      plugins: {
        datalabels: {
          /* show value in percents */
          formatter: (value, ctx) => {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            const percentage = (value * 100 / sum);
            const calculatedPercent = percentage !== 0 ? percentage.toFixed(0) + '%' : '';
            return calculatedPercent;
          },
          color: '#fff',
          fontSize: 18
        }
      },
      legend: {
        position: 'bottom',
        fontSize: 12
      }
    }
  }

  onPDFDownload(gridValue) {
    this.blockScreen = true;
    const fileLoc = './assets/files/';
    let fileName = '';
    switch (gridValue) {
      case 1:
        // const fileURL = pdfUrl + 'CameraUserManual.pdf';
        fileName = 'CameraUserManual';
        break;
      case 2:
        fileName = 'NetworkVideoRecorder';
        break;
      case 3:
        fileName = 'KVMSUserManual';
        break;
      case 4:
        fileName = 'CCTV_HMS_User_manual_v1';
        break;
    }
    const pdfURL = fileLoc + fileName + '.pdf';
    FileSaver.saveAs(pdfURL, fileName);
    this.blockScreen = false;
  }

  onNavigateToReport(value) {
    this.router.navigate(['/AllTicketsReport'], { queryParams: { id: value, si: true } });
  }

  selectData(event, value) {
    const index: string = event.element._index;
    this.router.navigate(['Bugzilla'], { queryParams: { id: index, value: value, si: true } });
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }
}
