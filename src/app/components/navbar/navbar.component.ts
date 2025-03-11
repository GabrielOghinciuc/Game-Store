import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  darkMode = false;
  buttonText = 'Turn on Dark Mode';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.darkMode = localStorage.getItem('darkMode') === 'true'; // Verificăm starea dark mode
      if (this.darkMode) {
        this.applyDarkMode();
      }
    }
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      localStorage.setItem('darkMode', 'true');
      this.applyDarkMode();
    } else {
      localStorage.removeItem('darkMode');
      this.removeDarkMode();
    }
  }

  isActive(route: string): boolean {
    return this.router.url === `/${route}`;
  }

  private applyDarkMode(): void {
    document.body.classList.add('dark-mode');
    document.querySelector('nav')?.classList.add('navbar-dark', 'bg-dark');
    document.querySelector('nav')?.classList.remove('navbar-light', 'bg-light');
    document.querySelector('footer')?.classList.add('bg-dark', 'text-light');
    document
      .querySelector('footer')
      ?.classList.remove('bg-light', 'text-muted');

    this.buttonText = 'Turn off Dark Mode';
  }

  private removeDarkMode(): void {
    document.body.classList.remove('dark-mode');
    document.querySelector('nav')?.classList.add('navbar-light', 'bg-light');
    document.querySelector('nav')?.classList.remove('navbar-dark', 'bg-dark');

    document.querySelector('footer')?.classList.add('bg-light', 'text-muted');
    document.querySelector('footer')?.classList.remove('bg-dark', 'text-light');

    this.buttonText = 'Turn on Dark Mode';
  }
}
