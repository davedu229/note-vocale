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
                        <h1 className="text-xl font-semibold text-text-primary mb-3 mt-4 first:mt-0">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-lg font-semibold text-text-primary mb-2 mt-4 first:mt-0">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-base font-medium text-text-primary mb-2 mt-3 first:mt-0">
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-sm font-medium text-text-secondary mb-1.5 mt-2">
                            {children}
                        </h4>
                    ),

                    // Paragraphs
                    p: ({ children }) => (
                        <p className="text-text-secondary font-light leading-relaxed mb-3 last:mb-0">
                            {children}
                        </p>
                    ),

                    // Bold
                    strong: ({ children }) => (
                        <strong className="font-semibold text-text-primary">
                            {children}
                        </strong>
                    ),

                    // Italic
                    em: ({ children }) => (
                        <em className="italic text-text-secondary">
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
                        <li className="text-text-secondary font-light flex items-start gap-2">
                            <span className="text-primary mt-1.5 text-xs">•</span>
                            <span className="flex-1">{children}</span>
                        </li>
                    ),

                    // Blockquote
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-primary/50 pl-4 py-1 my-3 bg-primary/5 rounded-r-lg">
                            <div className="text-text-secondary italic">{children}</div>
                        </blockquote>
                    ),

                    // Code
                    code: ({ children, inline }) =>
                        inline ? (
                            <code className="px-1.5 py-0.5 bg-surface-elevated rounded text-primary text-sm font-mono">
                                {children}
                            </code>
                        ) : (
                            <code className="block p-3 bg-surface-elevated rounded-lg text-text-primary text-sm font-mono my-2 overflow-x-auto">
                                {children}
                            </code>
                        ),

                    // Horizontal rule
                    hr: () => (
                        <hr className="border-border my-4" />
                    ),

                    // Links
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
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
