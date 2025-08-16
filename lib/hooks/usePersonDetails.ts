import { useState, useCallback } from 'react';
import { fetchPersonDetails } from '@/lib/apiService';

interface PersonDetails {
  id: number;
  name: string;
  biography?: string;
  birthday?: string;
  deathday?: string;
  place_of_birth?: string;
  profile_path?: string;
  [key: string]: any;
}

interface UsePersonDetailsReturn {
  selectedPerson: PersonDetails | null;
  showModal: boolean;
  handlePersonClick: (personData: any) => Promise<void>;
  closeModal: () => void;
}

export function usePersonDetails(): UsePersonDetailsReturn {
  const [selectedPerson, setSelectedPerson] = useState<PersonDetails | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePersonClick = useCallback(async (personData: any) => {
    try {
      const details = await fetchPersonDetails(personData.id);
      
      // Ensure both personData and details are objects before spreading
      const personObject = personData && typeof personData === 'object' ? personData : {};
      const detailsObject = details && typeof details === 'object' ? details : {};
      
      setSelectedPerson({ ...personObject, ...detailsObject });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching person details:", error);
    }
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedPerson(null);
  }, []);

  return {
    selectedPerson,
    showModal,
    handlePersonClick,
    closeModal
  };
}
