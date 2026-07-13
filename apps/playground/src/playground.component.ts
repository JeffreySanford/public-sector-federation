import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PublicSectorThemeService } from '@public-sector/primeng-preset';

@Component({
  selector: 'public-sector-playground',
  standalone: true,
  imports: [
    FormsModule,
    PublicButtonComponent,
    CardModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './playground.component.html',
  styleUrl: './playground.component.css',
})
export class PlaygroundComponent {
  visible = false;
  status = 'active';

  readonly statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Closed', value: 'closed' },
  ];

  readonly rows = [
    { name: 'Button', layer: 'component', state: 'Mapped' },
    { name: 'Card', layer: 'component', state: 'Mapped' },
    { name: 'DataTable', layer: 'component', state: 'Mapped' },
  ];

  constructor(readonly theme: PublicSectorThemeService) {}
}
