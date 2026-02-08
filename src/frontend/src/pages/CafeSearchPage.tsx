import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Map, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CafeCard from '@/components/cafes/CafeCard';
import EmptyState from '@/components/cafes/EmptyState';
import LoadingState from '@/components/cafes/LoadingState';
import CafeTileMap from '@/components/cafes/CafeTileMap';
import { useCafeSearch } from '@/hooks/useCafeSearch';

export default function CafeSearchPage() {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [searchParams, setSearchParams] = useState<{ keyword: string; city: string } | null>(null);
  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);

  const { data: cafes, isLoading, error } = useCafeSearch(
    searchParams?.keyword || '',
    searchParams?.city || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      setSearchParams({ keyword: keyword.trim(), city: city.trim() });
      setSelectedCafeId(null);
      setMapCenter(undefined);
    }
  };

  const handleCafeSelectFromList = (cafeId: string) => {
    setSelectedCafeId(cafeId);
    const cafe = cafes?.find((c) => c.id.toString() === cafeId);
    if (cafe) {
      setMapCenter({ lat: cafe.coordinates[0], lng: cafe.coordinates[1] });
    }
  };

  const handleCafeSelectFromMap = (cafeId: string) => {
    setSelectedCafeId(cafeId);
  };

  const showResults = searchParams !== null;
  const hasResults = cafes && cafes.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <img
              src="/assets/generated/cafe-hero.dim_1600x600.png"
              alt="Cafe Hero"
              className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg mb-8"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Your Perfect Cafe
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search for cozy cafes in your area and find your next favorite spot
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="bg-card rounded-2xl shadow-xl p-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="keyword" className="text-sm font-medium text-foreground block text-left">
                    Cafe Name or Keyword
                  </label>
                  <Input
                    id="keyword"
                    type="text"
                    placeholder="e.g., Coffee House, Espresso..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium text-foreground block text-left">
                    City or Area (Optional)
                  </label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Downtown, Brooklyn..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={!keyword.trim()}>
                  <Search className="mr-2 h-5 w-5" />
                  Search Cafes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              {isLoading && <LoadingState />}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
                  <p className="text-destructive font-medium">
                    Unable to load cafes. Please try again later.
                  </p>
                </div>
              )}

              {!isLoading && !error && !hasResults && (
                <EmptyState
                  keyword={searchParams.keyword}
                  city={searchParams.city}
                />
              )}

              {!isLoading && !error && hasResults && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      Found {cafes.length} {cafes.length === 1 ? 'cafe' : 'cafes'}
                    </h2>
                    <p className="text-muted-foreground">
                      Showing results for "{searchParams.keyword}"
                      {searchParams.city && ` in ${searchParams.city}`}
                    </p>
                  </div>

                  <Tabs defaultValue="list" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="list" className="gap-2">
                        <List className="h-4 w-4" />
                        List View
                      </TabsTrigger>
                      <TabsTrigger value="map" className="gap-2">
                        <Map className="h-4 w-4" />
                        Map View
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cafes.map((cafe) => (
                          <CafeCard
                            key={cafe.id.toString()}
                            cafe={cafe}
                            isSelected={selectedCafeId === cafe.id.toString()}
                            onSelect={handleCafeSelectFromList}
                          />
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="map" className="mt-0">
                      <div className="h-[600px]">
                        <CafeTileMap
                          cafes={cafes}
                          selectedCafeId={selectedCafeId}
                          onCafeSelect={handleCafeSelectFromMap}
                          centerOn={mapCenter}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
