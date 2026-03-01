"use client";

import Latex from 'react-latex-next';

export const LatexText = ({ text }: { text: string }) => {
  if (!text) return null;

  // 1. Clean basic string artifacts
  let processedText = text.replace(/\\n/g, '\n');
  
  // 2. Fix Plain TeX newlines
  processedText = processedText.replace(/\\cr/g, '\\\\');

  // 3. Smart Parser: Convert \matrix{...} to \begin{matrix}...\end{matrix}
  const fixMatrix = (str: string) => {
    let result = str;
    while (result.includes('\\matrix{')) {
      const startIndex = result.indexOf('\\matrix{');
      let braceCount = 1;
      let i = startIndex + 8; // Move past '\matrix{'
      
      while (i < result.length && braceCount > 0) {
        if (result[i] === '{') braceCount++;
        if (result[i] === '}') braceCount--;
        i++;
      }
      
      if (braceCount === 0) {
        result = 
          result.substring(0, startIndex) + 
          '\\begin{matrix}' + 
          result.substring(startIndex + 8, i - 1) + 
          '\\end{matrix}' + 
          result.substring(i);
      } else {
        break;
      }
    }
    return result;
  };

  processedText = fixMatrix(processedText);

  return (
    <span className="latex-content">
      <Latex 
        strict={false}
        macros={{
          "\\R": "\\mathbb{R}",
          "\\N": "\\mathbb{N}",
          "\\Z": "\\mathbb{Z}" 
        }}
        delimiters={[
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
        ]}
      >
        {processedText}
      </Latex>
    </span>
  );
};