import React from 'react';
import ReactMarkdown from 'react-markdown';

// Custom component for rendering markdown with nice styling
const MarkdownRenderer = ({ content, className = '' }) => {
    if (!content) return null;

    return (
        <div className={`markdown-content ${className}`}>
            <ReactMarkdown
                components={{
                    // Headings
                    h1: ({ children }) => (
                        <h1 className="text-xl font-semibold text-white mb-3 mt-4 first:mt-0">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-white mb-2 mt-4 first:mt-0">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-medium text-white/90 mb-2 mt-3 first:mt-0">
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-sm font-medium text-white/85 mb-1.5 mt-2">
                            {children}
                        </h4>
                    ),

                    // Paragraphs
                    p: ({ children }) => (
                        <p className="text-white/75 font-light leading-relaxed mb-3 last:mb-0">
                            {children}
                        </p>
                    ),

                    // Bold
                    strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                            {children}
                        </strong>
                    ),

                    // Italic
                    em: ({ children }) => (
                        <em className="italic text-white/70">
                            {children}
                        </em>
                    ),

                    // Lists
                    ul: ({ children }) => (
                        <ul className="space-y-1.5 mb-3 ml-1">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="space-y-1.5 mb-3 ml-1 list-decimal list-inside">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="text-white/75 font-light flex items-start gap-2">
                            <span className="text-primary-light mt-1.5 text-xs">•</span>
                            <span className="flex-1">{children}</span>
                        </li>
                    ),

                    // Blockquote
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-primary/50 pl-4 py-1 my-3 bg-primary/5 rounded-r-lg">
                            <div className="text-white/70 italic">{children}</div>
                        </blockquote>
                    ),

                    // Code
                    code: ({ children, inline }) =>
                        inline ? (
                            <code className="px-1.5 py-0.5 bg-white/10 rounded text-accent text-sm font-mono">
                                {children}
                            </code>
                        ) : (
                            <code className="block p-3 bg-white/5 rounded-lg text-white/80 text-sm font-mono my-2 overflow-x-auto">
                                {children}
                            </code>
                        ),

                    // Horizontal rule
                    hr: () => (
                        <hr className="border-white/10 my-4" />
                    ),

                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-light hover:underline"
                        >
                            {children}
                        </a>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
