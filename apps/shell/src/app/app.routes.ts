import { Routes } from '@angular/router';
import { RemoteHostComponent } from './remote-host.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'services',
  },
  {
    path: 'services',
    component: RemoteHostComponent,
    data: { remote: 'services' },
  },
  {
    path: 'reporting',
    component: RemoteHostComponent,
    data: { remote: 'reporting' },
  },
  {
    path: 'admin',
    component: RemoteHostComponent,
    data: { remote: 'admin' },
  },
  {
    path: 'qa',
    component: RemoteHostComponent,
    data: { remote: 'qa' },
  },
];
