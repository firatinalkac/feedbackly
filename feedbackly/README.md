# FeedbackLy

FeedbackLy is a web component toolkit designed to help gather quick and efficient feedback from users.

## Getting Started

This section contains information on how to integrate FeedbackLy components into your project.

### Setup

Setup the FeedbackLy components using NPM or Yarn:

```bash
npm install feedback-ly --save
# or
yarn add feedback-ly
```

#### CDN
```bash
https://unpkg.com/feedback-ly@1.0.0/dist/feedback-ly@1.0.0.mjs
```

### Props

Include the FeedbackLy component on your page:

```html
position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' (default: 'bottom-right')
icon-size: String (default: '24')
icon-color: String (default: '#f27a1a')
disabled: Boolean (default: false)
minlength: String (default: '10')
maxlength: String (default: '2000')
customer-id: String -required
full-name: String -required
```

### Usage

Include the FeedbackLy component on your page:

```html
import 'feedbackly';

<feedback-ly position="bottom-right" customer-id="customerId" full-name="fullName"></feedback-ly>
```

## Development

Steps to run and develop the project locally:

1. Install dependencies:

```bash
npm install
```

2. Start the project:

```bash
npm start
```

## Technologies Used

- [Lit](https://lit.dev/)
- [Scss](https://www.mongodb.com/)
- [Vite](https://vitejs.dev/)
- [@open-wc/testing](https://open-wc.org/)
- [Typescript](https://www.typescriptlang.org/)

---

