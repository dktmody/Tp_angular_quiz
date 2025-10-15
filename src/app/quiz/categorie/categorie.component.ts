import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../model/category.model';


@Component({
  selector: 'app-categorie',
  standalone: false,
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {
  categories: Category[] = [];
  @Input() searchText: string = '';
  @Output() searchApplied = new EventEmitter<string>();
  filter = '';
  @Input() playerName?: string | null = null;
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (!this.playerName) {
      this.playerName = this.route.snapshot.paramMap.get('playerName');
    }
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
    return this.categories.filter(c => c.name.toLowerCase().includes(f));
  }

  resetFilter() {
    this.filter = '';
    this.searchText = '';
  }

  applyFilter() {
    this.filter = this.searchText;
    this.searchApplied.emit(this.filter);
  }

  openCategory(cat: Category) {
    if (this.playerName) {
      this.router.navigate(['/quiz', this.playerName, 'category', cat.id]);
    } else {
      this.router.navigate(['/quiz', 'guest', 'category', cat.id]);
    }
  }
}
