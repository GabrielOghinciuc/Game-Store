import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../shared/services/auth.service';
import { ChangeDetectionStrategy } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'profilePicture',
    'username',
    'email',
    'fullName',
    'birthDate',
    'joinedOn',
    'lastLogin',
    'roles',
    'actions', // Add this new column
  ];
  dataSource: MatTableDataSource<UserDataBaseInterface>;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.dataSource = new MatTableDataSource<UserDataBaseInterface>();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadUsers(): void {
    this.http
      .get<UserDataBaseInterface[]>('https://localhost:7262/Users/all')
      .subscribe({
        next: (users) => {
          this.dataSource.data = users;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProfileImage(profilePicture: string): string {
    if (!profilePicture || profilePicture === 'string') {
      return 'https://localhost:7262/Images/default/user.jpg';
    }
    return this.authService.getFullImageUrl(profilePicture);
  }

  toggleAdminStatus(userId: string, currentStatus: boolean): void {
    const action = currentStatus ? 'remove' : 'grant';
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} admin privileges for this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .patch(
            `https://localhost:7262/Users/${userId}/set-admin-status`,
            !currentStatus
          )
          .subscribe({
            next: () => {
              this.loadUsers();
              Swal.fire({
                title: 'Updated!',
                text: `Admin privileges ${action}ed successfully`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
            },
            error: (error) => {
              console.error('Error updating admin status:', error);
              Swal.fire({
                title: 'Error!',
                text: 'Failed to update admin status',
                icon: 'error',
              });
            },
          });
      }
    });
  }

  toggleDeveloperStatus(userId: string, currentStatus: boolean): void {
    const action = currentStatus ? 'remove' : 'grant';
    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} developer privileges for this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .patch(
            `https://localhost:7262/Users/${userId}/set-developer-status`,
            !currentStatus
          )
          .subscribe({
            next: () => {
              this.loadUsers();
              Swal.fire({
                title: 'Updated!',
                text: `Developer privileges ${action}ed successfully`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
            },
            error: (error) => {
              console.error('Error updating developer status:', error);
              Swal.fire({
                title: 'Error!',
                text: 'Failed to update developer status',
                icon: 'error',
              });
            },
          });
      }
    });
  }

  deleteUser(userId: string, username: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the account for ${username}? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://localhost:7262/Users/${userId}`).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire({
              title: 'Deleted!',
              text: 'Account has been deleted successfully',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete account',
              icon: 'error',
            });
          },
        });
      }
    });
  }
}
