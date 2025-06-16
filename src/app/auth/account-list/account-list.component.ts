import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent {
  public displayedColumns = [
    'profilePicture',
    'username',
    'email',
    'fullName',
    'birthDate',
    'joinedOn',
    'lastLogin',
    'roles',
    'actions',
  ];
  public dataSource = new MatTableDataSource<UserDataBaseInterface>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public loadUsers(): void {
    this.http
      .get<UserDataBaseInterface[]>('https://localhost:7262/Users/all')
      .subscribe((users) => (this.dataSource.data = users));
  }

  public searchUsers(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  public getProfileImage(image: string): string {
    return image && image !== 'string'
      ? this.authService.getFullImageUrl(image)
      : 'https://localhost:7262/Images/default/user.jpg';
  }

  async toggleAdminStatus(
    userId: string,
    currentStatus: boolean
  ): Promise<void> {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${
        currentStatus ? 'remove' : 'grant'
      } admin privileges?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
    });

    if (confirmed.isConfirmed) {
      this.http
        .patch(
          `https://localhost:7262/Users/${userId}/set-admin-status`,
          !currentStatus
        )
        .subscribe(() => {
          this.loadUsers();
          Swal.fire('Updated!', '', 'success');
        });
    }
  }

  async toggleDeveloperStatus(
    userId: string,
    currentStatus: boolean
  ): Promise<void> {
    const confirmed = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${
        currentStatus ? 'remove' : 'grant'
      } developer privileges?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
    });

    if (confirmed.isConfirmed) {
      this.http
        .patch(
          `https://localhost:7262/Users/${userId}/set-developer-status`,
          !currentStatus
        )
        .subscribe(() => {
          this.loadUsers();
          Swal.fire('Updated!', '', 'success');
        });
    }
  }

  async deleteUser(userId: string, username: string): Promise<void> {
    const confirmed = await Swal.fire({
      title: 'Delete user?',
      text: `Delete ${username} permanently?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    });

    if (confirmed.isConfirmed) {
      this.http
        .delete(`https://localhost:7262/Users/${userId}`)
        .subscribe(() => {
          this.loadUsers();
          Swal.fire('Deleted!', '', 'success');
        });
    }
  }
}
