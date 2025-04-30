import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any;
  discussions: any[] = [];
  events: any[] = [];
  activities: any[] = [];
  joinedEvents: any[] = [];
  joinedActivities: any[] = [];
  selectedTab: string = 'Posts';
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
      this.fetchDiscussions();
      this.fetchEvents();
      this.fetchActivities();
      this.fetchJoinedEvents();
      this.fetchJoinedActivities();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  fetchDiscussions() {
    this.http.get<any[]>('http://localhost:3000/discussions').subscribe({
      next: (discussions) => {
        this.discussions = discussions
          .filter(discussion => discussion.author === this.user.username)
          .map(discussion => ({
            ...discussion,
            timestamp: this.formatTimestamp(discussion.timestamp)
          }));
      },
      error: (error) => {
        console.error('Error fetching discussions:', error);
      }
    });
  }

  fetchEvents() {
    this.http.get<any[]>('http://localhost:3000/events').subscribe({
      next: (events) => {
        this.events = events.map(event => ({
          ...event,
          formattedDate: this.formatDate(event.dateTime)
        }));
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  fetchActivities() {
    this.http.get<any[]>('http://localhost:3000/activities').subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (error) => {
        console.error('Error fetching activities:', error);
      }
    });
  }

  fetchJoinedEvents() {
    this.http.get<any[]>('http://localhost:3000/joinedEvents').subscribe({
      next: (joinedEvents) => {
        this.joinedEvents = joinedEvents
          .filter(je => je.userId === this.user.id)
          .map(je => {
            const event = this.events.find(e => e.id === je.eventId);
            return {
              ...je,
              eventDetails: event,
              joinedAt: this.formatTimestamp(new Date().toISOString()) // Placeholder timestamp
            };
          });
      },
      error: (error) => {
        console.error('Error fetching joined events:', error);
      }
    });
  }

  fetchJoinedActivities() {
    this.http.get<any[]>('http://localhost:3000/joinedActivities').subscribe({
      next: (joinedActivities) => {
        this.joinedActivities = joinedActivities
          .filter(ja => ja.userId === this.user.id)
          .map(ja => {
            const activity = this.activities.find(a => a.id === ja.activityId);
            return {
              ...ja,
              activityDetails: activity,
              joinedAt: this.formatTimestamp(new Date().toISOString()) // Placeholder timestamp
            };
          });
      },
      error: (error) => {
        console.error('Error fetching joined activities:', error);
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

  formatDate(dateTime: string): string {
    const date = new Date(dateTime);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${month} ${day}, ${year} - ${hours}:${minutes} ${ampm}`;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  editProfile() {
    alert('Edit Profile functionality to be implemented.');
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