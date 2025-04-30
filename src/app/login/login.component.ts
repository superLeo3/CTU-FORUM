import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  onSubmit() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (users) => {
        const user = users.find(u => u.username === this.username && u.password === this.password);
        if (user) {
          this.authService.setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          alert('Login successful!');
          this.router.navigate(['/dashboard']);
        } else {
          alert('Invalid username or password.');
        }
      },
      error: (error) => {
        console.error('Error during login:', error);
        alert('Login failed. Please try again.');
      }
    });
  }
}