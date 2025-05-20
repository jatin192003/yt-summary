"use client";

import ReactMarkdown from "react-markdown";

export function MarkdownContent({ content }: { content: string }) {
  if (!content) return <div className="text-slate-500 italic">No content available yet...</div>;
  
  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-5 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="my-3" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-3" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-3" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-violet-500 pl-4 my-3 text-slate-400" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-slate-800 p-1 rounded text-violet-300" {...props} />
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-slate-800 p-3 rounded my-3 overflow-x-auto" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}