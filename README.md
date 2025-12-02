# Customer.io Pipelines SDK Test Site

A React-based test application for the Customer.io Pipelines SDK (JavaScript). This tool allows support engineers and developers to test SDK integration, send identify/track calls, and monitor SDK activity in real-time.

## Features

- 🔑 **API Key Configuration**: Securely configure your Customer.io Write Key
- 🌍 **Region Support**: Select between US and EU regions
- 👤 **Identity Management**: Send identify calls with custom attributes
- 📊 **Event Tracking**: Track custom events with properties
- 🐛 **Debug Console**: Real-time monitoring of SDK activity and payloads
- 💾 **Persistence**: API key and region settings saved in localStorage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:aaronarich/v2.1-cio-toolbox.git
cd v2.1-cio-toolbox
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173/`

## Usage

### 1. Configure SDK

1. Enter your Customer.io Write Key (CDP API Key)
2. Select your region (US or EU)
3. Click "Connect SDK"
4. Wait for the "SDK initialized successfully" message

### 2. Identify Users

1. Enter a User ID and/or Email
2. (Optional) Add custom attributes using the "+ Add Attribute" button
3. Click "Send Identify Call"
4. View the payload in the Debug Console

### 3. Track Events

1. Enter an Event Name
2. (Optional) Add event properties using the "+ Add Property" button
3. Click "Send Track Call"
4. View the payload in the Debug Console

## Technical Details

### SDK Integration

The application uses the Customer.io Pipelines SDK with the following key features:

- **Dynamic Script Loading**: The SDK script is loaded dynamically based on the configured region
- **Write Key Handling**: Explicitly sets `window.analytics._writeKey` for proper SDK initialization
- **Region Support**: Supports both `cdp.customer.io` (US) and `cdp-eu.customer.io` (EU)

### Project Structure

```
src/
├── components/
│   ├── ConfigPanel.jsx      # API key and region configuration
│   ├── DebugConsole.jsx     # Real-time log viewer
│   ├── EventForm.jsx        # Event tracking form
│   └── IdentityForm.jsx     # User identification form
├── utils/
│   └── sdk.js               # Customer.io SDK integration
├── App.jsx                  # Main application component
└── index.css                # Global styles
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Sharing with Colleagues

This tool is designed to be shared with colleagues for testing Customer.io integrations:

1. Deploy the application to a hosting service (Vercel, Netlify, etc.)
2. Share the URL with your team
3. Each person can configure their own API key
4. Test identify and track calls independently

## Troubleshooting

### "Failed to load Write Key" Error

This error typically occurs when:
- The API key is invalid
- The wrong region is selected
- Network connectivity issues

**Solution**: Verify your API key in Customer.io under "Data & Integrations" > "Integrations" and ensure the correct region is selected.

### SDK Not Initializing

If the SDK doesn't initialize:
1. Check the browser console for errors
2. Verify the API key is correct
3. Try clearing localStorage and reconnecting
4. Ensure you're using a valid Customer.io Write Key (not a Site ID)

## License

This project is for internal use by Customer.io support engineers.

## Contributing

This is a support tool. For issues or feature requests, please contact the support engineering team.
