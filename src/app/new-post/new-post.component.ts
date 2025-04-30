import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
  title: string = '';
  description: string = '';
  author: string = '';

  constructor(private http: HttpClient, private router: Router) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.author = user.username || 'Anonymous';
  }

  onSubmit() {
    const post = {
      title: this.title,
      description: this.description,
      author: this.author,
      timestamp: new Date().toISOString()
    };

    this.http.post('http://localhost:3000/discussions', post).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error creating post:', error);
        alert('Failed to create post. Please try again.');
      }
    });
  }
}