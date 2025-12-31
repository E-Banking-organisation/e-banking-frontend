import { Component, EventEmitter, HostListener, inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../auth/services/auth.service';
import {
  faChartLine,
  faUsers,
  faCog,
  faSignOutAlt,
  faMoneyBillWave,
  faExchangeAlt,
  faGlobe,
  faBars,
  faHistory  // ✅ Ajout
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FaIconComponent],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  faChartLine = faChartLine;
  faUsers = faUsers;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faMoneyBillWave = faMoneyBillWave;
  faExchangeAlt = faExchangeAlt;
  faGlobe = faGlobe;
  faBars = faBars;
  faHistory = faHistory;  // ✅ Ajout

  showLogoutConfirm = false;
  isCompactMode = false;
  isMobile = false;
  isFullScreen = false;
  isMobileMenuOpen = false;

  @Output() compactModeChanged = new EventEmitter<boolean>();
  @Output() mobileMenuToggled = new EventEmitter<boolean>();

  private resizeTimeout: ReturnType<typeof setTimeout> | undefined;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenWidth();
    }
  }

  toggleSideNav(): void {
    if (this.isMobile) {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      this.updateContainerClass();
      this.mobileMenuToggled.emit(this.isMobileMenuOpen);
    } else {
      this.isCompactMode = !this.isCompactMode;
      this.updateContainerClass();
      this.compactModeChanged.emit(this.isCompactMode);
    }
  }

  private updateContainerClass(): void {
    const container = document.querySelector('.nav-container');
    if (container) {
      if (this.isMobile && this.isMobileMenuOpen) {
        container.classList.add('open');
      } else if (this.isMobile) {
        container.classList.remove('open');
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.checkScreenWidth(), 200);
    }
  }

  private checkScreenWidth(): void {
    const width = window.innerWidth;
    this.isMobile = width <= 768;
    this.isFullScreen = width > 1300;

    if (this.isMobile) {
      this.isCompactMode = false;
      this.isMobileMenuOpen = false;
      this.mobileMenuToggled.emit(this.isMobileMenuOpen);
    } else if (this.isFullScreen) {
      this.isCompactMode = false;
    } else {
      this.isCompactMode = true;
    }
    this.compactModeChanged.emit(this.isCompactMode);
  }

  openLogoutConfirm(): void {
    this.showLogoutConfirm = true;
  }

  cancelLogout(): void {
    this.showLogoutConfirm = false;
  }

  confirmLogout(): void {
    this.authService.logout();
    this.showLogoutConfirm = false;
  }
}
