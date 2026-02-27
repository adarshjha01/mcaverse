declare module 'react-latex-next' {
  import React from 'react';

  export interface LatexProps {
    children: string;
    strict?: boolean;
    macros?: Record<string, string>;
    delimiters?: Array<{
      left: string;
      right: string;
      display: boolean;
    }>;
  }

  export default function Latex(props: LatexProps): JSX.Element;
}