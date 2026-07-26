# Map-Based Object Join Methodology

This document focuses exclusively on combining two object collections by a shared identifier using JavaScript or TypeScript `Map`.

## Problem

Assume one collection contains the primary records:

```ts
interface Bird {
  id: string;
  name: string;
}
```

A second collection contains related detail records:

```ts
interface BirdDetails {
  birdId: string;
  habitat: string;
}
```

The goal is to produce one combined collection:

```ts
interface CombinedBird extends Bird {
  details: BirdDetails | null;
}
```

## Example data

```ts
const birds: Bird[] = [
  { id: 'bird-001', name: 'Bald Eagle' },
  { id: 'bird-002', name: 'American Robin' },
  { id: 'bird-003', name: 'Peregrine Falcon' },
  { id: 'bird-004', name: 'Great Horned Owl' }
];

const birdDetails: BirdDetails[] = [
  { birdId: 'bird-001', habitat: 'Forests and waterways' },
  { birdId: 'bird-002', habitat: 'Woodlands, parks, and backyards' },
  { birdId: 'bird-004', habitat: 'Forests, deserts, and open country' }
];
```

## Map-based join

```ts
function combineBirds(
  birds: ReadonlyArray<Bird>,
  details: ReadonlyArray<BirdDetails>
): ReadonlyArray<CombinedBird> {
  const detailsByBirdId = new Map<string, BirdDetails>(
    details.map(detail => [detail.birdId, detail])
  );

  return birds.map(bird => ({
    ...bird,
    details: detailsByBirdId.get(bird.id) ?? null
  }));
}
```

## How it works

### 1. Create an index

```ts
const detailsByBirdId = new Map<string, BirdDetails>(
  details.map(detail => [detail.birdId, detail])
);
```

The second collection is transformed into key-value pairs:

```ts
[
  ['bird-001', { birdId: 'bird-001', habitat: 'Forests and waterways' }],
  ['bird-002', { birdId: 'bird-002', habitat: 'Woodlands, parks, and backyards' }],
  ['bird-004', { birdId: 'bird-004', habitat: 'Forests, deserts, and open country' }]
]
```

The resulting `Map` allows direct lookup by `birdId`:

```ts
detailsByBirdId.get('bird-001');
```

### 2. Traverse the primary collection once

```ts
return birds.map(bird => ({
  ...bird,
  details: detailsByBirdId.get(bird.id) ?? null
}));
```

For each bird:

1. Copy the original bird properties.
2. Look up the matching detail object by ID.
3. Use `null` when no matching detail exists.

## Result

```ts
[
  {
    id: 'bird-001',
    name: 'Bald Eagle',
    details: {
      birdId: 'bird-001',
      habitat: 'Forests and waterways'
    }
  },
  {
    id: 'bird-002',
    name: 'American Robin',
    details: {
      birdId: 'bird-002',
      habitat: 'Woodlands, parks, and backyards'
    }
  },
  {
    id: 'bird-003',
    name: 'Peregrine Falcon',
    details: null
  },
  {
    id: 'bird-004',
    name: 'Great Horned Owl',
    details: {
      birdId: 'bird-004',
      habitat: 'Forests, deserts, and open country'
    }
  }
]
```

## Why use `Map` instead of nested searches?

A common alternative is:

```ts
return birds.map(bird => ({
  ...bird,
  details: details.find(detail => detail.birdId === bird.id) ?? null
}));
```

This is easy to read, but `find()` may scan the entire details array for every bird.

For `n` birds and `m` detail records:

```text
map() + find(): O(n × m)
```

The `Map` version performs two linear passes:

```text
Build the Map: O(m)
Traverse birds: O(n)
Total: O(n + m)
```

The tradeoff is additional memory for the lookup index:

```text
Additional space: O(m)
```

## Duplicate keys

A `Map` can contain only one value for each key. When duplicate IDs are supplied, the last value wins:

```ts
const details: BirdDetails[] = [
  { birdId: 'bird-001', habitat: 'Original habitat' },
  { birdId: 'bird-001', habitat: 'Updated habitat' }
];
```

After creating the `Map`:

```ts
detailsByBirdId.get('bird-001');
```

returns:

```ts
{
  birdId: 'bird-001',
  habitat: 'Updated habitat'
}
```

Duplicate handling should be intentional. Depending on the requirements, alternatives include:

- reject duplicate IDs;
- keep the first record;
- keep the last record;
- group all records under the same key.

## Grouping multiple records per key

When one primary record may have several related records, store an array in the `Map`:

```ts
interface BirdObservation {
  birdId: string;
  location: string;
}

function groupObservations(
  observations: ReadonlyArray<BirdObservation>
): Map<string, BirdObservation[]> {
  const observationsByBirdId = new Map<string, BirdObservation[]>();

  for (const observation of observations) {
    const current = observationsByBirdId.get(observation.birdId) ?? [];
    observationsByBirdId.set(observation.birdId, [
      ...current,
      observation
    ]);
  }

  return observationsByBirdId;
}
```

This produces a one-to-many index:

```ts
Map<string, BirdObservation[]>
```

## Immutability

The join should return new objects rather than changing the source records:

```ts
return birds.map(bird => ({
  ...bird,
  details: detailsByBirdId.get(bird.id) ?? null
}));
```

The spread operator creates a new combined object. The original arrays are not modified.

For stronger TypeScript intent, accept and return read-only collections:

```ts
function combineBirds(
  birds: ReadonlyArray<Bird>,
  details: ReadonlyArray<BirdDetails>
): ReadonlyArray<CombinedBird> {
  // implementation
}
```

## When not to join in application memory

A `Map` join is appropriate when both collections are already in memory and their size is reasonable.

For very large database-backed datasets, prefer performing the join in the database when possible:

```sql
SELECT
  b.id,
  b.name,
  d.habitat
FROM birds b
LEFT JOIN bird_details d
  ON d.bird_id = b.id;
```

The database can use indexes, filtering, sorting, projections, and pagination before transferring the result to the application.

## Interview explanation

> I index the secondary collection in a `Map` using the shared identifier, then make one pass over the primary collection and perform direct lookups. This changes the join from potentially O(n × m) with `find()` inside `map()` to approximately O(n + m), at the cost of O(m) additional memory. I preserve unmatched primary records by returning `null` for missing details, avoid mutating the source collections, and define an explicit policy for duplicate keys.

## Core pattern

```ts
const relatedById = new Map(
  relatedRecords.map(record => [record.foreignKey, record])
);

const combined = primaryRecords.map(record => ({
  ...record,
  related: relatedById.get(record.id) ?? null
}));
```

This pattern applies broadly to:

- users and profiles;
- orders and customers;
- cases and owners;
- products and inventory;
- projects and status records;
- birds and habitat details.
