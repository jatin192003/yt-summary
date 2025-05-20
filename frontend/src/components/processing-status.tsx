"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusSteps = [
  "Extracting Video ID",
  "Generating Transcript",
  "Generating Summary",
  "Summary Ready",
  "Generating Notes",
  "Notes Ready",
  "Complete"
];

export function ProcessingStatus({ status }: { status: string }) {
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
            <motion.div 
              className="bg-violet-600 h-2.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${Math.max((currentStepIndex / (statusSteps.length - 1)) * 100, 5)}%` }}
              transition={{ duration: 0.5 }}
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