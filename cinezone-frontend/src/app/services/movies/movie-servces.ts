import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { map } from 'rxjs';

export interface Category {
  id: number;
  name: string;
}
export interface Movie {
  id?: number;
  title: string;
  director?: string;
  release_year?: number; // integer
  rating?: number;       // corrigé
  category_id?: number;
  Category?: { id: number; name: string };
}




@Injectable({
  providedIn: 'root',
})


export class MovieServces {
   private httpClient = inject(HttpClient);
   private readonly base = environment.apiUrl;
   private readonly moviesEndpoint = `${this.base}/movies`;

   getAll() {
     return this.httpClient.get<any>(this.moviesEndpoint).pipe(
      map(response => response.movies) // on extrait le tableau de films
    );  
   }
}


