import React, { useRef, useEffect, useState } from 'react';

/**
 * Affiche un texte dans sa totalité.
 * S'il dépasse la hauteur disponible, il défile verticalement en douceur
 * (aller-retour continu) pour être entièrement lisible — au lieu d'être
 * tronqué. La vitesse s'adapte à la longueur du texte.
 */
export default function ScrollingText({ text, active }) {
  const boxRef = useRef(null);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    if (!active) {
      setScroll(0);
      return;
    }
    // Laisser le navigateur calculer la mise en page avant de mesurer.
    const t = setTimeout(() => {
      const el = boxRef.current;
      if (!el) return;
      const overflow = el.scrollHeight - el.clientHeight;
      setScroll(overflow > 6 ? overflow : 0);
    }, 120);
    return () => clearTimeout(t);
  }, [active, text]);

  // Durée proportionnelle à la hauteur à parcourir : plus le texte est long,
  // plus la durée est grande → vitesse de défilement lente et lisible
  // (~12 px/s). Bornée entre 18 s et 70 s.
  const duration = Math.max(18, Math.min(scroll / 12, 70));

  return (
    <div className={scroll ? 'scroll-box has-scroll' : 'scroll-box'} ref={boxRef}>
      <div
        dir="auto"
        className={scroll ? 'scroll-inner scrolling' : 'scroll-inner'}
        style={
          scroll
            ? { '--scroll': `-${scroll}px`, '--dur': `${duration}s` }
            : undefined
        }
      >
        {text}
      </div>
    </div>
  );
}
