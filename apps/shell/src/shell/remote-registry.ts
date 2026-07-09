export interface RemoteDefinition {
  id: string;
  label: string;
  remoteName: string;
  elementName: string;
  remoteEntry: string;
  exposedModule: string;
}

export const remotes: RemoteDefinition[] = [
  {
    id: 'services',
    label: 'Citizen Services',
    remoteName: 'servicesRemote',
    elementName: 'public-services-root',
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    exposedModule: './web-component',
  },
  {
    id: 'reporting',
    label: 'Reporting',
    remoteName: 'reportingRemote',
    elementName: 'public-reporting-root',
    remoteEntry: 'http://localhost:4202/remoteEntry.js',
    exposedModule: './web-component',
  },
  {
    id: 'admin',
    label: 'Administration',
    remoteName: 'adminRemote',
    elementName: 'public-admin-root',
    remoteEntry: 'http://localhost:4203/remoteEntry.js',
    exposedModule: './web-component',
  },
];
