# Specification

## Summary
**Goal:** Make cafe search work with any combination of keyword, city, and area, including city-only and area-only searches.

**Planned changes:**
- Update the Motoko `searchCafes` backend logic so keyword is optional, city/area filters work independently, and results match all provided (non-blank) filters using case-insensitive partial matching.
- Ensure `searchCafes` returns an empty result set when keyword, city, and area are all blank, while keeping results sorted by cafe name.
- Update the frontend search form to allow searching when keyword is empty as long as city and/or area is provided, with distinct City and Area inputs (English labels/placeholders).
- Update the frontend search hook/React Query usage so `keyword`, `city`, and `area` are included in the queryKey and all three are passed to `actor.searchCafes(keyword, cityOrNull, areaOrNull)`.
- Adjust empty state and results summary text so city-only/area-only searches don’t display misleading keyword-based messaging.

**User-visible outcome:** Users can search for cafes by keyword, by city, by area, or any combination of these fields, and the search button works as long as at least one field is filled.
