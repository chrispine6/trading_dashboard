# Trading Dashboard

A React-based trading dashboard that displays real-time clocks for Tokyo, London, and New York markets with countdown timers to market open.

![Trading Dashboard](https://github.com/user-attachments/assets/990046b5-32f6-45ff-adba-bef36f82f713)

## Features

- **Real-time Clocks**: Displays current time in Tokyo, London, and New York timezones
- **Market Status**: Shows whether each market is currently open or closed
- **Countdown Timers**: Displays time remaining until next market open
- **Dark Mode**: Sleek black-themed interface optimized for trading environments
- **Responsive Design**: Works on desktop and mobile devices
- **Visual Indicators**: Color-coded status indicators (green for open, red for closed)

## Market Hours

- **Tokyo Stock Exchange**: Opens at 9:00 AM JST
- **London Stock Exchange**: Opens at 8:00 AM GMT
- **New York Stock Exchange**: Opens at 9:30 AM EST

All markets are closed on weekends.

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Build

Build for production:

```bash
npm run build
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Technologies

- React 19
- Vite
- CSS3
- JavaScript ES6+

## License

MIT
