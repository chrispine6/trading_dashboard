import { useState, useEffect } from 'react';
import './TradingDashboard.css';

// Market open times in local time zones
const markets = {
  tokyo: {
    name: 'Tokyo',
    timezone: 'Asia/Tokyo',
    openHour: 9,
    openMinute: 0,
    closeHour: 15,
    closeMinute: 0,
  },
  london: {
    name: 'London',
    timezone: 'Europe/London',
    openHour: 8,
    openMinute: 0,
    closeHour: 16,
    closeMinute: 30,
  },
  newYork: {
    name: 'New York',
    timezone: 'America/New_York',
    openHour: 9,
    openMinute: 30,
    closeHour: 16,
    closeMinute: 0,
  },
};

const formatTime = (date, timezone) => {
  return date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

const formatDate = (date, timezone) => {
  return date.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const getTimeInTimezone = (currentTime, timezone) => {
  // Create a formatter for the timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(currentTime);
  const get = (type) => parts.find(p => p.type === type).value;
  
  return new Date(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second')
  );
};

const getNextMarketOpen = (currentTime, market) => {
  const marketTime = getTimeInTimezone(currentTime, market.timezone);
  const nextOpen = new Date(marketTime);
  
  // Set to market open time today
  nextOpen.setHours(market.openHour, market.openMinute, 0, 0);

  // If market already opened today, set to tomorrow
  if (marketTime >= nextOpen) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }

  // Skip weekends for all markets
  // Keep adding days until we reach a weekday
  while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }

  return nextOpen;
};

const isMarketOpen = (currentTime, market) => {
  const marketTime = getTimeInTimezone(currentTime, market.timezone);
  const dayOfWeek = marketTime.getDay();
  
  // Markets closed on weekends
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  const currentHour = marketTime.getHours();
  const currentMinute = marketTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const openTotalMinutes = market.openHour * 60 + market.openMinute;
  const closeTotalMinutes = market.closeHour * 60 + market.closeMinute;

  return currentTotalMinutes >= openTotalMinutes && currentTotalMinutes < closeTotalMinutes;
};

const getCountdown = (currentTime, market) => {
  if (isMarketOpen(currentTime, market)) {
    return 'MARKET OPEN';
  }

  const nextOpen = getNextMarketOpen(currentTime, market);
  const marketTimeNow = getTimeInTimezone(currentTime, market.timezone);
  
  const diff = nextOpen - marketTimeNow;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours < 0 || minutes < 0 || seconds < 0) {
    return 'Calculating...';
  }

  return `${hours}h ${minutes}m ${seconds}s`;
};

const MarketCard = ({ marketKey, currentTime }) => {
  const market = markets[marketKey];
  const time = formatTime(currentTime, market.timezone);
  const date = formatDate(currentTime, market.timezone);
  const countdown = getCountdown(currentTime, market);
  const isOpen = isMarketOpen(currentTime, market);

  return (
    <div className="market-card">
      <h2 className="market-name">{market.name}</h2>
      <div className="clock-display">
        <div className="time">{time}</div>
        <div className="date">{date}</div>
      </div>
      <div className={`countdown ${isOpen ? 'market-open' : 'market-closed'}`}>
        <div className="countdown-label">
          {isOpen ? 'STATUS' : 'OPENS IN'}
        </div>
        <div className="countdown-value">{countdown}</div>
      </div>
      <div className={`status-indicator ${isOpen ? 'open' : 'closed'}`}></div>
    </div>
  );
};

function TradingDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="trading-dashboard">
      <header className="dashboard-header">
        <h1>Trading Dashboard</h1>
        <div className="local-time">
          Local Time: {currentTime.toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </header>
      <div className="markets-grid">
        <MarketCard marketKey="tokyo" currentTime={currentTime} />
        <MarketCard marketKey="london" currentTime={currentTime} />
        <MarketCard marketKey="newYork" currentTime={currentTime} />
      </div>
    </div>
  );
}

export default TradingDashboard;
