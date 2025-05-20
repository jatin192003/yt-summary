"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ProcessingStatus } from "@/components/processing-status";
import { MarkdownContent } from "@/components/markdown-content";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
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
            <h1 className="text-4xl font-extrabold tracking-tight">YouTube Chat Summary</h1>
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
          
          {loading && <ProcessingStatus status={status} />}
          
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