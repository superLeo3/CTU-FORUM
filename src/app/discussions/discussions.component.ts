import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discussions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css']
})
export class DiscussionsComponent implements OnInit {
  user: any;
  discussions: any[] = [];
  filteredDiscussions: any[] = [];
  selectedCategory: string = 'ALL';
  isMenuOpen: boolean = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchDiscussions();
  }

  fetchDiscussions() {
    this.http.get<any[]>('http://localhost:3000/discussions').subscribe({
      next: (discussions) => {
        this.discussions = discussions.map(discussion => ({
          ...discussion,
          timestamp: this.formatTimestamp(discussion.timestamp)
        }));
        this.filterDiscussions();
      },
      error: (error) => {
        console.error('Error fetching discussions:', error);
      }
    });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  }

  filterDiscussions() {
    if (this.selectedCategory === 'ALL') {
      this.filteredDiscussions = [...this.discussions];
    } else {
      this.filteredDiscussions = this.discussions.filter(discussion =>
        discussion.category.toUpperCase() === this.selectedCategory
      );
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterDiscussions();
  }

  startNewDiscussion() {
    this.router.navigate(['/new-post']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateTo(path: string) {
    this.isMenuOpen = false;
    this.router.navigate([path]);
  }
}