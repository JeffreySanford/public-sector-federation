export type RemoteKey = 'services' | 'reporting' | 'admin' | 'qa';

export interface RemoteDefinition {
  remoteEntry: string;
  elementName: string;
}

export type RemoteManifest = Record<RemoteKey, RemoteDefinition>;

let manifestPromise: Promise<RemoteManifest> | undefined;
const remoteEntryPromises = new Map<string, Promise<void>>();

function assertBrowserRuntime(): void {
  if (typeof document === 'undefined' || typeof customElements === 'undefined') {
    throw new Error('Remote elements can only be loaded in a browser runtime.');
  }
}

export function getRemoteManifest(): Promise<RemoteManifest> {
  manifestPromise ??= fetch('/module-federation.manifest.json').then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load remote manifest: ${response.status}`);
    }

    return response.json() as Promise<RemoteManifest>;
  });

  return manifestPromise;
}

export async function loadRemoteElement(remoteKey: RemoteKey): Promise<RemoteDefinition> {
  assertBrowserRuntime();

  const manifest = await getRemoteManifest();
  const remote = manifest[remoteKey];

  if (!customElements.get(remote.elementName)) {
    await loadRemoteEntry(remote.remoteEntry);
  }

  return remote;
}

function loadRemoteEntry(remoteEntry: string): Promise<void> {
  assertBrowserRuntime();

  const existing = remoteEntryPromises.get(remoteEntry);

  if (existing) {
    return existing;
  }

  const loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = remoteEntry;
    script.dataset['remoteEntry'] = remoteEntry;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      remoteEntryPromises.delete(remoteEntry);
      reject(new Error(`Unable to load remote entry: ${remoteEntry}`));
    };

    document.head.appendChild(script);
  });

  remoteEntryPromises.set(remoteEntry, loadPromise);

  return loadPromise;
}
