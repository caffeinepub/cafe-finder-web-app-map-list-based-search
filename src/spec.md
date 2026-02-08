# Specification

## Summary
**Goal:** Make the existing OpenStreetMap tile map support reliable worldwide browsing by handling longitudinal wrap-around and latitude bounds, without adding Google Maps.

**Planned changes:**
- Update tile URL/tile index logic so tile X wraps correctly across the International Date Line for each zoom level.
- Clamp tile Y requests to valid Web Mercator bounds per zoom level to avoid invalid tile URLs and rendering gaps.
- Adjust the default map viewport to a neutral, world-level view when no cafes are available, while keeping current centering behavior when cafes exist or a cafe is selected.

**User-visible outcome:** Users can pan/zoom anywhere on Earth without tile-loading errors (including across the Date Line), and the map opens to a world view when there are no cafe results.
