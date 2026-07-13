import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PublicButtonComponent,
  PublicCardComponent,
  PublicDialogComponent,
  PublicTagComponent,
  PublicToastComponent,
  PublicToastService,
} from '@public-sector/ui-patterns';

@Component({
  selector: 'public-admin-remote',
  standalone: true,
  imports: [FormsModule, PublicButtonComponent, PublicCardComponent, PublicDialogComponent, PublicTagComponent, PublicToastComponent],
  templateUrl: './admin-remote.component.html',
  styleUrl: './admin-remote.component.css',
})
export class AdminRemoteComponent {
  visible = false;
  auditLogging = true;
  maintenanceMode = false;
  temporaryPassword = '';

  readonly actions = [
    {
      label: 'Review audit log',
      icon: 'pi pi-list',
      command: () => this.showToast('Audit log queued for review'),
    },
    {
      label: 'Notify administrators',
      icon: 'pi pi-envelope',
      command: () => this.showToast('Administrator notification sent'),
    },
  ];

  constructor(private readonly messages: PublicToastService) {}

  openDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  confirmDialog(): void {
    this.visible = false;
    this.showToast('Dialog confirmed');
  }

  showToast(summary = 'Settings saved'): void {
    this.messages.add({
      severity: 'success',
      summary,
      detail: 'Shared PrimeNG z-index and overlay policy handled this interaction.',
      life: 4500,
    });
  }
}
