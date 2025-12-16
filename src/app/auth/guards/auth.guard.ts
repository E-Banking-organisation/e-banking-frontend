import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  CanActivateChild, 
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Vérifier si la route a des restrictions de rôle
      if (
        route.data['roles'] && 
        route.data['roles'].indexOf(currentUser.role) === -1
      ) {
        // Rôle non autorisé, rediriger vers la page principale selon le rôle
        this.authService.redirectBasedOnRole(currentUser);
        return false;
      }

      // Utilisateur connecté avec bon rôle
      return true;
    }

    // Non connecté, rediriger vers login
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(route, state);
  }
}