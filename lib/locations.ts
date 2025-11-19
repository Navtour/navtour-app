export const BRAZILIAN_LOCATIONS = {
  states: [
    {
      id: 'ce',
      name: 'Ceará',
      uf: 'CE',
    },
    {
      id: 'rs',
      name: 'Rio Grande do Sul',
      uf: 'RS',
    },
  ],
  cities: [
    {
      id: 'fortaleza',
      name: 'Fortaleza',
      stateId: 'ce',
    },
    {
      id: 'juazeiro-do-norte',
      name: 'Juazeiro do Norte',
      stateId: 'ce',
    },
    {
      id: 'gramado',
      name: 'Gramado',
      stateId: 'rs',
    },
  ],
};

export type State = {
  id: string;
  name: string;
  uf: string;
};

export type City = {
  id: string;
  name: string;
  stateId: string;
};

// Funções auxiliares
export const getStates = (): State[] => {
  return BRAZILIAN_LOCATIONS.states;
};

export const getCitiesByState = (stateId: string): City[] => {
  return BRAZILIAN_LOCATIONS.cities.filter(city => city.stateId === stateId);
};

export const searchStates = (query: string): State[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  
  return BRAZILIAN_LOCATIONS.states.filter(state =>
    state.name.toLowerCase().includes(normalizedQuery) ||
    state.uf.toLowerCase().includes(normalizedQuery)
  );
};

export const searchCities = (query: string, stateId?: string): City[] => {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  
  let cities = BRAZILIAN_LOCATIONS.cities;
  
  if (stateId) {
    cities = cities.filter(city => city.stateId === stateId);
  }
  
  return cities.filter(city =>
    city.name.toLowerCase().includes(normalizedQuery)
  );
};

export const getStateById = (stateId: string): State | undefined => {
  return BRAZILIAN_LOCATIONS.states.find(state => state.id === stateId);
};

export const getStateByName = (stateName: string): State | undefined => {
  const normalized = stateName.toLowerCase().trim();
  return BRAZILIAN_LOCATIONS.states.find(state => 
    state.name.toLowerCase() === normalized ||
    state.uf.toLowerCase() === normalized
  );
};