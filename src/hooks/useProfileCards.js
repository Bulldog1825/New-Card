import { useCallback, useRef, useState } from 'react';

import { generateProfile } from '../utils/generateProfile';

// Holds the card list. Each card's profile is generated once, inside
// addCard(), and stored with it so it never changes afterwards.
export function useProfileCards() {
  const [cards, setCards] = useState([]);
  const counterRef = useRef(0); // only ever increases; numbers are never reused
  const lastFullNameRef = useRef(null);

  const addCard = useCallback(() => {
    counterRef.current += 1;
    const number = counterRef.current;
    const profile = generateProfile({ excludeFullName: lastFullNameRef.current });
    lastFullNameRef.current = profile.fullName;

    const card = { id: `card-${number}`, number, profile };
    setCards((prev) => [card, ...prev]);
  }, []);

  const removeCard = useCallback((id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  return { cards, addCard, removeCard };
}
