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
    this.menuClickData();
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

  menuClickTest() {
    this.mainMenu = 'test';
    this.router.navigate(['/web/test']);
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
