import { Injectable, signal } from '@angular/core';

export type PublicToastSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

export interface PublicToastMessage {
  severity?: PublicToastSeverity;
  summary: string;
  detail?: string;
  life?: number;
}

interface PublicToastRecord extends PublicToastMessage {
  id: number;
  severity: PublicToastSeverity;
}

@Injectable({ providedIn: 'root' })
export class PublicToastService {
  private nextId = 0;
  private readonly messagesSignal = signal<PublicToastRecord[]>([]);

  readonly messages = this.messagesSignal.asReadonly();

  add(message: PublicToastMessage): void {
    const record: PublicToastRecord = {
      id: ++this.nextId,
      severity: message.severity ?? 'info',
      summary: message.summary,
      detail: message.detail,
      life: message.life ?? 4500,
    };

    this.messagesSignal.update((messages) => [...messages, record]);
    globalThis.setTimeout(() => this.remove(record.id), record.life);
  }

  remove(id: number): void {
    this.messagesSignal.update((messages) => messages.filter((message) => message.id !== id));
  }
}
