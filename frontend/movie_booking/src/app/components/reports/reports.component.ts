import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { saveAs } from 'file-saver';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BaseChartDirective,SidebarComponent,NavBarComponent]
})
export class ReportsComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  reportForm: FormGroup;
  reportTypes = [
    { id: 1, name: 'Sales Report' },
    { id: 2, name: 'Booking Summary' },
    { id: 3, name: 'Revenue by Movie' }
  ];
  
  movies = [
    { id: 1, name: 'Avengers: Endgame' },
    { id: 2, name: 'The Batman' },
    { id: 3, name: 'Oppenheimer' },
    { id: 4, name: 'Barbie' },
    { id: 5, name: 'Dune: Part Two' }
  ];
  
  reportData: any[] = [];
  filteredData: any[] = [];
  isLoading = false;
  selectedReportType: number = 1;
  searchQuery: string = '';

  // Chart configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    },
    plugins: { 
      legend: { 
        display: true, 
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        bodyFont: {
          size: 14
        },
        titleFont: {
          size: 16,
          weight: 'bold'
        }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = { 
    labels: [], 
    datasets: [] 
  };

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      reportType: [1, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      movie: [null]
    });
  }

  // Calculation methods for template
  getTotalSales(): number {
    return this.filteredData.reduce((sum, item) => sum + (item.totalSales || 0), 0);
  }

  getTotalBookings(): number {
    return this.filteredData.reduce((sum, item) => sum + (item.bookings || 0), 0);
  }

  getTotalRevenue(): number {
    return this.filteredData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
  }

  onReportTypeChange() {
    this.selectedReportType = this.reportForm.get('reportType')?.value;
    this.reportData = [];
    this.filteredData = [];
    this.searchQuery = '';
    this.updateChartData();
  }

  applyFilter() {
  const filterValue = this.searchQuery.trim().toLowerCase();
  this.filteredData = this.reportData.filter(item => {
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(filterValue)
    );
  });
  this.updateChartData();
}

  generateReport() {
    if (this.reportForm.invalid) {
      this.showError('Please fill all required fields');
      return;
    }

    const { startDate, endDate } = this.reportForm.value;
    if (startDate > endDate) {
      this.showError('End date must be after start date');
      return;
    }

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.generateMockData();
      this.filteredData = [...this.reportData];
      this.isLoading = false;
      this.showMessage('Report generated successfully!');
      this.updateChartData();
    }, 1000);
  }

  private generateMockData() {
    const movieNames = this.movies.map(m => m.name);
    
    if (this.selectedReportType === 1) {
      // Sales Report
      this.reportData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(2025, 6, i + 1).toISOString().split('T')[0],
        totalSales: Math.floor(Math.random() * 20000) + 5000,
        ticketsSold: Math.floor(Math.random() * 400) + 100,
        averageTicketPrice: Math.random() * 10 + 45
      }));
    } else if (this.selectedReportType === 2) {
      // Booking Summary
      this.reportData = movieNames.map(movie => ({
        movie,
        theater: ['Cineplex Downtown', 'IMAX City Center', 'Star Cinema', 'Metroplex', 'Galaxy Theater'][
          Math.floor(Math.random() * 5)
        ],
        bookings: Math.floor(Math.random() * 150) + 50,
        revenue: Math.floor(Math.random() * 7500) + 2500
      }));
    } else {
      // Revenue by Movie
      this.reportData = movieNames.map(movie => {
        const bookings = Math.floor(Math.random() * 500) + 100;
        const avgPrice = Math.random() * 10 + 45;
        return {
          movie,
          totalRevenue: bookings * avgPrice,
          totalBookings: bookings,
          averageRevenuePerBooking: avgPrice
        };
      });
    }
  }

  updateChartData() {
    const data = this.filteredData.length > 0 ? this.filteredData : this.reportData;
    
    if (!data.length) {
      this.barChartData = { labels: [], datasets: [] };
      this.chart?.update();
      return;
    }

    if (this.selectedReportType === 1) {
      this.barChartData = {
        labels: data.map(item => item.date),
        datasets: [
          { 
            data: data.map(item => item.totalSales), 
            label: 'Total Sales ($)', 
            backgroundColor: '#4e73df',
            hoverBackgroundColor: '#2e59d9'
          },
          { 
            data: data.map(item => item.ticketsSold), 
            label: 'Tickets Sold', 
            backgroundColor: '#1cc88a',
            hoverBackgroundColor: '#17a673'
          }
        ]
      };
    } else if (this.selectedReportType === 2) {
      this.barChartData = {
        labels: data.map(item => item.movie),
        datasets: [
          { 
            data: data.map(item => item.bookings), 
            label: 'Bookings', 
            backgroundColor: '#36b9cc',
            hoverBackgroundColor: '#2c9faf'
          },
          { 
            data: data.map(item => item.revenue), 
            label: 'Revenue ($)', 
            backgroundColor: '#f6c23e',
            hoverBackgroundColor: '#dda20a'
          }
        ]
      };
    } else {
      this.barChartData = {
        labels: data.map(item => item.movie),
        datasets: [
          { 
            data: data.map(item => item.totalRevenue), 
            label: 'Total Revenue ($)', 
            backgroundColor: '#e74a3b',
            hoverBackgroundColor: '#be2617'
          },
          { 
            data: data.map(item => item.totalBookings), 
            label: 'Total Bookings', 
            backgroundColor: '#858796',
            hoverBackgroundColor: '#6a6b7a'
          }
        ]
      };
    }
    this.chart?.update();
  }

  exportReport(format: string) {
    if (this.filteredData.length === 0) {
      this.showError('No data to export');
      return;
    }

    if (format === 'CSV') {
      const headers = this.getCurrentColumns();
      const csv = [
        headers.join(','),
        ...this.filteredData.map(row =>
          headers.map(header => `"${row[header] || ''}"`).join(',')
        )
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${this.reportTypes[this.selectedReportType - 1].name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`);
      this.showMessage('CSV exported successfully!');
    } else {
      this.showMessage(`Exporting as ${format} is not implemented yet`);
    }
  }

  sortData(column: string, direction: 'asc' | 'desc') {
    if (!column || this.filteredData.length < 2) return;
    
    this.filteredData = [...this.filteredData].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      return direction === 'asc' 
        ? (valueA < valueB ? -1 : 1)
        : (valueB < valueA ? -1 : 1);
    });
    
    this.updateChartData();
  }

  getSortDirection(column: string): 'asc' | 'desc' {
    if (this.filteredData.length < 2) return 'asc';
    return this.filteredData[0][column] > this.filteredData[1][column] ? 'desc' : 'asc';
  }

  public getCurrentColumns(): string[] {
    switch (this.selectedReportType) {
      case 1: return ['date', 'totalSales', 'ticketsSold', 'averageTicketPrice'];
      case 2: return ['movie', 'theater', 'bookings', 'revenue'];
      case 3: return ['movie', 'totalRevenue', 'totalBookings', 'averageRevenuePerBooking'];
      default: return [];
    }
  }

  private showMessage(message: string) {
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '1050';
    toast.innerHTML = `
      <div class="toast-header bg-success text-white">
        <strong class="me-auto">Success</strong>
        <button type="button" class="btn-close btn-close-white" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
      <div class="toast-body">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  private showError(message: string) {
    const toast = document.createElement('div');
    toast.className = 'toast show position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '1050';
    toast.innerHTML = `
      <div class="toast-header bg-danger text-white">
        <strong class="me-auto">Error</strong>
        <button type="button" class="btn-close btn-close-white" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
      <div class="toast-body">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}