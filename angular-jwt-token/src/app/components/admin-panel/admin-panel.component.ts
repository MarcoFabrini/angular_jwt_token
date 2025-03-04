import { Component, OnInit, viewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { User } from '../../models/user';
import { AdminService } from '../../services/api/admin.service';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  user: User[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.adminService.listAllUsers().then(users => {
      this.user = users;
    }).catch(error => {
      console.error('Failed to load users', error);
    });
  }



} // class
