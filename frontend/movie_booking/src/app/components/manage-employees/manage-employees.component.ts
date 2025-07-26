import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { debounceTime, Subject } from 'rxjs';

interface User {
  id: number;
  email_or_phone: string;
  created_at: string;
}

@Component({
  selector: 'app-manage-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    SidebarComponent,
    NavBarComponent
  ],
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css']
})
export class ManageEmployeesComponent implements OnInit {
  // Pagination
  currentPage: number = 1;
  usersPerPage: number = 5;
  get totalPages(): number {
    return Math.ceil(this.filteredUsersRaw.length / this.usersPerPage) || 1;
  }
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.usersPerPage;
    return this.filteredUsersRaw.slice(start, start + this.usersPerPage);
  }
  get filteredUsersRaw(): User[] {
    return this.users.filter(user =>
      user.email_or_phone.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  users: User[] = [];

  selectedUser: User | null = null;
  showDeleteConfirmation: boolean = false;
  userToDelete: User | null = null;
  notifications: { message: string; type: 'success' | 'error' }[] = [];
  searchTerm: string = '';
  private searchSubject: Subject<string> = new Subject();

  ngOnInit(): void {
    // Debounce search input to improve performance
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.searchTerm = term;
    });
    // Fetch users from backend API
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => this.users = data)
      .catch(() => this.showNotification('Failed to fetch users', 'error'));
  }

  get filteredUsers(): User[] {
    return this.paginatedUsers;
  }

  isActive(user: User): boolean {
    return true; // No status/lastLogin info in new table
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.showDeleteConfirmation = true;
  }

  deleteUser(): void {
    if (this.userToDelete) {
      this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
      this.showNotification('User removed successfully', 'success');
      this.showDeleteConfirmation = false;
      this.userToDelete = null;
      this.selectedUser = null;
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.userToDelete = null;
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notifications.push({ message, type });
    setTimeout(() => {
      this.notifications.shift();
    }, 3000);
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  getStatusClass(isActive: boolean): string {
    return 'bg-green-100 text-green-800';
  }
}