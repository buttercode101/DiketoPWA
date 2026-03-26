"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/src/components/ui/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6 bg-[#30221e] text-[#fdf8f6]">
          <div className="w-20 h-20 bg-[#f27696]/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-[#f27696]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold">Something went wrong</h1>
            <p className="text-[#bfa094] max-w-md">
              The savanna wind has shifted unexpectedly. We've encountered an error and are working to fix it.
            </p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-[#f27696] hover:bg-[#e94a74] text-white px-8 py-6 rounded-2xl flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Application
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-black/50 rounded-xl text-left text-xs overflow-auto max-w-full text-red-400">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
