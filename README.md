# unCAPTCHA
<a href="https://cla-assistant.io/Po2432/unCAPTCHA"><img src="https://cla-assistant.io/readme/badge/Po2432/unCAPTCHA" alt="CLA assistant" /></a> <img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/Po2432/unCAPTCHA/total?logo=github">  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/Po2432/unCAPTCHA?logo=github">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/Po2432/unCAPTCHA">  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-closed/Po2432/unCAPTCHA">
  <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/Po2432/unCAPTCHA">   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr-closed/Po2432/unCAPTCHA">

unCAPTCHA is a simple, client-side CAPTCHA widget for web pages. It provides a checkbox-based verification system with an image selection challenge to distinguish humans from bots. The widget supports light and dark themes, includes a popup mode for larger challenges, and features advanced bot detection in auto mode through tracking user interactions like mouse movement, clicking patterns, keyboard presses, and scrolling.
> [!CAUTION]
> This CAPTCHA is purely client side and is not safe for use on any active web page. We are not liable for any damage caused by using this CAPTCHA on any software open to public.

## Features

- **Checkbox Verification**: Users click "I'm not a robot" to initiate verification.
- **Image Challenge**: Select all images of a specific type (e.g., dogs or cats) from a grid.
- **Popup Mode**: Option to expand the challenge into a centred popup for better visibility.
- **Themes**: Light and dark mode support.
- **Modes**: 
  - Auto (default): Tracks user behavior (mouse movement for straightness and speed variance, rapid clicking, keyboard activity, scrolling) and assigns a score (0.0 = bot, 1.0 = human). Triggers the challenge if score <= 0.5.
  - Always: Always shows the challenge after clicking the checkbox.
- **Bot Detection**: In auto mode, monitors page-wide interactions to detect automated behavior, forcing challenges for suspicious activity.
- **Responsive**: Fits within a 302px width widget.

## Demo
You can try unCAPTCHA without any installation [here](https://po2432.github.io/unCAPTCHA/demo.html)
## Files

- `uncaptcha.js`: The main JavaScript file that creates and handles the widget, including bot scoring logic.
- `uncaptcha.css`: The stylesheet for styling the widget, animations, and bold/larger instruction text.

## Installation

Link directly to the raw files hosted on GitHub for integration.

- CSS: `https://po2432.github.io/unCAPTCHA/uncaptcha.css`
- JS: `https://po2432.github.io/unCAPTCHA/uncaptcha.js`
- Image: The logo automatically tries `https://raw.githubusercontent.com/Po2432/unCAPTCHA/main/uncaptcha.png` and falls back to local `uncaptcha.png` if it fails.

## Usage

### Basic Embedding

1. Include the CSS in the `<head>` of your HTML:

   ```html
   <link rel="stylesheet" href="https://po2432.github.io/unCAPTCHA/uncaptcha.css">
   ```

2. In the `<body>`, place the script tag where you want the widget to appear (it will insert the widget just before the script):

   ```html
   <script src="https://po2432.github.io/unCAPTCHA/uncaptcha.js"></script>
   ```

   The widget will render as a 302px-wide div with the checkbox, text, popup button, and logo.

### Attributes

You can customize the widget using data attributes on the `<script>` tag:

- `data-mode`: 
  - `"auto"` (default): Tracks user behavior and shows the challenge based on bot score (<=0.5 triggers challenge).
  - `"always"`: Always shows the challenge after clicking the checkbox.

- `data-theme`:
  - `"light"` (default): Light theme.
  - `"dark"`: Dark theme.

Example:

```html
<script src="https://po2432.github.io/unCAPTCHA/uncaptcha.js" data-mode="always" data-theme="dark"></script>
```

### How It Works

1. **Initial State**: Displays a checkbox with "I’m not a robot", a popup button (hidden initially), and a logo.
2. **Checkbox Click**: Triggers a loading spinner, then evaluates the bot score in auto mode or directly shows the challenge in always mode.
3. **Bot Scoring (Auto Mode)**: Analyzes recent mouse paths (straightness, speed variance), click frequency, keyboard presses, and scrolling. Low scores (bot-like) trigger the challenge; high scores pass verification.
4. **Challenge**: User must select all images of the specified type (e.g., all dogs). Incorrect selections fail the verification.
5. **Popup Button**: Appears after the challenge is triggered; clicking it moves the challenge to a centred popup (400px wide).
6. **Verification**: Clicking "Verify" checks selections. Success shows a green tick; failure shows a red cross and locks the widget.
7. **Reset**: On success or failure, the challenge hides, and the popup button disappears.


### Browser Support

Works in modern browsers supporting ES6, CSS Grid, and SVG.

### License
See LICENSE.md file.
