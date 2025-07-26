import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-admin-dashboard',
  imports:[RouterModule,SidebarComponent,CommonModule,RouterModule,NavBarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements AfterViewInit {
  activeComponent: string = 'dashboard';
  isSidebarCollapsed = false;
  sidebarWidth = 250;
  
  // Analytics data
  analyticsData = {
    bookings: {
      current: 1642,
      change: 12.5,
      trend: 'up',
      chartData: [1200, 1350, 1420, 1500, 1580, 1620, 1642]
    },
    revenue: {
      current: 324500,
      change: 8.3,
      trend: 'up',
      chartData: [220000, 240000, 265000, 280000, 300000, 315000, 324500]
    },
    timePeriod: 'week' // 'week', 'month', or 'year'
  };

  @ViewChild('bookingsChart') bookingsChartRef!: ElementRef;
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;

  setActiveComponent(component: string): void {
    this.activeComponent = component;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.sidebarWidth = this.isSidebarCollapsed ? 70 : 250;
  }

  getActiveComponentTitle(): string {
    const titles: {[key: string]: string} = {
      'dashboard': 'Dashboard Overview',
      'movies': 'Manage Movies',
      'showtimes': 'Manage Showtimes',
      'bookings': 'Manage Bookings',
      'employees': 'Manage Employees',
      'offers': 'Manage Offers',
      'content': 'Content Management',
      'reports': 'Reports & Analytics'
    };
    return titles[this.activeComponent] || '';
  }

  logout(): void {
    console.log('Admin logout initiated');
    // Add your actual logout logic here
  }

  ngAfterViewInit() {
    if (this.activeComponent === 'dashboard') {
      this.initCharts();
      this.createMoviePerformanceChart();
    }
  }

  initCharts() {
    this.createBookingsChart();
    this.createRevenueChart();
  }

  private createBookingsChart() {
    new Chart(this.bookingsChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.getTimeLabels(),
        datasets: [{
          label: 'Bookings',
          data: this.analyticsData.bookings.chartData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#EF4444',
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: this.getChartOptions()
    });
  }

  private createRevenueChart() {
    new Chart(this.revenueChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: this.getTimeLabels(),
        datasets: [{
          label: 'Revenue',
          data: this.analyticsData.revenue.chartData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#10B981',
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        ...this.getChartOptions(),
        scales: {
          ...this.getChartOptions().scales,
          y: {
            ...this.getChartOptions().scales?.y,
            ticks: {
              color: '#9CA3AF',
              callback: (value: any) => '₹' + (value / 1000) + 'k'
            }
          }
        }
      }
    });
  }

  private getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(75, 85, 99, 0.5)'
          },
          ticks: {
            color: '#9CA3AF'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9CA3AF'
          }
        }
      }
    };
  }

  private getTimeLabels(): string[] {
    switch (this.analyticsData.timePeriod) {
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'month':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    }
  }

  changeTimePeriod(period: 'week' | 'month' | 'year') {
    this.analyticsData.timePeriod = period;
    // In a real app, you would fetch new data here based on the time period
    // For now, we'll just update the charts with the same data but different labels
    if (this.bookingsChartRef && this.revenueChartRef) {
      this.initCharts();
    }
  }

  formatCurrency(value: number): string {
    return '₹' + value.toLocaleString('en-IN');
  }
  topMoviesData = [
    {
      name: 'Avengers: Endgame',
      revenue: 1850000,
      bookings: 12450,
      color: '#6366F1' // indigo-500
    },
    {
      name: 'Spider-Man: No Way Home',
      revenue: 1520000,
      bookings: 10230,
      color: '#EC4899' // pink-500
    },
    {
      name: 'The Batman',
      revenue: 1280000,
      bookings: 8760,
      color: '#F59E0B' // amber-500
    },
    {
      name: 'Doctor Strange 2',
      revenue: 1120000,
      bookings: 7540,
      color: '#10B981' // emerald-500
    },
    {
      name: 'Top Gun: Maverick',
      revenue: 980000,
      bookings: 6850,
      color: '#EF4444' // red-500
    }
  ];

  @ViewChild('moviePerformanceChart') moviePerformanceChartRef!: ElementRef;
  // (Merged ngAfterViewInit is above; remove this duplicate)

  private createMoviePerformanceChart() {
    new Chart(this.moviePerformanceChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.topMoviesData.map(movie => movie.name),
        datasets: [
          {
            label: 'Revenue (₹)',
            data: this.topMoviesData.map(movie => movie.revenue),
            backgroundColor: this.topMoviesData.map(movie => movie.color),
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            borderRadius: 4,
            yAxisID: 'y'
          },
          {
            label: 'Bookings',
            data: this.topMoviesData.map(movie => movie.bookings),
            backgroundColor: 'rgba(156, 163, 175, 0.5)',
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            yAxisID: 'y1',
            type: 'line',
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#FFFFFF'
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.datasetIndex === 0) {
                  label += '₹' + (context.raw as number).toLocaleString('en-IN');
                } else {
                  label += (context.raw as number).toLocaleString('en-IN');
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9CA3AF'
            }
          },
          y: {
            grid: {
              color: 'rgba(75, 85, 99, 0.5)'
            },
            ticks: {
              color: '#9CA3AF',
              callback: function(value) {
                const movie = this.getLabelForValue(Number(value));
                return movie.length > 15 ? movie.substring(0, 15) + '...' : movie;
              }
            }
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            ticks: {
              color: '#9CA3AF'
            }
          }
        }
      }
    });
  }
}