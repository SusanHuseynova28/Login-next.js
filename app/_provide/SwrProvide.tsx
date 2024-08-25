"use client";

import React from "react";
import { SWRConfig } from "swr";
import { defaultValues } from "../_swr/config";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={defaultValues}>{children}</SWRConfig>;
};
