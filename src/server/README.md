# Server Processes

This directory contains server-side processes and cron jobs for the Pyörävahti application.

## Cron Jobs

### fetchForSale.ts

Fetches external listings from sources like Tori.fi and creates bike records for them.

**Usage:**
```bash
yarn cron:fetch
```

**Functionality:**
- Fetches external listings from configured sources
- Converts listings to bike records
- Creates new bike records for new listings
- Updates existing bike records for updated listings
- Sets bike status to `FOR_SALE_EXTERNAL`

**Feature Flag:**
This cron job respects the `ENABLE_TORI_ADAPTER` environment variable. 
Set `ENABLE_TORI_ADAPTER=false` to disable fetching external listings.

### recomputeMatches.ts

Recomputes matches for recently added bikes to find potential connections between lost/stolen and found/for-sale bikes.

**Usage:**
```bash
yarn cron:match
```

**Functionality:**
- Processes bikes created in the last 24 hours
- Finds matches based on:
  - Serial number matching
  - pHash visual similarity
  - Keyword and city matching
- Logs matches with confidence scores

## Scheduling

These cron jobs should be scheduled to run periodically:

- `fetchForSale.ts`: Every hour
- `recomputeMatches.ts`: Every 15 minutes

Example crontab entries:
```
0 * * * * cd /path/to/bicyai && yarn cron:fetch
*/15 * * * * cd /path/to/bicyai && yarn cron:match
```

## Environment Variables

- `ENABLE_TORI_ADAPTER` - Set to `false` to disable the Tori.fi adapter (default: `true`)