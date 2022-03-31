import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router) {
  }
  public mainMenu = '';

  ngOnInit() {
    this.menuClickWelcome();
  }

  menuClickData() {
    this.mainMenu = 'data';
    this.router.navigate(['/web/data']);
    this.setHighlight();
  }

  menuClickAnalytics() {
    this.mainMenu = 'analytics';
    this.router.navigate(['/web/analytics']);
    this.setHighlight();
  }

  menuClickWelcome() {
    this.mainMenu = 'welcome';
    this.router.navigate(['/web/welcome']);
    this.setHighlight();
  }

  menuClickPerformance() {
    this.mainMenu = 'performance';
    this.router.navigate(['/web/performance']);
    this.setHighlight();
  }

  menuClickReports() {
    this.mainMenu = 'reports';
    this.router.navigate(['/web/reports']);
    this.setHighlight();
  }

  setHighlight() {
    let menuBoxes = document.getElementsByClassName("menu-box");
    for (let i = 0; i < menuBoxes.length; i++) {
      menuBoxes[i].className = menuBoxes[i].className.replace(" active", "");
    }

    let menuBox = document.getElementById(this.mainMenu + "-menu");
    menuBox.className += " active";
  }
}
