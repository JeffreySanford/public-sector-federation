export type RemoteKey = 'services' | 'reporting' | 'admin' | 'qa';

export interface RemoteDefinition {
  remoteEntry: string;
  elementName: string;
}

export type RemoteManifest = Record<RemoteKey, RemoteDefinition>;

let manifestPromise: Promise<RemoteManifest> | undefined;

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
  const manifest = await getRemoteManifest();
  const remote = manifest[remoteKey];

  if (!customElements.get(remote.elementName)) {
    await import(/* @vite-ignore */ remote.remoteEntry);
  }

  return remote;
}
