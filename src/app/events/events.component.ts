import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  user: any;
  events: any[] = [];
  filteredEvents: any[] = [];
  selectedCategory: string = 'ALL';
  joinedEvents: Set<number> = new Set();
  isMenuOpen: boolean = false;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchEvents();
    this.fetchJoinedEvents();
  }

  fetchEvents() {
    this.http.get<any[]>('http://localhost:3000/events').subscribe({
      next: (events) => {
        this.events = events.map(event => ({
          ...event,
          formattedDate: this.formatDate(event.dateTime)
        }));
        this.filterEvents();
      },
      error: (error) => {
        console.error('Error fetching events:', error);
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

  filterEvents() {
    if (this.selectedCategory === 'ALL') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.category.toUpperCase() === this.selectedCategory
      );
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterEvents();
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

  setReminder(eventId: number) {
    alert('Reminder set for event ID: ' + eventId);
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