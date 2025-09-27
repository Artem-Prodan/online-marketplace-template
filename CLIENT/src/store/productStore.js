import { makeAutoObservable } from "mobx";

export default class ProductStore {
  constructor() {
    this._types = [
      { id: 1, name: "Sweaters" },
      { id: 2, name: "Hoodies" },
      { id: 3, name: "T-shirts" },
      { id: 4, name: "Jeans" },
      { id: 5, name: "Belts" },
    ];
    this._brands = [
      { id: 1, name: "H&M" },
      { id: 2, name: "Cropp" },
      { id: 3, name: "Guess" },
      { id: 4, name: "Levi's" },
      { id: 5, name: "Calvin Klein" },
      
    ];
    this._products = [
      {
        id: 1,
        name: "Straight Leg",
        brand: "Levi's",
        type: "Jeans",
        price: 119,
        rating: 5,
        img: "C:\\Users\\PC\\Desktop\\SoftwareEng\\buying_selling_market\\Server\\static\\f64280c1-128c-47ce-9297-e2153cd83cf0.jpg",
      },
      {
        id: 2,
        name: "Unplugged",
        brand: "H&M",
        type: "Sweater",
        price: 34,
        rating: 4,
        img: "C:\\Users\\PC\\Desktop\\SoftwareEng\\buying_selling_market\\Server\\static\\d1b4a0e1-cea3-4e5b-af8f-50a63484708a.jpg",
      },
      {
        id: 3,
        name: "Tshirt Basic",
        brand: "Calvin Klein",
        type: "T-shirt",
        price: 59,
        rating: 4,
        img: "C:\\Users\\PC\\Desktop\\SoftwareEng\\buying_selling_market\\Server\\static\\6833ae5c-4f0c-434c-ba78-08387e3d7759.jpg",
      },
      
    ];

    this._selectedType = {}
    this._selectedBrand = {}

    makeAutoObservable(this);
  }

  setTypes(types) {
    this._types = types;
  }
  setBrands(brands) {
    this._brands = brands;
  }
  setProducts(products) {
    this._products = products;
  }

  setSelectedType(type) {
    this._selectedType = type;
  }
  setSelectedBrand(brand) {
    this._selectedBrand = brand;
  }

  get types() {
    return this._types;
  }
  get brands() {
    return this._brands;
  }
  get products() {
    return this._products;
  }
  get selectedType() {
    return this._selectedType;
  }
  get selectedBrand() {
    return this._selectedBrand;
  }
}
