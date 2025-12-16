import { Component, Inject, OnInit, HostListener, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { AgentSidebarComponent } from '../shared/agent-sidebar/agent-sidebar.component';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [RouterOutlet, AgentSidebarComponent, NgClass, NgIf],
  templateUrl: './agent-layout.component.html',
  styleUrls: ['./agent-layout.component.css']
})
export class AgentLayoutComponent implements OnInit {
  isMobile = false;
  sideNavCompact = false;
  mobileMenuOpen = false;

  private resizeTimeout: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.updateLayout();
  }

  @ViewChild(AgentSidebarComponent) sidenavComponent!: AgentSidebarComponent;

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
