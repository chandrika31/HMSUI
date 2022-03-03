import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { NewTicketComponent } from './Documents/new-ticket/new-ticket.component';
import { AuthGuard } from './services/auth.guard';
import { TicketReportComponent } from './reports/ticket-report/ticket-report.component';
import { MyTicketsComponent } from './reports/my-tickets/my-tickets.component';
import { SearchTicketComponent } from './search-ticket/search-ticket.component';
import { TicketUpdateComponent } from './ticket-update/ticket-update.component';
import { ChangePasswordComponent } from './profiles/change-password/change-password.component';
import { TicketReportBydateComponent } from './reports/ticket-report-bydate/ticket-report-bydate.component';
import { BugzillaReportComponent } from './reports/bugzilla-report/bugzilla-report.component';
import { AllTicketsReportComponent } from './reports/all-tickets-report/all-tickets-report.component';
import { RelocationFormComponent } from './Documents/relocation-form/relocation-form.component';
import { TheftFormComponent } from './Documents/theft-form/theft-form.component';
import { TheftReportComponent } from './reports/theft-report/theft-report.component';
import { ReloctaionReportComponent } from './reports/reloctaion-report/reloctaion-report.component';
import { RiotFormComponent } from './Documents/riot-form/riot-form.component';
import { NaturalCalamitiesComponent } from './Documents/natural-calamities/natural-calamities.component';
import { MyProfileComponent } from './profiles/my-profile/my-profile.component';
import { RiotsReportComponent } from './reports/riots-report/riots-report.component';
import { CalamityReportComponent } from './reports/calamity-report/calamity-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  { path: 'Bugzilla', component: BugzillaReportComponent, canActivate: [AuthGuard] },
  { path: 'MyTickets', component: MyTicketsComponent, canActivate: [AuthGuard] },
  { path: 'SearchTicket', component: SearchTicketComponent, canActivate: [AuthGuard] },
  { path: 'NewTicket', component: NewTicketComponent, canActivate: [AuthGuard] },
  { path: 'TicketReport', component: TicketReportComponent, canActivate: [AuthGuard] },
  { path: 'TicketUpdate', component: TicketUpdateComponent, canActivate: [AuthGuard] },
  { path: 'ChangePassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'TicketByDateReport', component: TicketReportBydateComponent, canActivate: [AuthGuard] },
  { path: 'AllTicketsReport', component: AllTicketsReportComponent, canActivate: [AuthGuard] },
  { path: 'RelocationForm', component: RelocationFormComponent, canActivate: [AuthGuard] },
  { path: 'TheftForm', component: TheftFormComponent, canActivate: [AuthGuard] },
  { path: 'TheftReport', component: TheftReportComponent, canActivate: [AuthGuard] },
  { path: 'RiotReport', component: RiotsReportComponent, canActivate: [AuthGuard] },
  { path: 'CalamityReport', component: CalamityReportComponent, canActivate: [AuthGuard] },
  { path: 'RiotForm', component: RiotFormComponent, canActivate: [AuthGuard] },
  { path: 'CalamityForm', component: NaturalCalamitiesComponent, canActivate: [AuthGuard] },
  { path: 'RelocationReport', component: ReloctaionReportComponent, canActivate: [AuthGuard] },
  { path: 'UserProfile', component: MyProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
