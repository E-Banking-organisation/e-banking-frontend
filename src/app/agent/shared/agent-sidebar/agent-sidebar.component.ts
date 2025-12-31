import { Component, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../auth/services/auth.service';
import {
  faChartLine,
  faUsers,
  faCreditCard,
  faClipboardList,
  faCog,
  faSignOutAlt,
  faTachometerAlt,
  faUserPlus,
  faFileInvoiceDollar,
  faAngleRight,
  faBars,
  faHistory  // ✅ Ajout
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-agent-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FaIconComponent],
  templateUrl: './agent-sidebar.component.html',
  styleUrls: ['./agent-sidebar.component.css']
})
export class AgentSidebarComponent implements OnInit {
  // FontAwesome icons
  faChartLine = faChartLine;
  faUsers = faUsers;
  faCreditCard = faCreditCard;
  faClipboardList = faClipboardList;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faTachometerAlt = faTachometerAlt;
  faUserPlus = faUserPlus;
  faFileInvoiceDollar = faFileInvoiceDollar;
  faAngleRight = faAngleRight;
  faBars = faBars;
  faHistory = faHistory;  // ✅ Ajout

  showLogoutConfirm = false;
  isCompactMode = false;
  isMobile = false;
  isFullScreen = false;
  isMobileMenuOpen = false;

  @Output() compactModeChanged = new EventEmitter<boolean>();
  @Output() mobileMenuToggled = new EventEmitter<boolean>();

  private resizeTimeout: any;

  constructor(private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenWidth();
      this.updateContainerClass();
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
      this.updateContainerClass();
      this.mobileMenuToggled.emit(this.isMobileMenuOpen);
    } else if (this.isFullScreen) {
      this.isCompactMode = false;
      this.updateContainerClass();
    } else {
      this.isCompactMode = true;
      this.updateContainerClass();
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
