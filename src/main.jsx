import React from "react";
import ReactDOM from "react-dom/client"; // React 18では "react-dom/client" を使用
import App from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root")); // createRootを使用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
