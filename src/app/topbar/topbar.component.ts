import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private authService: AuthService, private themeService: ThemeService) { }
  username: string;
  tollFreeNumber: string;

  ngOnInit() {
    this.themeService.getActiveTheme();
    this.tollFreeNumber = 'Toll-free: 8939811111';
  }

  onLogout() {
    this.authService.logout();
  }

  setTheme(type) {
    switch (type) {
      case 'G':
        this.themeService.setDarkGreenTheme();
        break;
      case 'Y':
        this.themeService.setLightYellowTheme();
        break;
      case 'B':
        this.themeService.setDarkBlueTheme();
        break;
      case 'R':
        this.themeService.setLightRedTheme();
        break;
    }
  }

}
