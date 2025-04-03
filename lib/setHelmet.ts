// components/SetTitle.tsx
"use client";

import { useEffect } from "react";

interface SetTitleProps {
  pageTitle: string;
}

export const SetTitle = ({ pageTitle }: SetTitleProps) => {
  useEffect(() => {
    document.title = pageTitle + " | Edvance";
  }, [pageTitle]);

  return null;
};
