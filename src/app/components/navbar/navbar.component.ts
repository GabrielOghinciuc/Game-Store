import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public darkMode = false;
  public buttonText = 'Turn on Dark Mode';
  public isScrolled = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.darkMode = localStorage.getItem('darkMode') === 'true';
      if (this.darkMode) {
        this.applyDarkMode();
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
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

  public isActive(route: string): boolean {
    return this.router.url === `/${route}`;
  }

  private applyDarkMode(): void {
    document.body.classList.add('dark-mode');
    document.querySelector('nav')?.classList.remove('navbar-light');
    document.querySelector('nav')?.classList.add('navbar-dark');
    document.querySelector('footer')?.classList.add('bg-dark', 'text-light');
    document
      .querySelector('footer')
      ?.classList.remove('bg-light', 'text-muted');

    const platformBoxes = document.querySelectorAll(
      '.platform-box:not(.cs-box)'
    );
    platformBoxes.forEach((box) => {
      (box as HTMLElement).style.background = '#212529';
      (box as HTMLElement).style.borderColor = '#495057';
    });

    const platformTitles = document.querySelectorAll(
      '.platforms-section h3, .platform-box:not(.cs-box) h5, .platform-box:not(.cs-box) i'
    );
    platformTitles.forEach((title) => {
      (title as HTMLElement).style.color = '#fff';
    });

    this.buttonText = 'Turn off Dark Mode';
  }

  private removeDarkMode(): void {
    document.body.classList.remove('dark-mode');
    document.querySelector('nav')?.classList.add('navbar-light');
    document.querySelector('nav')?.classList.remove('navbar-dark');
    document.querySelector('footer')?.classList.add('bg-light', 'text-muted');
    document.querySelector('footer')?.classList.remove('bg-dark', 'text-light');

    const platformBoxes = document.querySelectorAll(
      '.platform-box:not(.cs-box)'
    );
    platformBoxes.forEach((box) => {
      (box as HTMLElement).style.background = '#f8f9fa';
      (box as HTMLElement).style.borderColor = '#dee2e6';
    });

    const platformTitles = document.querySelectorAll(
      '.platforms-section h3, .platform-box:not(.cs-box) h5, .platform-box:not(.cs-box) i'
    );
    platformTitles.forEach((title) => {
      (title as HTMLElement).style.color = '#212529';
    });

    this.buttonText = 'Turn on Dark Mode';
  }
}
