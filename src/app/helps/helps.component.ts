import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-helps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.css']
})
export class HelpsComponent {
  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}