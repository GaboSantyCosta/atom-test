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
                component: TasksComponent
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
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
