import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  username = '';
  constructor(private router: Router) { }

  ngOnInit() {
    this.username = 'Admin';
  }


  async logout() {
    this.gotoPage('login');
  }

  gotoPage(pageName: string) {
    this.router.navigate([pageName]);
  }
}
