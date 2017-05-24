import { Meteor } from 'meteor/meteor';

// Products data. Initiate on startup.
if (Products.find().count() === 0) {
console.log('Loading Products data.');
  let products = [
      {
        name: 'Vetements',
        image: '/images/vetements.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Automobiles',
        image: '/images/voitures.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Moto',
        image: '/images/motos.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Telephones',
        image: '/images/telephones.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Animaux domestiques',
        image: '/images/animaux.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Immobilier',
        image: '/images/immobilier.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Ordinateurs',
        image: '/images/ordinateurs.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Meubles',
        image: '/images/meubles.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },

      {
        name: 'Electronique',
        image: '/images/electronic.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      },
      {
        name: 'Divers',
        image: '/images/divers.png',
        listingsCount: 0,
        productOffersCount: 0,
        productSoldCount: 0
      }      
  ];
  products.forEach(function(product){
    Products.insert(product);
  });

}


