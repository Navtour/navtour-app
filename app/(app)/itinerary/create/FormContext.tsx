import React, { createContext, useContext, useState, ReactNode } from 'react';
// @TODO: Mover este contexto para uma pasta compartilhada se for utilizado em mais lugares

type Accommodation = {
  id: string;
  isRelativeHouse: boolean;
  name?: string;
  address: string;
  instagram?: string;
  facebook?: string;
  checkInDate: string;
  checkInTime?: string;
  checkOutDate: string;
  checkOutTime?: string; 
};

type Step1Data = {
  state: string;
  city: string;
  arrivalDate: string;
  departureDate: string;
  accommodations: Accommodation[];
};

type Step2Data = {
  moods: string[];
  template: string;
};

type Step3Data = {
  name: string;
  description: string;
  backgroundImage: string | null;
};

type ItineraryFormData = {
  step1?: Step1Data;
  step2?: Step2Data;
  step3?: Step3Data;
};

type ItineraryContextType = {
  formData: ItineraryFormData;
  updateStep1: (data: Step1Data) => void;
  updateStep2: (data: Step2Data) => void;
  updateStep3: (data: Step3Data) => void;
  clearForm: () => void;
  getCompleteData: () => ItineraryFormData;
};

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export function ItineraryFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ItineraryFormData>({});

  const updateStep1 = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, step1: data }));
  };

  const updateStep2 = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, step2: data }));
  };

  const updateStep3 = (data: Step3Data) => {
    setFormData(prev => ({ ...prev, step3: data }));
  };

  const clearForm = () => {
    setFormData({});
  };

  const getCompleteData = () => {
    return formData;
  };

  return (
    <ItineraryContext.Provider
      value={{
        formData,
        updateStep1,
        updateStep2,
        updateStep3,
        clearForm,
        getCompleteData,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItineraryForm() {
  const context = useContext(ItineraryContext);
  if (!context) {
    throw new Error('useItineraryForm must be used within ItineraryFormProvider');
  }
  return context;
}