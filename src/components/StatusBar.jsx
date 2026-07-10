import React, { useState, useEffect } from 'react';
import { FACEBOOK_CONFIG } from '../config/facebookConfig';
import '../styles/StatusBar.css';

// Correspondance code météo WMO → icône + libellé (Open-Meteo).
const WEATHER_CODES = {
  0: { icon: '☀️', label: 'Ensoleillé' },
  1: { icon: '🌤️', label: 'Peu nuageux' },
  2: { icon: '⛅', label: 'Partiellement nuageux' },
  3: { icon: '☁️', label: 'Couvert' },
  45: { icon: '🌫️', label: 'Brouillard' },
  48: { icon: '🌫️', label: 'Brouillard givrant' },
  51: { icon: '🌦️', label: 'Bruine légère' },
  53: { icon: '🌦️', label: 'Bruine' },
  55: { icon: '🌦️', label: 'Bruine dense' },
  61: { icon: '🌧️', label: 'Pluie légère' },
  63: { icon: '🌧️', label: 'Pluie' },
  65: { icon: '🌧️', label: 'Forte pluie' },
  71: { icon: '🌨️', label: 'Neige légère' },
  73: { icon: '🌨️', label: 'Neige' },
  75: { icon: '🌨️', label: 'Forte neige' },
  80: { icon: '🌦️', label: 'Averses' },
  81: { icon: '🌧️', label: 'Averses' },
  82: { icon: '⛈️', label: 'Fortes averses' },
  95: { icon: '⛈️', label: 'Orage' },
  96: { icon: '⛈️', label: 'Orage grêleux' },
  99: { icon: '⛈️', label: 'Orage grêleux' },
};

export default function StatusBar() {
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState(null);

  // Horloge : mise à jour chaque seconde.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Météo : récupération puis rafraîchissement périodique.
  useEffect(() => {
    const { LATITUDE, LONGITUDE, REFRESH } = FACEBOOK_CONFIG.WEATHER;

    const fetchWeather = async () => {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}` +
          `&longitude=${LONGITUDE}&current=temperature_2m,weather_code`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            code: data.current.weather_code,
          });
        }
      } catch (e) {
        console.warn('Météo indisponible:', e);
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, REFRESH);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const w = weather ? WEATHER_CODES[weather.code] || { icon: '🌡️', label: '' } : null;

  return (
    <div className="status-bar">
      <div className="status-clock">
        <span className="status-time">{time}</span>
        <span className="status-date">{date}</span>
      </div>

      {weather && (
        <div className="status-weather" title={w.label}>
          <span className="status-weather-icon">{w.icon}</span>
          <span className="status-temp">{weather.temp}°C</span>
          <span className="status-city">{FACEBOOK_CONFIG.WEATHER.CITY}</span>
        </div>
      )}
    </div>
  );
}
