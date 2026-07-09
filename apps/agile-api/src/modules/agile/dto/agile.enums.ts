export const workItemStatuses = ['backlog', 'next', 'in_progress', 'blocked', 'review', 'done'] as const;
export const workItemTypes = ['story', 'task', 'spike', 'blocker'] as const;
export const effortLevels = ['small', 'medium', 'large'] as const;
export const timeActivityTypes = ['discovery', 'design', 'development', 'review', 'validation', 'documentation'] as const;

export type WorkItemStatusDto = (typeof workItemStatuses)[number];
export type WorkItemTypeDto = (typeof workItemTypes)[number];
export type EffortLevelDto = (typeof effortLevels)[number];
export type TimeActivityTypeDto = (typeof timeActivityTypes)[number];
