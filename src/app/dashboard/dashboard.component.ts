import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;
  discussions: any[] = [];
  events: any[] = [];
  notifications: any[] = [];
  joinedEvents: Set<number> = new Set();
  isMenuOpen: boolean = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchDiscussions();
    this.fetchEvents();
    this.fetchNotifications();
    this.fetchJoinedEvents();
  }

  fetchDiscussions() {
    this.http.get<any[]>('http://localhost:3000/discussions').subscribe({
      next: (discussions) => {
        this.discussions = discussions.map(discussion => ({
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
        this.events = events;
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  fetchNotifications() {
    this.http.get<any[]>('http://localhost:3000/notifications').subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }

  fetchJoinedEvents() {
    this.http.get<any[]>('http://localhost:3000/joinedEvents').subscribe({
      next: (joinedEvents) => {
        const userJoinedEvents = joinedEvents.filter(je => je.userId === this.user?.id);
        this.joinedEvents = new Set(userJoinedEvents.map(je => je.eventId));
      },
      error: (error) => {
        console.error('Error fetching joined events:', error);
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

  createNewPost() {
    this.router.navigate(['/new-post']);
  }

  joinEvent(eventId: number) {
    if (this.joinedEvents.has(eventId)) {
      alert('You have already joined this event!');
      return;
    }

    const joinData = {
      userId: this.user.id,
      eventId: eventId
    };

    this.http.post('http://localhost:3000/joinedEvents', joinData).subscribe({
      next: (response) => {
        this.joinedEvents.add(eventId);
        alert('Successfully joined the event!');
      },
      error: (error) => {
        console.error('Error joining event:', error);
        alert('Failed to join the event. Please try again.');
      }
    });
  }

  hasJoined(eventId: number): boolean {
    return this.joinedEvents.has(eventId);
  }

  viewNotifications() {
    this.router.navigate(['/notifications']);
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