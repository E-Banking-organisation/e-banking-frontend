import { Component, OnInit, HostListener, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { AgentSidebarComponent } from '../shared/agent-sidebar/agent-sidebar.component';

@Component({
  selector: 'app-agent-layout',
  standalone: true,
  imports: [RouterOutlet, AgentSidebarComponent, NgClass],
  templateUrl: './agent-layout.component.html',
  styleUrls: ['./agent-layout.component.css']
})
export class AgentLayoutComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  @ViewChild(AgentSidebarComponent) sidenavComponent!: AgentSidebarComponent;

  isMobile = false;
  sideNavCompact = false;
  mobileMenuOpen = false;

  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.updateLayout();
  }

  openSideNav(): void {
    this.sidenavComponent.toggleSideNav();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => this.updateLayout(), 200);
  }

  updateLayout(): void {
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

  getContainerClasses(): Record<string, boolean> {
    return {
      'compact-mode': this.sideNavCompact,
      'mobile-menu-open': this.mobileMenuOpen,
      'mobile-menu-closed': !this.mobileMenuOpen && this.isMobile,
      'mobile': this.isMobile
    };
  }
}
