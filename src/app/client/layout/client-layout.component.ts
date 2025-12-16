import {Component, Inject, OnInit, HostListener, PLATFORM_ID, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {isPlatformBrowser, NgClass, NgIf} from '@angular/common';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {SideNavComponent} from '../side-nav/side-nav.component';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent, NgClass, NgIf],
  templateUrl: './client-layout.component.html',
  styleUrls: ['./client-layout.component.css']
})
export class ClientLayoutComponent implements OnInit {
  title = 'frontend-app';
  isMobile = false;
  sideNavCompact = false;
  mobileMenuOpen = false;
  faBars = faBars;

  private resizeTimeout: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.updateLayout();
  }

  @ViewChild('sidenav') sidenavComponent!: SideNavComponent;

  openSideNav() {
    this.sidenavComponent.toggleSideNav();
  }

  @HostListener('window:resize')
  onResize() {
    if (!isPlatformBrowser(this.platformId)) return;
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.updateLayout(), 200);
  }

  updateLayout() {
    if (!isPlatformBrowser(this.platformId)) return;
    const width = window.innerWidth;
    this.isMobile = width <= 768;
    this.sideNavCompact = width <= 1300 && !this.isMobile;
    if (this.isMobile) {
      this.mobileMenuOpen = false;
      this.sideNavCompact = false;
    }
  }

  onSideNavCompactModeChanged(isCompact: boolean): void {
    this.sideNavCompact = isCompact;
  }

  onMobileMenuToggled(isOpen: boolean): void {
    this.mobileMenuOpen = isOpen;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.onMobileMenuToggled(this.mobileMenuOpen);
  }

  getContainerClasses() {
    return {
      'compact-mode': this.sideNavCompact,
      'mobile-menu-open': this.mobileMenuOpen,
      'mobile-menu-closed': !this.mobileMenuOpen && this.isMobile,
      'mobile': this.isMobile
    };
  }
}
