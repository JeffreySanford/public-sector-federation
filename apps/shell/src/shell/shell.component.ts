import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { PublicButtonComponent, PublicCardComponent } from '@public-sector/ui-patterns';
import { PublicSectorThemeService } from '@public-sector/primeng-preset';
import { remotes, RemoteDefinition } from './remote-registry';
import { RemoteLoaderService } from './remote-loader.service';

@Component({
  selector: 'ps-shell-root',
  standalone: true,
  imports: [PublicButtonComponent, PublicCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  readonly remotes = remotes;
  readonly activeRemote = signal<RemoteDefinition>(remotes[0]);

  constructor(
    private readonly remoteLoader: RemoteLoaderService,
    readonly theme: PublicSectorThemeService,
  ) {
    void this.selectRemote(remotes[0]);
  }

  async selectRemote(remote: RemoteDefinition): Promise<void> {
    await this.remoteLoader.load(remote);
    this.activeRemote.set(remote);
  }

  toggleTheme(): void {
    this.theme.toggleDarkMode();
  }
}
