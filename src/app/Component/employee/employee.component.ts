import { Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

import { ScrollTopModule } from 'primeng/scrolltop';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { User } from '../emp';
import { EmpserviceService } from '../empservice.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async"
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    ButtonModule,DialogModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    InputTextareaModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    ScrollTopModule,
    FloatLabelModule,CheckboxModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    RippleModule,
    ConfirmDialogModule,
    CommonModule,
    CalendarModule
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  userForm: FormGroup;
  userList: User[] = [];
  visible: boolean = false;
  editMode: boolean = false;
  selectedUserId: number | null = null;
  // date: Date | undefined;
  constructor(
    private userService: EmpserviceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
  
      department: ['', Validators.required],
      name: ['', [Validators.required,Validators.pattern(/^[a-zA-Z]+ [a-zA-Z]+$/)]],
      mobile: [null, [Validators.required,Validators.minLength(10),Validators.maxLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      doj: [new Date(),Validators.required],
      gender: [''],
      city: ['',Validators.required],
      address: ['',Validators.required],
      salary: [null]
    });
  }
  
  get department(){
    return this.userForm.controls['department']
  }
  get name()
  {
    return this.userForm.controls['name']
  }
  get mobile()
  {
    return this.userForm.controls['mobile']
  }

  get email()
  {
    return this.userForm.controls['email']
  }
  get gender()
  {
    return this.userForm.controls['gender']
  }
  get city()
  {
    return this.userForm.controls['city']
  }
  get doj()
  {
    return this.userForm.controls['doj']
  }
  get address()
  {
    return this.userForm.controls['address']
  }
  get salary()
  {
    return this.userForm.controls['salary']
  }


  ngOnInit(): void {
    this.getUserList();
  }
  
  showDialog(user?: User) {
    this.editMode = !!user;
    if (user) {
      this.userForm.patchValue(user);
      this.selectedUserId = user.id;
    } else {
      this.userForm.reset();
      this.selectedUserId = null;
    }
    this.visible = true;
  }
  
  hideDialog() {
    this.visible = false;
  }
  
  resetForm() {
    this.userForm.reset();
  }
  
  onSubmit() {
    if (this.editMode) {
      this.updateUser();
    } else  {
      this.addUser();
    }
  }
  
  addUser() {
    
    this.userService.addUser(this.userForm.value).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User Added Successfully' });
        this.hideDialog();
        this.getUserList();
      },
      () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Add User' });
      }
    );
  }
  
  updateUser() {
    if (this.selectedUserId !== null) {
      const updatedUser = { ...this.userForm.value, id: this.selectedUserId }; //here I am destructring object
      this.userService.updateUser(updatedUser).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: ' Updated Successfully' });
          this.hideDialog();
          this.getUserList();
        },
        () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Update ' });
        }
      );
  
    }
  }
  getUserList() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.userList = users;
      },
      () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Load Users' });
      }
    );
  }
  
  confirmDelete(userId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Delete',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.deleteUser(userId);
      }
    });
  }
  
  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: ' Deleted Successfully' });
        this.getUserList(); 
      },
      () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
      }
    );
  }
}
