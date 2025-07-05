# ChronoVerse 🌌

> Where Every Day Births a Universe of Discovery

ChronoVerse is a web-based immersive astronomical journey and intelligent space-time simulator. Navigate celestial events across time, view planetary positions, track satellites, explore constellations, and access educational space content with AI-powered guidance.

## 🚀 Features

### Core Features
- **🕰️ Timeline Explorer** - Journey through space history with interactive timeline
- **🌕 Lunar Phases Visualizer** - Real-time moon phase simulation
- **🌌 Cosmic Gallery** - Hubble/James Webb image viewer with NASA API integration
- **✨ Constellation Explorer** - Interactive 3D sky map with mythology
- **🪐 Planetary Positions** - Live and historical data from JPL Horizons
- **🎮 Mission Simulator** - Command real space missions
- **👨‍🚀 Astronaut Training** - Gamified learning modules
- **📅 Moon on My Day** - Personal space history for any date
- **🛰️ Satellite Live Tracker** - Real-time satellite positions
- **🔭 Mystery Mode** - Explore unsolved cosmic phenomena
- **📡 Space News Portal** - Latest updates from space agencies
- **💬 Nova AI Assistant** - Voice-enabled space guide
- **📖 Cosmic Journals** - Personal space exploration diary
- **🎤 Voice Control** - Navigate with voice commands
- **🌍 Multi-language Support** - 15 languages
- **♿ Accessibility** - Screen reader compatible

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, GLSL Shaders
- **Styling**: Tailwind CSS, Framer Motion, GSAP
- **AI/Chat**: LangChain, GrokCloud API
- **Database**: PostgreSQL, Prisma ORM
- **APIs**: NASA, Space-Track, JPL Horizons, CelesTrak
- **Real-time**: WebSockets
- **Audio**: Tone.js
- **State**: Zustand
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chronoverse.git
cd chronoverse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:
- NASA API Key (provided)
- GrokCloud API Key (provided)
- Database URL
- Other service credentials

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see ChronoVerse in action!

## 🎮 Usage

### Voice Commands
- "Navigate to missions" - Opens mission simulator
- "Show me the moon" - Opens lunar phase viewer
- "Search for Apollo 11" - Searches for specific events
- "Go to timeline" - Opens the event timeline
- "Nova, tell me about Mars" - Ask the AI assistant

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Open search
- `Space` - Pause/Play animations
- `Arrow Keys` - Navigate timeline
- `Esc` - Close modals

## 🏗️ Project Structure

```
chronoverse/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── ui/          # UI components
│   │   ├── 3d/          # Three.js components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   ├── services/        # API services
│   └── types/           # TypeScript types
├── public/              # Static assets
├── prisma/              # Database schema
└── config/              # Configuration files
```

## 🔧 Development

### Adding New Features
1. Create component in appropriate directory
2. Add types to `src/types/`
3. Update contexts if needed
4. Add API routes in `src/app/api/`

### Database Changes
```bash
npx prisma migrate dev --name your-migration-name
```

### Testing
```bash
npm run test
npm run test:e2e
```

## 📱 PWA Features

ChronoVerse is a Progressive Web App with:
- Offline functionality
- Install to home screen
- Push notifications
- Background sync

## 🌍 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```bash
docker build -t chronoverse .
docker run -p 3000:3000 chronoverse
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for open APIs and imagery
- Space agencies worldwide
- Three.js community
- Open source contributors

## 📞 Support

- Documentation: [docs.chronoverse.space](https://docs.chronoverse.space)
- Issues: [GitHub Issues](https://github.com/yourusername/chronoverse/issues)
- Email: support@chronoverse.space

---

Built with ❤️ for space enthusiasts everywhere 🚀