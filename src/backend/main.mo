import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  // Core types
  type City = { name : Text };

  type Area = {
    name : Text;
    city : City;
  };

  type Cafe = {
    id : Nat;
    name : Text;
    city : City;
    area : Area;
    address : Text;
    coordinates : (Float, Float); // (latitude, longitude)
  };

  // Storage
  let cafeMap = Map.empty<Nat, Cafe>();

  // Comparision modules
  module Cafe {
    public func compare(cafe1 : Cafe, cafe2 : Cafe) : Order.Order {
      Text.compare(cafe1.name, cafe2.name);
    };
  };

  public shared ({ caller }) func addCafe(id : Nat, name : Text, city : City, area : Area, address : Text, coordinates : (Float, Float)) : async () {
    if (cafeMap.containsKey(id)) {
      Runtime.trap("Cafe with this ID already exists");
    };

    let newCafe : Cafe = {
      id;
      name;
      city;
      area;
      address;
      coordinates;
    };

    cafeMap.add(id, newCafe);
  };

  // Returns all cafes as array
  public query ({ caller }) func listCafes() : async [Cafe] {
    cafeMap.values().toArray();
  };

  // Returns array of cafes matching name/city/area criteria
  public query ({ caller }) func searchCafes(keyword : Text, city : ?Text, area : ?Text) : async [Cafe] {
    let resultsList = List.empty<Cafe>();

    let keywordIsEmpty = keyword.size() == 0;

    for (cafe in cafeMap.values()) {
      let cafeMatchesKeyword = keywordIsEmpty or cafe.name.toLower().contains(#text(keyword.toLower()));
      let cafeMatchesCity = switch (city) {
        case (?cityText) {
          cafe.city.name.toLower().contains(#text(cityText.toLower()));
        };
        case (null) { true };
      };

      let cafeMatchesArea = switch (area) {
        case (?areaText) {
          cafe.area.name.toLower().contains(#text(areaText.toLower()));
        };
        case (null) { true };
      };

      // Only add cafe if all filters match
      if (cafeMatchesKeyword and cafeMatchesCity and cafeMatchesArea) {
        resultsList.add(cafe);
      };
    };

    resultsList.toArray().sort(); // sort by name
  };

  // Returns a single cafe by ID
  public query ({ caller }) func getCafeById(id : Nat) : async Cafe {
    switch (cafeMap.get(id)) {
      case (?cafe) { cafe };
      case (null) { Runtime.trap("Cafe not found") };
    };
  };
};

