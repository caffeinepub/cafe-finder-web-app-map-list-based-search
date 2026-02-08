import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Cafe } from '@/backend';
import {
  latLngToPixel,
  wrapTileX,
  clampTileY,
  pixelToLatLng,
  normalizeLongitude,
  clampLatitude,
  TILE_SIZE,
} from '@/lib/webMercator';

interface CafeTileMapProps {
  cafes: Cafe[];
  selectedCafeId?: string | null;
  onCafeSelect?: (cafeId: string) => void;
  centerOn?: { lat: number; lng: number };
}

export default function CafeTileMap({
  cafes,
  selectedCafeId,
  onCafeSelect,
  centerOn,
}: CafeTileMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Default to world view when no cafes/center, otherwise use appropriate zoom for results
  const [zoom, setZoom] = useState(cafes.length > 0 || centerOn ? 12 : 2);
  const [center, setCenter] = useState({ lat: 0, lng: 0 }); // World center default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredCafeId, setHoveredCafeId] = useState<string | null>(null);
  const [clickedCafeId, setClickedCafeId] = useState<string | null>(null);
  const tilesCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Initialize center from first cafe or centerOn prop
  useEffect(() => {
    if (centerOn) {
      setCenter({ lat: clampLatitude(centerOn.lat), lng: normalizeLongitude(centerOn.lng) });
      setZoom(12); // Restore appropriate zoom for viewing a specific cafe
      setOffset({ x: 0, y: 0 }); // Reset offset when programmatically centering
    } else if (cafes.length > 0 && !centerOn) {
      const firstCafe = cafes[0];
      setCenter({
        lat: clampLatitude(firstCafe.coordinates[0]),
        lng: normalizeLongitude(firstCafe.coordinates[1]),
      });
      setZoom(12); // Restore appropriate zoom for viewing results
      setOffset({ x: 0, y: 0 }); // Reset offset when programmatically centering
    } else if (cafes.length === 0 && !centerOn) {
      // No cafes and no center override: show world view
      setCenter({ lat: 0, lng: 0 });
      setZoom(2);
      setOffset({ x: 0, y: 0 });
    }
  }, [cafes, centerOn]);

  // Render map tiles and markers
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);

    // Calculate center pixel with normalized coordinates
    const normalizedCenter = {
      lat: clampLatitude(center.lat),
      lng: normalizeLongitude(center.lng),
    };
    const centerPixel = latLngToPixel(normalizedCenter.lat, normalizedCenter.lng, zoom);
    const viewCenterX = width / 2;
    const viewCenterY = height / 2;

    // Calculate tile range
    const startTileX = Math.floor((centerPixel.x - viewCenterX + offset.x) / TILE_SIZE);
    const startTileY = Math.floor((centerPixel.y - viewCenterY + offset.y) / TILE_SIZE);
    const endTileX = Math.ceil((centerPixel.x + viewCenterX + offset.x) / TILE_SIZE);
    const endTileY = Math.ceil((centerPixel.y + viewCenterY + offset.y) / TILE_SIZE);

    // Draw tiles with wrap-around for X and clamping for Y
    for (let tileX = startTileX; tileX <= endTileX; tileX++) {
      for (let tileY = startTileY; tileY <= endTileY; tileY++) {
        // Wrap X coordinate for horizontal wrap-around
        const wrappedTileX = wrapTileX(tileX, zoom);
        // Clamp Y coordinate to valid range
        const clampedTileY = clampTileY(tileY, zoom);
        
        // Skip if Y is out of bounds (shouldn't happen with clamping, but safety check)
        const maxTile = Math.pow(2, zoom) - 1;
        if (tileY < 0 || tileY > maxTile) continue;

        // Use wrapped/clamped coordinates for cache key and URL
        const tileKey = `${zoom}/${wrappedTileX}/${clampedTileY}`;
        let tile = tilesCache.current.get(tileKey);

        if (!tile) {
          tile = new Image();
          tile.crossOrigin = 'anonymous';
          tile.src = `https://tile.openstreetmap.org/${zoom}/${wrappedTileX}/${clampedTileY}.png`;
          tilesCache.current.set(tileKey, tile);

          tile.onload = () => {
            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              if (ctx && tile) {
                // Use original tileX for drawing position (not wrapped) to maintain continuity
                const x = tileX * TILE_SIZE - (centerPixel.x - viewCenterX + offset.x);
                const y = tileY * TILE_SIZE - (centerPixel.y - viewCenterY + offset.y);
                ctx.drawImage(tile, x, y, TILE_SIZE, TILE_SIZE);
              }
            }
          };
        }

        if (tile && tile.complete) {
          // Use original tileX for drawing position (not wrapped) to maintain continuity
          const x = tileX * TILE_SIZE - (centerPixel.x - viewCenterX + offset.x);
          const y = tileY * TILE_SIZE - (centerPixel.y - viewCenterY + offset.y);
          ctx.drawImage(tile, x, y, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Draw markers
    cafes.forEach((cafe) => {
      const cafePixel = latLngToPixel(cafe.coordinates[0], cafe.coordinates[1], zoom);
      const markerX = cafePixel.x - (centerPixel.x - viewCenterX + offset.x);
      const markerY = cafePixel.y - (centerPixel.y - viewCenterY + offset.y);

      const isSelected = selectedCafeId === cafe.id.toString();
      const isHovered = hoveredCafeId === cafe.id.toString();
      const isClicked = clickedCafeId === cafe.id.toString();

      // Draw marker pin
      ctx.save();
      ctx.translate(markerX, markerY);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(0, 28, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pin body
      const pinSize = isSelected || isHovered || isClicked ? 32 : 28;
      ctx.fillStyle = isSelected ? '#ea580c' : isClicked ? '#f97316' : '#fb923c';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(0, 0, pinSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pin icon (simplified map pin)
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, -2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.lineTo(0, 8);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.restore();
    });
  }, [cafes, center, zoom, offset, selectedCafeId, hoveredCafeId, clickedCafeId]);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      // Check if hovering over a marker
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const normalizedCenter = {
        lat: clampLatitude(center.lat),
        lng: normalizeLongitude(center.lng),
      };
      const centerPixel = latLngToPixel(normalizedCenter.lat, normalizedCenter.lng, zoom);
      const viewCenterX = width / 2;
      const viewCenterY = height / 2;

      let foundHover = false;
      for (const cafe of cafes) {
        const cafePixel = latLngToPixel(cafe.coordinates[0], cafe.coordinates[1], zoom);
        const markerX = cafePixel.x - (centerPixel.x - viewCenterX + offset.x);
        const markerY = cafePixel.y - (centerPixel.y - viewCenterY + offset.y);

        const distance = Math.sqrt(
          Math.pow(mouseX - markerX, 2) + Math.pow(mouseY - markerY, 2)
        );

        if (distance < 16) {
          setHoveredCafeId(cafe.id.toString());
          canvas.style.cursor = 'pointer';
          foundHover = true;
          break;
        }
      }

      if (!foundHover) {
        setHoveredCafeId(null);
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      // Update center based on offset
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const normalizedCenter = {
          lat: clampLatitude(center.lat),
          lng: normalizeLongitude(center.lng),
        };
        const centerPixel = latLngToPixel(normalizedCenter.lat, normalizedCenter.lng, zoom);
        const newCenterPixelX = centerPixel.x + offset.x;
        const newCenterPixelY = centerPixel.y + offset.y;

        // Convert back to lat/lng with normalization
        const newCenter = pixelToLatLng(newCenterPixelX, newCenterPixelY, zoom);
        setCenter(newCenter);
        setOffset({ x: 0, y: 0 });
      }
    } else {
      // Check if clicked on a marker
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const normalizedCenter = {
        lat: clampLatitude(center.lat),
        lng: normalizeLongitude(center.lng),
      };
      const centerPixel = latLngToPixel(normalizedCenter.lat, normalizedCenter.lng, zoom);
      const viewCenterX = width / 2;
      const viewCenterY = height / 2;

      for (const cafe of cafes) {
        const cafePixel = latLngToPixel(cafe.coordinates[0], cafe.coordinates[1], zoom);
        const markerX = cafePixel.x - (centerPixel.x - viewCenterX + offset.x);
        const markerY = cafePixel.y - (centerPixel.y - viewCenterY + offset.y);

        const distance = Math.sqrt(
          Math.pow(mouseX - markerX, 2) + Math.pow(mouseY - markerY, 2)
        );

        if (distance < 16) {
          setClickedCafeId(cafe.id.toString());
          if (onCafeSelect) {
            onCafeSelect(cafe.id.toString());
          }
          break;
        }
      }
    }
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 1, 1));
  };

  // Get clicked cafe details
  const clickedCafe = cafes.find((c) => c.id.toString() === clickedCafeId);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border">
      <div
        ref={containerRef}
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDragging(false);
          setHoveredCafeId(null);
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="shadow-lg"
          disabled={zoom >= 18}
        >
          +
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="shadow-lg"
          disabled={zoom <= 1}
        >
          −
        </Button>
      </div>

      {/* Cafe popup */}
      {clickedCafe && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-sm p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                {clickedCafe.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {clickedCafe.address}
              </p>
              <Button
                size="sm"
                onClick={() => {
                  window.location.href = `/cafes/${clickedCafe.id}`;
                }}
                className="w-full"
              >
                <MapPin className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setClickedCafeId(null)}
              className="flex-shrink-0"
            >
              ×
            </Button>
          </div>
        </Card>
      )}

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        © OpenStreetMap
      </div>
    </div>
  );
}
