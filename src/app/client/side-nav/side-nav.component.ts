import {Component, EventEmitter, HostListener, Inject, OnInit, Output, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../auth/services/auth.service';
import {
  faExchangeAlt,
  faSignOutAlt,
  faTachometerAlt,
  faUniversity,
  faStore,
  faWallet,
  faBoxOpen,
  faUserCog,
  faBars,
  faBarChart,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ]
})


export class SideNavComponent implements OnInit {
  faTachometerAlt = faTachometerAlt;
  faUniversity = faUniversity;
  faExchangeAlt = faExchangeAlt;
  faStore = faStore;
  faWallet = faWallet;
  faBoxOpen = faBoxOpen;
  faUserCog = faUserCog;
  faSignOutAlt = faSignOutAlt;
  faBarChart = faBarChart;
  faBars = faBars;
  faUserFriends = faUserFriends;

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
        container.classList.add('is-open');
      } else if (this.isMobile) {
        container.classList.remove('is-open');
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
      if (!this.isMobileMenuOpen) {
        this.isMobileMenuOpen = true;
      }
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
