// manage-offers.component.ts
import { Component, OnInit } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditOfferDialogComponent } from '../dialogs/add-edit-offer-dialog/add-edit-offer-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input'; // Optional for forms
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Optional for forms
import { debounceTime, Subject } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

interface Offer {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number | null;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  applicableOn: 'all' | 'specific' | 'category';
  categories?: string[];
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
}

@Component({
  selector: 'app-manage-offers',
  templateUrl: './manage-offers.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    SidebarComponent,
    NavBarComponent
  ],
  
  styleUrls: ['./manage-offers.component.css']
})
export class ManageOffersComponent implements OnInit  {
  // Pagination controls
  currentPage: number = 1;
  pageSize: number = 5;
  get totalPages(): number {
    return Math.ceil(this.filteredOffers.length / this.pageSize) || 1;
  }

  get paginatedOffers(): Offer[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOffers.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
 offers: Offer[] = [];
  constructor(private offerService: OfferService) {}

  selectedOffer: Offer | null = null;
  showDeleteConfirmation: boolean = false;
  offerToDelete: Offer | null = null;
  notifications: { message: string; type: 'success' | 'error' }[] = [];
  filterStatus: string = 'all';
  searchTerm: string = '';
  private searchSubject: Subject<string> = new Subject();

  // For form controls
  newOffer: Partial<Offer> = {
    discountType: 'percentage',
    applicableOn: 'all',
    isActive: true
  };

  showAddOfferForm: boolean = false;
  showEditOfferForm: boolean = false;

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.searchTerm = term;
    });
    // Use OfferService to fetch offers via Angular HttpClient
    this.offerService.getOffers().subscribe({
      next: (data: any[]) => {
        this.offers = data.map((offer: any) => ({
          ...offer,
          validFrom: new Date(offer.validFrom),
          validTo: new Date(offer.validTo),
          isActive: !!offer.isActive,
          categories: Array.isArray(offer.categories) ? offer.categories : (typeof offer.categories === 'string' ? JSON.parse(offer.categories) : [])
        }));
      },
      error: (err: any) => {
        this.showNotification(err.message || 'Failed to fetch offers', 'error');
      }
    });
  }

  

  get filteredOffers(): Offer[] {
    return this.offers.filter(offer => {
      const statusMatch = this.filterStatus === 'all' || 
                         (this.filterStatus === 'active' && offer.isActive) || 
                         (this.filterStatus === 'inactive' && !offer.isActive);
      const searchMatch = offer.code.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                         offer.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
    // Pagination handled in paginatedOffers
  }

  isCurrent(offer: Offer): boolean {
    const today = new Date();
    return new Date(offer.validFrom) <= today && today <= new Date(offer.validTo);
  }

  selectOffer(offer: Offer): void {
    this.selectedOffer = { ...offer };
    this.showEditOfferForm = true;
    this.showAddOfferForm = false;
    this.isEditConfirmed = false;
  }
  isEditConfirmed: boolean = false;
  viewOffer: Offer | null = null;

  confirmDelete(offer: Offer): void {
    this.offerToDelete = offer;
    this.showDeleteConfirmation = true;
  }

  deleteOffer(): void {
    if (this.offerToDelete) {
      this.offerService.deleteOffer(this.offerToDelete.id).subscribe({
        next: () => {
          this.offers = this.offers.filter(o => o.id !== this.offerToDelete!.id);
          this.showNotification('Offer deleted successfully', 'success');
          this.showDeleteConfirmation = false;
          this.offerToDelete = null;
          this.selectedOffer = null;
          this.showEditOfferForm = false;
        },
        error: (err) => {
          this.showNotification(err?.error?.message || 'Failed to delete offer', 'error');
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.offerToDelete = null;
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notifications.push({ message, type });
    setTimeout(() => {
      this.notifications.shift();
    }, 3000);
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
    this.currentPage = 1; // Reset to first page on search
  }

  getStatusClass(isActive: boolean, validFrom: Date, validTo: Date): string {
    const today = new Date();
    if (!isActive) return 'bg-gray-100 text-gray-800';
    if (today < new Date(validFrom)) return 'bg-blue-100 text-blue-800';
    if (today > new Date(validTo)) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  }

  getStatusText(isActive: boolean, validFrom: Date, validTo: Date): string {
    const today = new Date();
    if (!isActive) return 'Inactive';
    if (today < new Date(validFrom)) return 'Scheduled';
    if (today > new Date(validTo)) return 'Expired';
    return 'Active';
  }

  toggleAddOfferForm(): void {
    this.showAddOfferForm = !this.showAddOfferForm;
    this.showEditOfferForm = false;
    this.selectedOffer = null;
    this.newOffer = {
      discountType: 'percentage',
      applicableOn: 'all',
      isActive: true
    };
    this.currentPage = 1; // Reset to first page when toggling form
  }

  addOffer(): void {
    // Validate categories and applicableOn before submitting
    let categoriesArr: string[] = [];
    if (typeof this.newOffer.categories === 'string') {
      const catStr = this.newOffer.categories as string;
      if (catStr.trim() !== '') {
        try {
          categoriesArr = JSON.parse(catStr);
          if (!Array.isArray(categoriesArr)) throw new Error();
        } catch {
          this.showNotification('Categories must be a valid JSON array (e.g. ["family","group"])', 'error');
          return;
        }
      } else {
        categoriesArr = [];
      }
    } else if (Array.isArray(this.newOffer.categories)) {
      categoriesArr = this.newOffer.categories as string[];
    } else {
      categoriesArr = [];
    }

    const allowedApplicableOn = ['all', 'specific', 'category'];
    if (!allowedApplicableOn.includes(this.newOffer.applicableOn || '')) {
      this.showNotification('Applicable On must be one of: all, specific, category', 'error');
      return;
    }

    // Validate other fields
    if (this.validateOffer(this.newOffer)) {
      // Prepare offer data for backend
      const offerData = {
        code: this.newOffer.code || '',
        description: this.newOffer.description || '',
        discountType: this.newOffer.discountType || 'percentage',
        discountValue: this.newOffer.discountValue || 0,
        minPurchase: this.newOffer.minPurchase || null,
        validFrom: this.newOffer.validFrom || new Date(),
        validTo: this.newOffer.validTo || new Date(),
        isActive: this.newOffer.isActive ? 1 : 0,
        applicableOn: this.newOffer.applicableOn || 'all',
        categories: categoriesArr,
        maxDiscount: this.newOffer.maxDiscount || null,
        usageLimit: this.newOffer.usageLimit || null,
        usedCount: 0
      };
      this.offerService.postOffer(offerData).subscribe({
        next: (data) => {
          this.showNotification('Offer added successfully', 'success');
          this.showAddOfferForm = false;
          this.newOffer = {};
          // Refresh offers list
          this.ngOnInit();
        },
        error: (err) => {
          this.showNotification(err?.error?.message || 'Failed to add offer', 'error');
        }
      });
    }
  }

  updateOffer(): void {
    if (this.selectedOffer && this.validateOffer(this.selectedOffer)) {
      // Show confirm popup before saving
      if (!this.isEditConfirmed) {
        if (confirm('Are you sure you want to save changes to this offer?')) {
          this.isEditConfirmed = true;
        } else {
          return;
        }
      }
      const index = this.offers.findIndex(o => o.id === this.selectedOffer!.id);
      if (index !== -1) {
        this.offers[index] = { ...this.selectedOffer };
        this.showNotification('Offer updated successfully', 'success');
        this.showEditOfferForm = false;
        this.selectedOffer = null;
        this.isEditConfirmed = false;
      }
    }
  }

  private validateOffer(offer: Partial<Offer>): boolean {
    if (!offer.code || !offer.description) {
      this.showNotification('Code and description are required', 'error');
      return false;
    }
    if (offer.discountValue === undefined || offer.discountValue <= 0) {
      this.showNotification('Discount value must be positive', 'error');
      return false;
    }
    if (offer.discountType === 'percentage' && offer.discountValue > 100) {
      this.showNotification('Percentage discount cannot exceed 100%', 'error');
      return false;
    }
    if (offer.validFrom && offer.validTo && offer.validFrom > offer.validTo) {
      this.showNotification('Valid From date must be before Valid To date', 'error');
      return false;
    }
    // Additional validation for addOffer only (categories/applicableOn handled in addOffer)
    return true;
  }

  cancelForm(): void {
    this.showAddOfferForm = false;
    this.showEditOfferForm = false;
    this.selectedOffer = null;
    this.newOffer = {};
    this.isEditConfirmed = false;
    this.viewOffer = null;
  }

  formatDiscount(offer: Offer): string {
    return offer.discountType === 'percentage' 
      ? `${offer.discountValue}%${offer.maxDiscount ? ` (max ₹${offer.maxDiscount})` : ''}` 
      : `₹${offer.discountValue} off`;
  }

  showViewOffer(offer: Offer): void {
    this.viewOffer = { ...offer };
    this.showEditOfferForm = false;
    this.showAddOfferForm = false;
  }

  
}