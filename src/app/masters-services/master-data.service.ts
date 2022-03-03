import { Injectable } from '@angular/core';
import { RestAPIService } from '../services/restAPI.service';
import { PathConstants } from '../Helper/PathConstants';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  regions?: any;
  districts?: any;
  products?: any;
  shops?: any;
  reasons?: any;
  bugStatus?: any;
  cc?: any;
  issuesType: any[];
  minDate: Date;
  roleId: any;
  role_regions: any;
  loggedInRcode: any;

  constructor(private restApiService: RestAPIService, private authService: AuthService) {
    this.roleId = this.authService.getLoggedUser().RoleId;
    this.loggedInRcode = this.authService.getLoggedUser().RCode;
  }

  getRegions() {
    this.regions = [];
    this.restApiService.get(PathConstants.RegionMasterURL).subscribe(reg => {
      reg.forEach(r => {
        this.regions.push({ 'name': r.REGNNAME, 'code': r.REGNCODE, 'address': r.Address });
      })
    })
    return this.regions;
  }

  getDistricts() {
    this.districts = [];
    this.restApiService.get(PathConstants.DistrictMasterURL).subscribe(dist => {
      dist.forEach(d => {
        this.districts.push({ 'name': d.Dname, 'code': d.Dcode, 'rcode': d.Rcode, 'address': d.Address });
      })
    })
    return this.districts;
  }

  getProducts() {
    this.products = [];
    this.restApiService.get(PathConstants.ProductsGetURL).subscribe(product => {
      product.forEach(p => {
        this.products.push({ 'name': p.name, 'id': p.id });
      })
    })
    return this.products;
  }

  getShops() {
    this.shops = [];
    this.restApiService.getByParameters(PathConstants.ShopsGetURL, { 'type': 2 }).subscribe(shop => {
      shop.forEach(s => {
        this.shops.push({ 'shop_num': s.SHOPNO, 'dcode': s.Dcode, 'address': s.SHOPADDRESS });
      })
    })
    return this.shops;
  }

  getReasons() {
    this.reasons = [];
    this.restApiService.get(PathConstants.ReasonMasterGetURL).subscribe(reason => {
      reason.forEach(r => {
        this.reasons.push({ 'name': r.reason, 'id': r.reason_id, 'type': r.reason_type });
      });
    });
    return this.reasons;
  }

  getBugStatus() {
    this.bugStatus = [];
    this.restApiService.get(PathConstants.BugStatus).subscribe(bugstatus => {
      bugstatus.forEach(bs => {
        this.bugStatus.push({ 'name': bs.value, 'id': bs.id });
      });
    });
    return this.bugStatus;
  }

  getComponentCC() {
    this.cc = [];
    this.restApiService.get(PathConstants.ComponentCC).subscribe(cc => {
      cc.forEach(cc => {
        this.cc.push({ 'name': cc.login_name, 'id': cc.component_id, 'assiginee': cc.realname });
      });
    });
    return this.cc;
  }

  getIssuesType() {
    this.issuesType = [];
    this.restApiService.get(PathConstants.IssuesTypeGet).subscribe(issues => {
      issues.forEach(it => {
        this.issuesType.push({ 'id': it.Iss_ID, 'type': it.Type });
      })
    });
    return this.issuesType;
  }

  getMinDate() {
    const currentDate = new Date().getDate(); //current date
    const currentMonth = new Date().getMonth() + 1; //current month
    const currentYear = new Date().getFullYear(); //current year
    const prevMonth = new Date().getMonth(); //previous month
    const prevYear = new Date().getFullYear() - 1; //previous year
    const days = 30; // setting minimum no.of days
    //getting previous month last date
    var d = new Date(); // current date
    d.setDate(1); // going to 1st of the month
    d.setHours(-1);
    //end
    const prevDate = d.getDate(); //previous month date
    const minDays = (currentDate - days);
    const date = (minDays < 0) ? (prevDate + minDays) : ((minDays === 0) ? prevDate : minDays);//date to set
    let month = (minDays <= 0) ? prevMonth : currentMonth;//month to set
    const year = (month === 12 && prevMonth === 1) ? prevYear : currentYear;//year to set
    this.minDate = new Date();
    this.minDate.setDate(date);
    month = (month === 1) ? 12 : month - 1;//since month are zero based
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);
    return this.minDate;
  }

  getRoleWiseRegions() {
    this.role_regions = [];
    this.restApiService.get(PathConstants.RegionMasterURL).subscribe(reg => {
      reg.forEach(r => {
        if ((this.roleId === 3 || this.roleId === 4) && r.REGNCODE === this.loggedInRcode) {
          this.role_regions.push({ 'name': r.REGNNAME, 'code': r.REGNCODE, 'address': r.Address });
        } else {
          this.role_regions.push({ 'name': r.REGNNAME, 'code': r.REGNCODE, 'address': r.Address });
        }
      })
    })
    return this.role_regions;
  }
}
