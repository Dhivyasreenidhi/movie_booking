// report-management.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-report-management',
  imports: [SidebarComponent,NavBarComponent],
  templateUrl: './report-management.component.html',
  styleUrls: ['./report-management.component.css']
})
export class ReportManagementComponent {
  reportForm: FormGroup;
  reportTypes = [
    { id: 1, name: 'Sales Report' },
    { id: 2, name: 'Booking Summary' },
    { id: 3, name: 'Movie Performance' },
    { id: 4, name: 'Theater Performance' },
    { id: 5, name: 'User Activity' },
    { id: 6, name: 'Cancellation Report' },
    { id: 7, name: 'Payment Summary' }
  ];
  
  movies = [
    { id: 1, name: 'Avengers: Endgame' },
    { id: 2, name: 'The Batman' },
    { id: 3, name: 'Dune' }
  ];
  
  theaters = [
    { id: 1, name: 'Cineplex Downtown' },
    { id: 2, name: 'IMAX City Center' },
    { id: 3, name: 'Starlight Multiplex' }
  ];
  
  cities = [
    { id: 1, name: 'New York' },
    { id: 2, name: 'Los Angeles' },
    { id: 3, name: 'Chicago' }
  ];
  
  reportData: any[] = [];
  isLoading = false;
  selectedReportType: number = 1;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
    this.reportForm = this.fb.group({
      reportType: [1],
      startDate: [null],
      endDate: [null],
      movie: [null],
      theater: [null],
      city: [null],
      paymentMethod: [null],
      bookingStatus: [null]
    });
  }

  onReportTypeChange() {
    this.selectedReportType = this.reportForm.get('reportType')?.value;
    this.resetFormFilters();
  }

  resetFormFilters() {
    this.reportForm.patchValue({
      movie: null,
      theater: null,
      city: null,
      paymentMethod: null,
      bookingStatus: null
    });
  }

  generateReport() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      // Based on selected report type, generate mock data
      switch(this.selectedReportType) {
        case 1: // Sales Report
          this.reportData = this.generateSalesData();
          break;
        case 2: // Booking Summary
          this.reportData = this.generateBookingSummary();
          break;
        case 3: // Movie Performance
          this.reportData = this.generateMoviePerformance();
          break;
        case 4: // Theater Performance
          this.reportData = this.generateTheaterPerformance();
          break;
        case 5: // User Activity
          this.reportData = this.generateUserActivity();
          break;
        case 6: // Cancellation Report
          this.reportData = this.generateCancellationReport();
          break;
        case 7: // Payment Summary
          this.reportData = this.generatePaymentSummary();
          break;
      }
      
      this.isLoading = false;
      this.snackBar.open('Report generated successfully!', 'Close', { duration: 3000 });
    }, 1500);
  }

  exportReport(format: string) {
    // In a real application, this would call a service to export data
    switch(format) {
      case 'csv':
        this.downloadCSV();
        break;
      case 'excel':
        this.downloadExcel();
        break;
      case 'pdf':
        this.downloadPDF();
        break;
    }
  }

  private downloadCSV() {
    // Implement CSV download logic
    this.snackBar.open('CSV export started', 'Close', { duration: 2000 });
  }

  private downloadExcel() {
    // Implement Excel download logic
    this.snackBar.open('Excel export started', 'Close', { duration: 2000 });
  }

  private downloadPDF() {
    // Implement PDF download logic
    this.snackBar.open('PDF export started', 'Close', { duration: 2000 });
  }

  // Mock data generation methods
  private generateSalesData(): any[] {
    return [
      { date: '2023-05-01', totalSales: 12500, ticketsSold: 250, avgTicketPrice: 50 },
      { date: '2023-05-02', totalSales: 9800, ticketsSold: 200, avgTicketPrice: 49 },
      { date: '2023-05-03', totalSales: 15200, ticketsSold: 300, avgTicketPrice: 50.67 }
    ];
  }

  private generateBookingSummary(): any[] {
    return [
      { movie: 'Avengers: Endgame', theater: 'Cineplex Downtown', showTime: '14:00', bookings: 120 },
      { movie: 'The Batman', theater: 'IMAX City Center', showTime: '18:00', bookings: 85 },
      { movie: 'Dune', theater: 'Starlight Multiplex', showTime: '20:30', bookings: 65 }
    ];
  }

  // Add other mock data generation methods...
  private generateMoviePerformance(): any[] {
    return [
      { movie: 'Avengers: Endgame', totalRevenue: 45000, shows: 15, occupancyRate: '78%' },
      { movie: 'The Batman', totalRevenue: 32000, shows: 12, occupancyRate: '65%' },
      { movie: 'Dune', totalRevenue: 28000, shows: 10, occupancyRate: '72%' }
    ];
  }

  private generateTheaterPerformance(): any[] {
    return [
      { theater: 'Cineplex Downtown', totalRevenue: 52000, screens: 5, occupancyRate: '70%' },
      { theater: 'IMAX City Center', totalRevenue: 48000, screens: 3, occupancyRate: '82%' },
      { theater: 'Starlight Multiplex', totalRevenue: 38000, screens: 4, occupancyRate: '68%' }
    ];
  }

  private generateUserActivity(): any[] {
    return [
      { userId: 'user001', bookings: 5, lastActivity: '2023-05-03', totalSpent: 250 },
      { userId: 'user002', bookings: 3, lastActivity: '2023-05-02', totalSpent: 150 },
      { userId: 'user003', bookings: 7, lastActivity: '2023-05-01', totalSpent: 350 }
    ];
  }

  private generateCancellationReport(): any[] {
    return [
      { movie: 'Avengers: Endgame', totalBookings: 120, cancellations: 15, cancellationRate: '12.5%' },
      { movie: 'The Batman', totalBookings: 85, cancellations: 10, cancellationRate: '11.8%' },
      { movie: 'Dune', totalBookings: 65, cancellations: 5, cancellationRate: '7.7%' }
    ];
  }

  private generatePaymentSummary(): any[] {
    return [
      { paymentMethod: 'Credit Card', transactions: 180, totalAmount: 9000, successRate: '98%' },
      { paymentMethod: 'PayPal', transactions: 75, totalAmount: 3750, successRate: '95%' },
      { paymentMethod: 'Gift Card', transactions: 45, totalAmount: 2250, successRate: '100%' }
    ];
  }
}