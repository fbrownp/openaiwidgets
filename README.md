# OpenAI Widgets

A collection of custom data visualization widgets built with React and TypeScript for integration with OpenAI's Apps SDK. This project provides interactive dashboard components for data analysis and visualization.

## Project Overview

This repository contains four custom widgets:

1. **Widget Reclamación Identifier** - Carousel widget for displaying observation identifiers with similarity matching
2. **Barplot** - Enhanced bar plot components including horizontal, box plots, and candlestick charts
3. **Indexing Dashboard** - Dashboard for displaying indexed data with filtering capabilities
4. **SNIFA Dashboard Faltas** - Dashboard for visualizing attendance violations with severity classification

Each widget is built as a standalone bundle (HTML, JS, CSS) that can be served independently and integrated into ChatGPT through OpenAI's Apps SDK.

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** version 18 or higher
- **pnpm** version 10.24.0 (recommended package manager)
  - Alternative: npm or yarn can be used, but pnpm is recommended
- **Git** for version control

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm@10.24.0
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd openaiwidgets
```

### 2. Install Dependencies

Install all project dependencies using pnpm:

```bash
pnpm install
```

This will install all dependencies defined in `package.json`, including:
- React 19 and React DOM
- Vite build tool
- TypeScript
- Tailwind CSS
- Chart libraries (recharts via custom components)
- OpenAI Apps SDK UI components

### 3. Install Pre-commit Hooks (Optional)

For code formatting consistency:

```bash
pre-commit install
```

## Building the Widgets

The widgets must be built before they can be used. The build process:
1. Bundles each widget with its CSS and dependencies
2. Generates hashed filenames for cache busting
3. Creates HTML entry points for each widget
4. Outputs all files to the `assets/` directory

### Build All Widgets

To build all widgets for production:

```bash
pnpm run build
```

This command:
- Runs the `build-all.mts` script
- Builds all 4 widgets: `barplot`, `indexing_dashboard`, `snifa_dashboard_faltas`, `widget_reclamacion_identifier`
- Creates versioned files in the `assets/` directory with hash suffixes (e.g., `barplot-a1b2.js`)
- Generates HTML files for each widget

### Build Output

After building, the `assets/` directory will contain:

```
assets/
├── barplot-<hash>.js
├── barplot-<hash>.css
├── barplot-<hash>.html
├── barplot.html (non-hashed version)
├── indexing_dashboard-<hash>.js
├── indexing_dashboard-<hash>.css
├── indexing_dashboard-<hash>.html
├── indexing_dashboard.html
├── snifa_dashboard_faltas-<hash>.js
├── snifa_dashboard_faltas-<hash>.css
├── snifa_dashboard_faltas-<hash>.html
├── snifa_dashboard_faltas.html
├── widget_reclamacion_identifier-<hash>.js
├── widget_reclamacion_identifier-<hash>.css
├── widget_reclamacion_identifier-<hash>.html
└── widget_reclamacion_identifier.html
```

### Environment Variables

You can customize the base URL for assets:

```bash
BASE_URL=https://your-domain.com pnpm run build
```

Default: `http://localhost:4444`

## Running the Project

### Serve Built Assets

After building, serve the static assets locally:

```bash
pnpm run serve
```

This command:
- Starts a static file server on port 4444
- Serves files from the `assets/` directory
- Enables CORS for local development
- Makes widgets accessible at `http://localhost:4444`

The server must be running for widgets to load properly in any application or testing environment.

### Development Mode

For active development with hot module replacement:

```bash
pnpm run dev
```

This command:
- Starts the Vite development server
- Enables hot module replacement (HMR)
- Watches for file changes and auto-reloads
- Useful for iterating on widget code

**Note:** In development mode, you may need to access specific widget entry points through the Vite dev server URLs.

### Host Development Mode

To develop with the host application:

```bash
pnpm run dev:host
```

This uses the `vite.host.config.mts` configuration for testing widgets in a host environment.

## Accessing Widgets

After building and serving, access widgets at:

- **Barplot**: http://localhost:4444/barplot.html
- **Indexing Dashboard**: http://localhost:4444/indexing_dashboard.html
- **SNIFA Dashboard**: http://localhost:4444/snifa_dashboard_faltas.html
- **Reclamación Identifier**: http://localhost:4444/widget_reclamacion_identifier.html

## Project Structure

```
openaiwidgets/
├── src/                              # Source code for all widgets
│   ├── barplot/                      # Bar plot widget components
│   │   ├── index.tsx                 # Entry point
│   │   ├── barplot.tsx               # Main component
│   │   ├── EnhancedBarplot.tsx       # Enhanced version
│   │   ├── HorizontalBarplot.tsx     # Horizontal layout
│   │   ├── BoxPlot.tsx               # Box plot component
│   │   ├── CandlestickChart.tsx      # Candlestick chart
│   │   ├── types.ts                  # TypeScript types
│   │   ├── gpt-types.ts              # GPT integration types
│   │   ├── gpt-adapter.ts            # Data adapter
│   │   └── barplot.css               # Styles
│   ├── indexing_dashboard/           # Indexing dashboard widget
│   │   ├── index.tsx
│   │   ├── IndexBarplot.tsx
│   │   ├── types.ts
│   │   └── ...
│   ├── snifa_dashboard_faltas/       # SNIFA violations dashboard
│   │   ├── index.tsx
│   │   ├── HorizontalStackedBarplot.tsx
│   │   ├── LineChart.tsx
│   │   ├── types.ts
│   │   └── ...
│   ├── widget_reclamacion_identifier/ # Observation identifier widget
│   │   ├── index.tsx
│   │   ├── ObservationCarousel.tsx
│   │   ├── ObservationCard.tsx
│   │   ├── types.ts
│   │   └── ...
│   ├── widget_styles/                # Shared widget styles
│   ├── index.css                     # Global styles
│   ├── types.ts                      # Shared TypeScript types
│   └── use-*.ts                      # React hooks for widget state
├── assets/                           # Built widget bundles (generated)
├── build-all.mts                     # Build orchestrator script
├── vite.config.mts                   # Vite configuration
├── vite.host.config.mts              # Host environment config
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Project dependencies and scripts
├── pnpm-lock.yaml                    # Locked dependency versions
└── README.md                         # This file
```

## Development Workflow

### Complete Development Cycle

1. **Install dependencies** (first time only):
   ```bash
   pnpm install
   ```

2. **Start development server** for live editing:
   ```bash
   pnpm run dev
   ```

3. **Build widgets** when ready to test:
   ```bash
   pnpm run build
   ```

4. **Serve built assets**:
   ```bash
   pnpm run serve
   ```

5. **Access widgets** in browser at `http://localhost:4444/<widget-name>.html`

### Making Changes to Widgets

1. Edit widget source files in `src/<widget-name>/`
2. Save your changes
3. If in dev mode, changes will hot-reload
4. If serving built assets, rebuild with `pnpm run build`

### Adding a New Widget

1. Create a new directory in `src/` (e.g., `src/my_new_widget/`)
2. Create an `index.tsx` entry point
3. Add the widget name to the `targets` array in `build-all.mts`
4. Build with `pnpm run build`
5. Access at `http://localhost:4444/my_new_widget.html`

## Widget Features

### Common Features Across All Widgets

- **Theme Support**: All widgets support light and dark themes
- **Responsive Design**: Adapts to different screen sizes
- **OpenAI Integration**: Built to work with OpenAI's Apps SDK
- **Interactive Visualizations**: Charts with hover states and tooltips
- **Data Filtering**: Most widgets include filtering capabilities

### Widget-Specific Features

#### Barplot Widget
- Multiple chart types: bar, horizontal bar, box plot, candlestick
- Dropdown filters for data dimensions
- Custom styling with theme support

#### Indexing Dashboard
- Index-based data visualization
- Multi-dimensional filtering
- Bar plot visualizations

#### SNIFA Dashboard Faltas
- Severity classification (Leves, Graves, Gravísimas)
- Two views: Overview and Detail
- Time series analysis
- Regional and categorical breakdowns
- Advanced filtering system

#### Reclamación Identifier Widget
- Carousel navigation
- Similarity matching (Similar/Identical)
- Document citation display
- Color-coded categorization
- Statistics dashboard

## TypeScript Compilation

Check TypeScript types without building:

```bash
# Check all TypeScript files
pnpm run tsc

# Check only app files
pnpm run tsc:app

# Check only node/config files
pnpm run tsc:node
```

## Testing Locally

Two test HTML files are provided for quick widget testing:

- `test-indexing.html` - Test the indexing dashboard widget
- `test-snifa.html` - Test the SNIFA dashboard widget

Open these files in a browser after building and serving the assets.

## Integrating with ChatGPT

To use these widgets in ChatGPT:

1. **Build the widgets**: `pnpm run build`
2. **Serve the assets**: `pnpm run serve`
3. **Expose locally** using a tool like [ngrok](https://ngrok.com/):
   ```bash
   ngrok http 4444
   ```
4. **Get the public URL** from ngrok (e.g., `https://abc123.ngrok-free.app`)
5. **Update BASE_URL** and rebuild:
   ```bash
   BASE_URL=https://abc123.ngrok-free.app pnpm run build
   ```
6. **Configure in ChatGPT**:
   - Enable developer mode in ChatGPT settings
   - Add your connector in Settings > Connectors
   - Use the ngrok URL to connect

## Troubleshooting

### Widgets Not Loading

1. Ensure assets are built: `pnpm run build`
2. Ensure server is running: `pnpm run serve`
3. Check that port 4444 is not in use by another process
4. Verify the BASE_URL matches your serving location

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```
2. Clear the assets directory:
   ```bash
   rm -rf assets
   pnpm run build
   ```

### CORS Issues

The serve command includes `--cors` flag. If you still have CORS issues:
- Ensure you're accessing from the correct origin
- Check browser console for specific CORS errors
- Verify the static server is running with CORS enabled

### Chrome Local Network Access (Version 142+)

If using Chrome 142+, you may need to disable the local network access flag:

1. Navigate to `chrome://flags/`
2. Find `#local-network-access-check`
3. Set it to **Disabled**
4. **Restart Chrome**

## Technologies Used

- **React 19** - UI framework
- **TypeScript 5.9** - Type-safe JavaScript
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **OpenAI Apps SDK UI** - OpenAI's official UI components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Embla Carousel** - Carousel functionality
- **Three.js & React Three Fiber** - 3D graphics (if needed)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows TypeScript best practices
2. All widgets build successfully
3. Changes are tested in both light and dark themes
4. Pre-commit hooks pass (if installed)

## Support

For issues or questions about:
- **Widget functionality**: Check individual widget README files in `src/<widget-name>/`
- **Build issues**: Review this README's Troubleshooting section
- **OpenAI Apps SDK**: Refer to [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
