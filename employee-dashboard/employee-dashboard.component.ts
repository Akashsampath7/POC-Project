import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {EmailValidator, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { EmployeeModel } from './employee-dashboard.model';
import { ApiService, Roles } from '../shared/api.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmployeeDetails1Component } from '../employee-details1/employee-details1.component';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd = true;
  showUpdate = true;
  currentUserRole: string;
  isStudent: boolean = false; 
  isStudentUser: boolean = false;
  userRole: string='';
  isDisabled: boolean;
  isDisabledEdit: boolean;
  mobile: string;
  selectedImage: any;
  croppedImage: any;
  selectedEmployee: EmployeeModel = new EmployeeModel();
  selectedDate: any; 
  changedImage: any;

  myForm = this.formbuilder.group({
    gender: ['', Validators.required]
  });
 
  get gender() {
    return this.myForm.get('gender');
  }
 
  constructor(private formbuilder: FormBuilder, private api: ApiService, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.isStudentUser = this.api.isStudent();

    this.formValue = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
   }

   clickAddEmployee(){
    if (!this.isStudent) {
    this.showAdd = true;
    this.showUpdate = false;
    this.formValue.reset();
  } else {
    alert('Access denied. You do not have permission to add an employee.');
  }
  }

  postEmployeeDetails() {
    if (!this.isStudent) {
      this.employeeModelObj.firstName = this.formValue.value.firstName;
      this.employeeModelObj.lastName = this.formValue.value.lastName;
      this.employeeModelObj.email = this.formValue.value.email;
      this.employeeModelObj.mobile = this.formValue.value.mobile;
      this.employeeModelObj.profile = this.croppedImage;
      this.employeeModelObj.gender = this.formValue.value.gender;
      this.employeeModelObj.fatherName = this.formValue.value.fatherName;
      this.employeeModelObj.motherName = this.formValue.value.motherName;
      this.employeeModelObj.address = this.formValue.value.address;
      this.employeeModelObj.classlist = this.formValue.value.classlist;
      this.employeeModelObj.dob = this.formValue.value.dob;
  
      if (this.selectedEmployee.id) {
        // Update employee details
        this.api.updateEmployee(this.selectedEmployee.id, this.employeeModelObj)
          .subscribe((res: any) => {
            console.log(res);
            alert('Employee details updated successfully');
            let ref = document.getElementById('cancel');
            ref?.click();
            this.getAllEmployees();
          });
      } else {
        // Add new employee
        this.api.postEmployee(this.employeeModelObj)
          .subscribe((res: any) => {
            console.log(res);
            alert("Employee Added Successfully")
            let ref = document.getElementById('cancel')
            ref?.click();
            this.formValue.reset();
            this.getAllEmployees();
          },
          (err: any) => {
            alert('Something went wrong');
          }
        );
      }
    } else {
      alert('Access denied. You do not have permission to add/update an employee.');
    }
  }
  
  getAllEmployee(){
    this.api.getEmployee()
    .subscribe(res=>{
      this.employeeData=res;
    })
  }

  deleteEmployee(row: any) {
    if (!this.isStudent) {
      const employeeId = row.id;
      this.api.deleteEmployee(employeeId).subscribe((res: any) => {
        alert('Employee Deleted');
        this.getAllEmployee();
      });
    } else {
      alert('Access denied. You do not have permission to delete an employee.');
    }
  }

  onEdit(row: any) {
    if (!this.isStudent) {
      this.showAdd = false;
      this.showUpdate = true;
      this.selectedEmployee.id = row.id;
      this.formValue.controls['firstName'].setValue(row.firstName);
      this.formValue.controls['lastName'].setValue(row.lastName);
      this.formValue.controls['email'].setValue(row.email);
      this.formValue.controls['mobile'].setValue(row.mobile);
      this.formValue.controls['gender'].setValue(row.gender);
      this.formValue.controls['fatherName'].setValue(row.fatherName);
      this.formValue.controls['motherName'].setValue(row.motherName);
      this.formValue.controls['address'].setValue(row.address);
      this.formValue.controls['classlist'].setValue(row.classlist);
      this.formValue.controls['dob'].setValue(row.dob);
      this.croppedImage = row.profile;
      this.selectedEmployee = { ...row };
    } else {
      alert('Access denied. You do not have permission to edit an employee.');
    }
  }
  
  updateEmployeeDetails() {
    if (!this.isStudent) {
      this.employeeModelObj.id = this.selectedEmployee.id;
      this.employeeModelObj.firstName = this.formValue.value.firstName;
      this.employeeModelObj.lastName = this.formValue.value.lastName;
      this.employeeModelObj.email = this.formValue.value.email;
      this.employeeModelObj.mobile = this.formValue.value.mobile;
      this.employeeModelObj.profile = this.croppedImage;
      this.employeeModelObj.gender = this.formValue.value.gender;
      this.employeeModelObj.fatherName = this.formValue.value.fatherName;
      this.employeeModelObj.motherName = this.formValue.value.motherName;
      this.employeeModelObj.address = this.formValue.value.address;
      this.employeeModelObj.classlist = this.formValue.value.classlist;
      this.employeeModelObj.dob = this.formValue.value.dob;
  
      // Check if a new image is selected
      if (this.croppedImage) {
        this.employeeModelObj.profile = this.croppedImage;
      } else {
        // Use the existing profile image
        const employee = this.employeeData.find((emp: any) => emp.id === this.employeeModelObj.id);
        this.employeeModelObj.profile = employee.profile;
      }
  
      this.api.updateEmployee(this.employeeModelObj.id, this.employeeModelObj)
        .subscribe((res: any) => {
          alert('Updated Successfully');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.getAllEmployee();
        });
      this.showAdd = true;
      this.showUpdate = false;
    } else {
      alert('Access denied. You do not have permission to edit an employee.');
    }
  }

  get isPhoneNumberValid(): boolean {
    return this.mobile && this.mobile.length === 10;
  }
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      //this.selectedImage = e.target.result;
      this.changedImage = e.target.result;
      localStorage.setItem('selectedImage', this.selectedImage);
    };
    reader.readAsDataURL(file);
  }

  uploadImage(file: File) {
    const formData: FormData = new FormData();
    formData.append('image', file);

    this.http.post<any>('/api/upload', formData)
      .subscribe(
        response => {
          console.log('Image uploaded successfully:', response);
           this.employeeModelObj.profile = response.imageURL;
        },
        error => {
          console.error('Error uploading image:', error);
        }
      );
  }

  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }

  private dataURLtoFile(dataURL: string, fileName: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  ngOnInit(): void {
    this.selectedImage = localStorage.getItem('selectedImage');
    this.formValue = this.formbuilder.group({
      firstName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      mobile: [''],
      gender:[''],
      profile:[''],
      fatherName:[''],
      motherName:[''],
      address:[''],
      classlist:[''],
      dob:['']
    });
    this.userRole=sessionStorage.getItem('userRole');
    this.isDisabled = this.userRole != 'admin'? true: false;
    this.isDisabledEdit = this.userRole != 'admin'? (this.userRole != 'teacher'? true: false): false;
    this.currentUserRole = this.api.getUserRole();
    this.isStudent = this.currentUserRole === Roles.STUDENT;
    this.getAllEmployee();
    this.userRole=this.authService.getAdminName();
  }

  // deleteEmployees(row: any) {
  //   if (!this.isStudent) {
  //     // Perform the employee deletion logic
  //   } else {
  //     alert('Access denied. You do not have permission to delete an employee.');
  //   }
  // }

  // onEdits(row: any)  {
  //   if (!this.isStudent) {
  //     // Perform the employee editing logic
  //   } else {
  //     alert('Access denied. You do not have permission to edit an employee.');
  //   }
  // }

  // // Check if the current user can add an employee
  // canAddEmployee(): boolean {
  //   return this.currentUserRole === Roles.ADMIN || this.currentUserRole === Roles.TEACHER;
  // }

  // // Check if the current user can delete an employee
  // canDeleteEmployee(): boolean {
  //   return this.currentUserRole === Roles.ADMIN;
  // }

  // canEditEmployee(): boolean {
  //   return this.currentUserRole === Roles.ADMIN || this.currentUserRole === Roles.TEACHER;
  // }

  getAllEmployees() {
    this.api.getEmployee().subscribe(res => {
      this.employeeData = res;
    });
  }
  viewEmployee(employee: any) {
    this.router.navigate(['/employee1'], { queryParams: { id: employee.id } });
  }
  }
  


