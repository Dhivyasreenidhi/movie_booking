import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-offer',
  imports: [FormsModule,ReactiveFormsModule,SidebarComponent,NavBarComponent],
  templateUrl: './content-offer.component.html',
  styleUrl: './content-offer.component.css'
})
export class ContentOfferComponent {
  public headerTitle: string = '';
  
  activeTab: string = 'banner';
 offersForm: FormGroup;

  constructor(private fb: FormBuilder,private sanitizer: DomSanitizer,private router: Router) {
    this.offersForm = this.fb.group({
      headerTitle: 'THEATER DELIGHTS',
      subtitle: 'MOST FORMULAI',
      specialOffer: 'Get 20% off on all combos when you book 3+ tickets',
      buttonText: 'ORDER NOW',
      combos: this.fb.array([
        this.createComboGroup('Mega Snack Combo', 'Large popcorn + 2 drinks + nachos', '€399', true),
        this.createComboGroup('Sweet Treat Box', 'Chocolate brownie + ice cream + soda', '€349', false),
        this.createComboGroup('Classic Movie Pack', 'Medium popcorn + soft drink', '€249', false)
      ])
    });
  }

  createComboGroup(name: string, description: string, price: string, isPopular: boolean): FormGroup {
    return this.fb.group({
      name: [name],
      description: [description],
      price: [price],
      isPopular: [isPopular]
    });
  }

  get combos(): FormArray {
    return this.offersForm.get('combos') as FormArray;
  }

  addNewCombo() {
    this.combos.push(this.createComboGroup('New Combo', 'Combo description', '€0', false));
  }

  removeCombo(index: number) {
    this.combos.removeAt(index);
  }

  saveOffers() {
    console.log('Offers saved:', this.offersForm.value);
    // Add your save/update logic here
  }
   selectTab(tab: string) {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/content-management']);
  }
}