// jest.setup.js
global.window = {
    location: {
      pathname: "/example.html",
    },
  };
  
  // Créez un objet document factice pour les tests
  global.document = {
    querySelector: () => null, // Définissez ici les méthodes dont vous avez besoin pour vos tests
  };
  