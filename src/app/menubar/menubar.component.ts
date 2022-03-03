import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  items: MenuItem[];
  showNavBar: boolean;
  roleId: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.showNavBar = false;
    this.roleId = this.authService.getLoggedUser().RoleId;
    const showMenu = true;
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home' },
      {
        label: 'Ticket', icon: 'pi pi-ticket', visible: showMenu,
        items: [
          { label: 'New Ticket', icon: '', routerLink: '/NewTicket' },
          { label: 'Update Ticket', routerLink: '/TicketUpdate' },
          // { label: 'Search Ticket', icon: '', routerLink: '/SearchTicket' },
        ]
      },
      {
        label: 'Relocation', icon: 'pi pi-file', visible: showMenu,
        items: [
          { label: 'RO/DO/Shop', routerLink: '/RelocationForm' },
        ]
      },
      {
        label: 'Incident', icon: 'pi pi-file', visible: showMenu,
        items: [
          { label: 'Theft', routerLink: '/TheftForm' },
          { label: 'Riot', routerLink: '/RiotForm' },
          { label: 'Natural Calamities', routerLink: '/CalamityForm' },
        ]
      },
      {
        label: 'Reports', icon: 'pi pi-fw pi-chart-line', visible: showMenu,
        items: [
          {
            label: 'All Tickets', routerLink: '/TicketReport'
          },
          {
            label: 'My Tickets', routerLink: '/MyTickets'
          },
          {
            label: 'Tickets By Date', routerLink: '/TicketByDateReport'
          },
          {
            label: 'Relocation', routerLink: '/RelocationReport'
          },
          {
            label: 'Theft', routerLink: '/TheftReport'
          },
          {
            label: 'Riots', routerLink: '/RiotReport'
          },
          {
            label: 'Natural Calamity', routerLink: '/CalamityReport'
          }
        ]
      },
      {
        label: 'User', icon: 'pi pi-fw pi-user-edit', visible: showMenu,
        items: [
          {
            label: 'User Profile', routerLink: '/UserProfile'
          },
          {
            label: 'Change Password', routerLink: '/ChangePassword'
          },
        ]
      }
    ];
  }

}
