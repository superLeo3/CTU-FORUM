import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  course: string = '';
  yearLevel: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  onSubmit() {
    const user = {
      username: this.username,
      email: this.email,
      password: this.password,
      course: this.course,
      yearLevel: this.yearLevel
    };

    this.http.post('http://localhost:3000/users', user).subscribe({
      next: (response) => {
        console.log('User signed up successfully:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during sign-up:', error);
        alert('Sign-up failed. Please try again.');
      }
    });
  }
}