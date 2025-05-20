"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    
    setLoading(true);
    setStatus("Starting");
    setSummary("");
    setNotes("");
    
    try {
      const eventSource = new EventSource(`http://localhost:8000/summaryandnotes/stream?url=${encodeURIComponent(url)}`);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setStatus(data.status);
        
        if (data.status === "Summary Ready" && data.data) {
          setSummary(data.data);
        }
        
        if (data.status === "Notes Ready" && data.data) {
          setNotes(data.data);
        }
        
        if (data.status === "Complete") {
          eventSource.close();
          setLoading(false);
          toast.success("Processing completed!");
        }
      };
      
      eventSource.onerror = () => {
        eventSource.close();
        setStatus("Error occurred");
        setLoading(false);
        toast.error("An error occurred during processing");
      };
    } catch (error) {
      setLoading(false);
      toast.error("Failed to connect to the server");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2 py-10">
            <h1 className="text-4xl font-extrabold tracking-tight">YouTube Summary and Notes</h1>
            <p className="text-slate-400">Get AI-generated summaries and notes from any YouTube video</p>
          </div>
          
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle>Enter YouTube URL</CardTitle>
              <CardDescription>Paste the URL of the YouTube video you want to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <Input 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-50"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-violet-700 hover:bg-violet-600 transition-colors"
                >
                  {loading ? "Processing..." : "Generate"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {loading && (
            <ProcessingStatus status={status} />
          )}
          
          {(summary || notes) && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle>Video Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownContent content={summary} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notes">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle>Video Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownContent content={notes} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <Toaster />
    </main>
  );
}

function ProcessingStatus({ status }: { status: string }) {
  const statusSteps = [
    "Extracting Video ID",
    "Generating Transcript",
    "Generating Summary",
    "Summary Ready",
    "Generating Notes",
    "Notes Ready",
    "Complete"
  ];
  
  const currentStepIndex = statusSteps.indexOf(status);

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-violet-500 animate-pulse"></div>
          Processing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-slate-400">Current step: <span className="text-violet-400 font-semibold">{status}</span></p>
          
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div 
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.max((currentStepIndex / (statusSteps.length - 1)) * 100, 5)}%` }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {statusSteps.map((step, index) => (
              <div 
                key={step}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  index <= currentStepIndex 
                    ? "bg-slate-800 text-slate-50" 
                    : "bg-slate-950 text-slate-500"
                }`}
              >
                <div 
                  className={`h-2 w-2 rounded-full ${
                    index < currentStepIndex 
                      ? "bg-green-500" 
                      : index === currentStepIndex 
                        ? "bg-violet-500 animate-pulse" 
                        : "bg-slate-700"
                  }`}
                />
                <span className="text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MarkdownContent({ content }: { content: string }) {
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
