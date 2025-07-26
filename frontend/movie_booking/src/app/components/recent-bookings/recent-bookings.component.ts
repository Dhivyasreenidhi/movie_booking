// recent-bookings.component.ts
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Optional for forms
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-recent-bookings',
  templateUrl: './recent-bookings.component.html',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTableModule

    
  ],
  styleUrls: ['./recent-bookings.component.css']
})
export class RecentBookingsComponent implements OnInit {
  recentBookings: any[] = [];
  displayedColumns: string[] = ['user', 'movie', 'seats', 'time', 'status'];

  constructor(private bookingService: BookingService) {}

  ngOnInit() {
    this.bookingService.getRecentBookings().subscribe(data => {
      this.recentBookings = data;
    });
  }
}