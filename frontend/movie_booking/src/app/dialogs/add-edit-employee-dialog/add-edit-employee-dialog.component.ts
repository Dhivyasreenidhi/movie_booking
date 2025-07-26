import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

interface Employee {
  id?: number;
  name: string;
  email: string;
  role: string;
  department: string;
  hireDate: string | Date;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-add-edit-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './add-edit-employee-dialog.component.html'
})
export class AddEditEmployeeDialogComponent {
  employeeForm: FormGroup;
  minHireDate: string = new Date('1900-01-01').toISOString().split('T')[0];

  constructor(
    public dialogRef: MatDialogRef<AddEditEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee | null },
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      name: [data?.employee?.name || '', Validators.required],
      email: [data?.employee?.email || '', [Validators.required, Validators.email]],
      role: [data?.employee?.role || '', Validators.required],
      department: [data?.employee?.department || '', Validators.required],
      hireDate: [data?.employee?.hireDate ? new Date(data.employee.hireDate).toISOString().split('T')[0] : '', Validators.required],
      status: [data?.employee?.status || 'active', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.dialogRef.close(this.employeeForm.value);
    } else {
      console.log('Form is invalid', this.employeeForm.errors);
    }
  }
}