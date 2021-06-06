# Lunar Capsule
A simple, lightweight and fast server framework for the [Gemini Protocol](https://gemini.circumlunar.space/) written in TypeScript.

! This project is still in early development. Use with caution !

### Why use this library?
 - An easy and intuitive to use api.
 - No dependencies.
 - Strong typed.
 
### Features
 - Response chunking
 - Asynchronous
 - Virtual hosting

## Installation
Simply install the `lunar-capsule` package with  *npm* or *yarn*.

```
npm install lunar-capsule
```

## Usage
```typescript
import { createApp } from 'lunar-capsule';

const app = createApp();

app.router.endpoint({ path: '/' }, (req, res) => {
  res.succeed('text/gemini')
    .sendString('# Hello world!')
    .close();
});

app.listen({
  cert: fs.readFileSync('CERT FILE').toString(),
  key: fs.readFileSync('PRIVATE KEY FILE').toString(),
});
```

## Contributing
### TODO
 - Add middleware support
 - Testing
 - Code documentation
 - Child routes path doenst work
