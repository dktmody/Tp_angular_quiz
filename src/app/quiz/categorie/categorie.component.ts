import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Category } from '../../model/category.model';


@Component({
  selector: 'app-categorie',
  standalone: false,
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.scss'
})
export class CategorieComponent implements OnInit {
  categories: Category[] = [];
  filter = '';
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<Category[]>(`${this.baseUrl}/categories`).subscribe({
      next: (c) => this.categories = c,
      error: (err) => {
        console.error('Imposssible de charger les catégories', err);
        this.categories = [];
      }
    });
  }

  filteredCategories(): Category[] {
    const f = this.filter?.trim().toLowerCase();
    if (!f) return this.categories;
    return this.categories.filter(c => c.categoryLabel.toLowerCase().includes(f));
  }

  resetFilter() {
    this.filter = '';
  }

  openCategory(cat: Category) {
    this.router.navigate(['/quiz', 'category', cat.id]);
  }
}
