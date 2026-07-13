import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PublicButtonComponent } from '@public-sector/ui-patterns';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'public-admin-remote',
  standalone: true,
  imports: [
    FormsModule,
    PublicButtonComponent,
    CardModule,
    DialogModule,
    MenuModule,
    PasswordModule,
    ToastModule,
    TagModule,
    ToggleSwitchModule,
  ],
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

  constructor(private readonly messages: MessageService) {}

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
