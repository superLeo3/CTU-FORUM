import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  user: any;
  activities: any[] = [];
  filteredActivities: any[] = [];
  selectedCategory: string = 'ALL';
  joinedActivities: Set<number> = new Set();
  isMenuOpen: boolean = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    try {
      this.user = this.authService.getUser();
      if (!this.user) {
        console.log('No user found, redirecting to login');
        this.router.navigate(['/login']);
        return;
      }
      this.fetchActivities();
      this.fetchJoinedActivities();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  fetchActivities() {
    this.http.get<any[]>('http://localhost:3000/activities').subscribe({
      next: (activities) => {
        this.activities = activities;
        this.filterActivities();
      },
      error: (error) => {
        console.error('Error fetching activities:', error);
      }
    });
  }

  fetchJoinedActivities() {
    this.http.get<any[]>('http://localhost:3000/joinedActivities').subscribe({
      next: (joinedActivities) => {
        const userJoinedActivities = joinedActivities.filter(ja => ja.userId === this.user?.id);
        this.joinedActivities = new Set(userJoinedActivities.map(ja => ja.activityId));
      },
      error: (error) => {
        console.error('Error fetching joined activities:', error);
      }
    });
  }

  filterActivities() {
    if (this.selectedCategory === 'ALL') {
      this.filteredActivities = [...this.activities];
    } else {
      this.filteredActivities = this.activities.filter(activity =>
        activity.category.toUpperCase() === this.selectedCategory
      );
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterActivities();
  }

  joinActivity(activityId: number) {
    if (this.joinedActivities.has(activityId)) {
      alert('You have already joined this activity!');
      return;
    }

    const joinData = {
      userId: this.user.id,
      activityId: activityId
    };

    this.http.post('http://localhost:3000/joinedActivities', joinData).subscribe({
      next: (response) => {
        this.joinedActivities.add(activityId);
        alert('Successfully joined the activity!');
      },
      error: (error) => {
        console.error('Error joining activity:', error);
        alert('Failed to join the activity. Please try again.');
      }
    });
  }

  hasJoined(activityId: number): boolean {
    return this.joinedActivities.has(activityId);
  }

  learnMore(activityId: number) {
    alert('Learn more about activity ID: ' + activityId);
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
    console.log('Navigating to:', path);
    this.isMenuOpen = false;
    this.router.navigate([path]).then(success => {
      if (!success) {
        console.error('Navigation failed to:', path);
      }
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}