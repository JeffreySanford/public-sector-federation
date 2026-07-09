import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { remotes, RemoteDefinition } from './remote-registry';
import { RemoteLoaderService } from './remote-loader.service';

@Component({
  selector: 'ps-shell-root',
  standalone: true,
  imports: [ButtonModule, CardModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  readonly remotes = remotes;
  readonly activeRemote = signal<RemoteDefinition>(remotes[0]);
  readonly isDark = signal(false);

  constructor(private readonly remoteLoader: RemoteLoaderService) {
    void this.selectRemote(remotes[0]);
  }

  async selectRemote(remote: RemoteDefinition): Promise<void> {
    await this.remoteLoader.load(remote);
    this.activeRemote.set(remote);
  }

  toggleTheme(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.classList.toggle('p-dark', next);
  }
}
