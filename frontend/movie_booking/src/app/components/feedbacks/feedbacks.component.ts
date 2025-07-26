import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-feedbacks',
  imports: [CommonModule,FormsModule,HeaderComponent,ReactiveFormsModule,FooterComponent],
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.css'
})
export class FeedbacksComponent {
feedbackForm: FormGroup;
  submittedFeedback: any = null;

  constructor(private fb: FormBuilder) {
    this.feedbackForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      seatNo: [''],
      email: ['', Validators.email],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.submittedFeedback = this.feedbackForm.value;
      console.log('Feedback submitted:', this.submittedFeedback);
      // this.feedbackForm.reset(); // Uncomment if you want to clear form after submission
    } else {
      // Mark all fields as touched to show validation messages
      this.feedbackForm.markAllAsTouched();
    }
  }
}
