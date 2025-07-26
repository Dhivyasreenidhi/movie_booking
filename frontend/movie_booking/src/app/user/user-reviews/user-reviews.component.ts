import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-reviews',
  imports:[CommonModule],
  templateUrl: './user-reviews.component.html',
  styleUrls: ['./user-reviews.component.css']
})
export class UserReviewsComponent {
  @Input() reviews: any[] = [];
  @Input() isLightTheme: boolean = false;
  showAllReviews = false;

  get visibleReviews(): any[] {
    return this.showAllReviews ? this.reviews : this.reviews.slice(0, 2);
  }

  get totalReviews(): number {
    return this.reviews.length;
  }

  toggleShowAllReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }
}