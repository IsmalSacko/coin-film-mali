import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Movie, MovieServces } from './services/movies/movie-servces';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  
})
export class App implements OnInit {
  protected readonly title = signal('cinezone-frontend');
  private movieServices = inject(MovieServces);
  movies = signal<Movie[]>([]);


    ngOnInit() {
      this.movieServices.getAll().subscribe({
        next: (response) => {
          this.movies.set(response);
          console.log('Movies fetched successfully:', response);
        },
        error: (error) => {
          console.error('Error fetching movies:', error);
        }
      });

  }
}
