# Crypto Prices Application

## Introduction
This project consists of a backend server that fetches cryptocurrency prices from Live Coin Watch and stores them in a MongoDB database, and a frontend application built with React that displays these prices. The frontend includes a filterable and auto-updating table of cryptocurrency prices and an animated introduction screen.

## Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)
- MongoDB (v4 or higher)


## Project Structure
* /crypto-prices
** /backend # Backend server code
* * /frontend # Frontend React application
README.md # This file

## 1. Clone the Repository
```bash
git clone https://github.com/hsachin29/fomofactory-backend.git
```
#### Backend setup 
```bash
cd fomofactory-backend/backend 
npm install
npx tsc
node ./dist/index.js
```
#### Frontned setup 
```bash
cd fomofactory/frontend 
npm install
# if the above throws error, it will be because of react version (==18.0.0+). Use the commands below to install Material
npx tsc
npm start
```



```
|-- README.md
|-- backend
  |-- .env
  |-- package-lock.json
  |-- package.json
  |-- tsconfig.json
  |-- src
    |-- index.ts
|-- frontend
  |-- .gitignore
  |-- README.md
  |-- package-lock.json
  |-- package.json
  |-- tsconfig.json
  |-- public
    |-- favicon.ico
    |-- index.html
    |-- logo192.png
    |-- logo512.png
    |-- manifest.json
    |-- robots.txt
  |-- src
    |-- App.css
    |-- App.test.tsx
    |-- App.tsx
    |-- App_2.tsx
    |-- index.css
    |-- index.tsx
    |-- logo.svg
    |-- react-app-env.d.ts
    |-- reportWebVitals.ts
    |-- setupTests.ts

```
