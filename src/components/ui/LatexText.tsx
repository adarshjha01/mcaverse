"use client";

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export const LatexText = ({ text }: { text: string }) => {
  if (!text) return null;
  return (
    <span className="latex-container">
      <Latex>{text}</Latex>
    </span>
  );
};