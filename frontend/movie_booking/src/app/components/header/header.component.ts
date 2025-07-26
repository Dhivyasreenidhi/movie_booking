import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Route } from '@angular/router';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  user: string | null = null;

  constructor() {
    this.user = localStorage.getItem('user');
  }

  logout() {
    localStorage.removeItem('user');
    window.location.reload();
  }
}
