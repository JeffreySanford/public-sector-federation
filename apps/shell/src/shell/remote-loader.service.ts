import { Injectable } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { RemoteDefinition } from './remote-registry';

@Injectable({ providedIn: 'root' })
export class RemoteLoaderService {
  private readonly loadedEntries = new Set<string>();

  async load(remote: RemoteDefinition): Promise<void> {
    const key = `${remote.remoteName}:${remote.exposedModule}`;

    if (this.loadedEntries.has(key)) {
      return;
    }

    await loadRemoteModule({
      type: 'module',
      remoteEntry: remote.remoteEntry,
      exposedModule: remote.exposedModule,
    });

    this.loadedEntries.add(key);
  }
}
