import { Component, HostListener, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AdminSidebarComponent } from '../shared/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  isMobile = false;
  sideNavCompact = false;
  mobileMenuOpen = false;

  private resizeTimeout: ReturnType<typeof setTimeout> | undefined;
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.updateLayout();
  }

  @ViewChild(AdminSidebarComponent) sidenavComponent!: AdminSidebarComponent;

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
