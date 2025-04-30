import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    // For now, we'll use static data; we'll make this dynamic later
    this.notifications = [
      { message: 'New comment on your post!', timestamp: '1 hour ago' },
      { message: 'Event reminder: Tech Exhibit 2025', timestamp: '3 hours ago' },
      { message: 'You have a new follower!', timestamp: '5 hours ago' }
    ];
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}