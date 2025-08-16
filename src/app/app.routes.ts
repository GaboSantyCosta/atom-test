import { DashboardComponent } from './views/dashboard/dashboard';
import { LoginComponent } from './views/login/login';
import { Routes } from '@angular/router';
import { TasksComponent } from './views/dashboard/tasks/tasks.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'tasks',
                loadComponent: () => import('./views/dashboard/tasks/tasks.component').then(m => m.TasksComponent)
            },
            {
                path: '',
                redirectTo: 'tasks',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./views/login/login').then(m => m.LoginComponent)
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
