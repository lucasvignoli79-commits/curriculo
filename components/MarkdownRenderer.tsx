
import React from 'react';

// A simple utility to render markdown-like text without heavy dependencies
// Handles headers, bullets, bolding, and newlines.

interface Props {
  content: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-4 text-slate-800 leading-relaxed">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        
        // Headers
        if (trimmed.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-bold text-slate-900 mt-4 mb-2 border-b border-slate-200 pb-1">{trimmed.replace('### ', '')}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-bold text-blue-700 mt-6 mb-3 uppercase tracking-wide">{trimmed.replace('## ', '')}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-extrabold text-slate-900 mb-4">{trimmed.replace('# ', '')}</h1>;
        }

        // Standard bullet points (fallback if AI still outputs them)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const text = trimmed.substring(2);
            return (
                <div key={index} className="flex items-start ml-2 mb-1">
                    <span className="mr-2 text-blue-500 mt-1.5">•</span>
                    <span dangerouslySetInnerHTML={{ __html: formatBold(text) }} />
                </div>
            );
        }

        // Empty lines
        if (trimmed === '') {
          return <div key={index} className="h-1"></div>;
        }

        // Regular paragraphs - increased margin for cleaner look without bullets
        return (
          <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: formatBold(trimmed) }} />
        );
      })}
    </div>
  );
};

// Helper to replace **text** with <strong>text</strong>
function formatBold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default MarkdownRenderer;
