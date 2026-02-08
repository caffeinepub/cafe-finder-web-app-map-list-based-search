import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface City {
    name: string;
}
export interface Area {
    city: City;
    name: string;
}
export interface Cafe {
    id: bigint;
    area: Area;
    city: City;
    name: string;
    address: string;
    coordinates: [number, number];
}
export interface backendInterface {
    addCafe(id: bigint, name: string, city: City, area: Area, address: string, coordinates: [number, number]): Promise<void>;
    getCafeById(id: bigint): Promise<Cafe>;
    listCafes(): Promise<Array<Cafe>>;
    searchCafes(keyword: string, city: string | null, area: string | null): Promise<Array<Cafe>>;
}
