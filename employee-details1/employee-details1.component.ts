import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-employee-details1',
  templateUrl: './employee-details1.component.html',
  styleUrls: ['./employee-details1.component.css']
})
export class EmployeeDetails1Component implements OnInit {
  employees: any[];
  selectedEmployee: any;

  constructor(private apiService: ApiService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if (employeeId) {
        this.getEmployee(employeeId);
      }
    });
  }

  generatePDF() {
    const doc = new jsPDF();
    const studentDetails = `
    Full Name: ${this.selectedEmployee.firstName} ${this.selectedEmployee.lastName}
    Email ID: ${this.selectedEmployee.email}
    Mobile No: ${this.selectedEmployee.mobile}
    Gender: ${this.selectedEmployee.gender}
    Father Name: ${this.selectedEmployee.fatherName}
    Mother Name: ${this.selectedEmployee.motherName}
    Address: ${this.selectedEmployee.address}
    Class: ${this.selectedEmployee.classlist}
  `;
  
    doc.text(studentDetails, 10, 10);
  
    // Generate a Blob from the PDF content
    const blob = doc.output('blob');
  
    // Save the Blob as a file using FileSaver.js
    saveAs(blob, 'student_details.pdf');
  }
  
  getEmployee(employeeId: string) {
    this.apiService.getEmployeeById(employeeId).subscribe(
      (res: any) => {
        this.selectedEmployee = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }}
