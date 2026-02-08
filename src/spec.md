# Specification

## Summary
**Goal:** Replace any Google Maps/unsupported map integration with a deployment-supported, tile-based map view that renders cafe markers from stored latitude/longitude and works in the platform build/preview environment without API keys.

**Planned changes:**
- Remove Google Maps Platform / Google Maps JS SDK (and any other unsupported map libraries) from the frontend.
- Add a deployment-supported, tile-based (or fully custom) map UI that displays markers for the currently returned cafes using their stored coordinates.
- Implement coordinated map/list selection: clicking a cafe in the list highlights and centers its marker; clicking a marker shows a clear affordance to open the cafe details route (`/cafes/$id`).
- Ensure selection state stays consistent (single selected cafe) and updates correctly when the search result set changes.

**User-visible outcome:** Users can view search results on a map without any API keys; selecting a cafe in the list centers/highlights it on the map, and selecting a map marker provides an obvious way to open that cafe’s details page.
