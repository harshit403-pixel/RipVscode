"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "../lib/store";
import AuthBootstrap from "@/components/AuthBootstrap";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}

      {/* App-wide toast outlet (used by the axios rate-limit interceptor) */}
      <ToastContainer position="top-right" />
    </Provider>
  );
};

export default Providers;