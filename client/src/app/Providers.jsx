"use client";

import { Provider } from "react-redux";
import store from "../lib/store";
import AuthBootstrap from "@/components/AuthBootstrap";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthBootstrap />
      {children}
    </Provider>
  );
};

export default Providers;