import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search.component').then(c => c.SearchComponent),
  },
  {
    path: 'wallet/:id',
    loadComponent: () =>
      import('./features/wallet-value/wallet-value.component').then(c => c.WalletValueComponent),
  },
];
