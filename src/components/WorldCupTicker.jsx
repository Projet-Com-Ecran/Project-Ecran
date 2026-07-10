import React, { useState, useEffect } from 'react';
import { FACEBOOK_CONFIG } from '../config/facebookConfig';
import '../styles/WorldCupTicker.css';

/**
 * Bandeau permanent défilant en bas de l'écran, affichant les résultats
 * et matchs à venir de la Coupe du Monde (TheSportsDB), avec les drapeaux
 * des équipes. Défile horizontalement en boucle.
 */
export default function WorldCupTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const { API_KEY, LEAGUE_ID, REFRESH } = FACEBOOK_CONFIG.SPORTS;
    const base = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

    const mapEvent = (e, type) => ({
      id: e.idEvent,
      type, // 'result' (terminé) ou 'fixture' (à venir)
      home: e.strHomeTeam,
      away: e.strAwayTeam,
      homeBadge: e.strHomeTeamBadge,
      awayBadge: e.strAwayTeamBadge,
      homeScore: e.intHomeScore,
      awayScore: e.intAwayScore,
      homePen: e.intHomeScoreExtra,
      awayPen: e.intAwayScoreExtra,
      date: e.strTimestamp,
    });

    const fetchScores = async () => {
      try {
        const [pastRes, nextRes] = await Promise.all([
          fetch(`${base}/eventspastleague.php?id=${LEAGUE_ID}`).then((r) => r.json()),
          fetch(`${base}/eventsnextleague.php?id=${LEAGUE_ID}`).then((r) => r.json()),
        ]);

        const past = (pastRes.events || []).map((e) => mapEvent(e, 'result'));
        const next = (nextRes.events || []).map((e) => mapEvent(e, 'fixture'));

        setItems([...past, ...next]);
      } catch (err) {
        console.warn('Scores Coupe du Monde indisponibles:', err);
      }
    };

    fetchScores();
    const id = setInterval(fetchScores, REFRESH);
    return () => clearInterval(id);
  }, []);

  if (items.length === 0) return null;

  const formatFixture = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderItem = (item, key) => {
    const hasPen =
      item.homePen != null &&
      item.awayPen != null &&
      item.homePen !== '' &&
      item.awayPen !== '';

    return (
      <span className="ticker-match" key={key}>
        <span className="ticker-team">
          {item.homeBadge && <img src={item.homeBadge} alt="" className="ticker-badge" />}
          <span className="ticker-name">{item.home}</span>
        </span>

        {item.type === 'result' ? (
          <span className="ticker-score">
            {item.homeScore ?? 0}
            <span className="ticker-sep">-</span>
            {item.awayScore ?? 0}
            {hasPen && (
              <span className="ticker-pen">
                ({item.homePen}-{item.awayPen} t.a.b.)
              </span>
            )}
          </span>
        ) : (
          <span className="ticker-vs">
            <span className="ticker-vs-label">vs</span>
            <span className="ticker-date">{formatFixture(item.date)}</span>
          </span>
        )}

        <span className="ticker-team">
          <span className="ticker-name">{item.away}</span>
          {item.awayBadge && <img src={item.awayBadge} alt="" className="ticker-badge" />}
        </span>
        <span className="ticker-dot">•</span>
      </span>
    );
  };

  return (
    <div className="wc-ticker">
      <div className="ticker-title">
        <span className="ticker-ball">⚽</span>
        {FACEBOOK_CONFIG.SPORTS.TITLE}
      </div>
      <div className="ticker-viewport">
        {/* Doublé pour un défilement en boucle sans coupure */}
        <div className="ticker-track">
          {items.map((it, i) => renderItem(it, `a-${i}`))}
          {items.map((it, i) => renderItem(it, `b-${i}`))}
        </div>
      </div>
    </div>
  );
}
