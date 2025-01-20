'use client';

import { Terminal, Code2, CheckCircle, Command, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function Home() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[hsl(0,0%,13%)] to-black text-foreground">
      {/* Hero Section with Enhanced Design */}
      <div className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="flex flex-col items-center justify-center space-y-6 max-w-3xl mx-auto text-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Code2 className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Snipit for VSCode</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Boost your productivity with reusable code snippets. Save, organize, and reuse your code efficiently.
            </p>
            <div className="flex gap-4 mt-8">
              <a href="#installation" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </a>
           
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Improved Layout */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <nav className="space-y-1">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-3">Documentation</h3>
                {[
                  { href: '#installation', label: 'Installation', icon: Terminal },
                  { href: '#setup', label: 'Setup', icon: Command },
                  { href: '#usage', label: 'Usage Guide', icon: Code2 },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Documentation Content with Enhanced Styling */}
          <div className="lg:col-span-3 space-y-16 mr-8">
            {/* Installation Section */}
            <section id="installation" className="scroll-mt-16 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Terminal className="h-8 w-8 text-primary" />
                  Installation
                </h2>
                <p className="text-muted-foreground text-lg">Get started with Snipit in just a few steps.</p>
              </div>
              <div className="bg-card rounded-xl p-8 shadow-lg border border-border/100">
                <div className="prose prose-invert max-w-none">
                  <p className="text-card-foreground text-lg mb-6">
                    Install Snipit directly from VSCode's extension marketplace:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <kbd className="px-2 py-1.5 bg-accent rounded text-sm">F1</kbd>
                      <span>or</span>
                      <kbd className="px-2 py-1.5 bg-accent rounded text-sm">CMD + Shift + P</kbd>
                    </div>
                    <p>Type <code className="px-2 py-1 bg-primary/10 rounded text-primary">install</code></p>
                    <p>Select "Extensions: Install Extension:Snip-it"</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Setup Section */}
            <section id="setup" className="scroll-mt-16 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Command className="h-8 w-8 text-primary" />
                  Setup
                </h2>
                <p className="text-muted-foreground text-lg">Configure Snipit with your API key to get started.</p>
              </div>
              <div className="bg-card rounded-xl p-8 shadow-lg border border-border/100">
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold">Authentication</h3>
                  <ol className="space-y-6">
                    {[
                      {
                        text: <>Press <kbd className="px-2 py-1 bg-accent rounded text-sm">CMD + Shift + P</kbd> and type <code className="px-2 py-1 bg-primary/10 rounded text-primary">snip:auth</code></>,
                      },
                      {
                        text: 'Type your API Key and Press Enter',
                      },
                      {
                        text: 'Congratulations! You are now ready to use Snipit!',
                        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                      },
                    ].map((step, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        {step.icon ? (
                          <div className="flex-shrink-0 mt-1">{step.icon}</div>
                        ) : (
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                            {index + 1}
                          </span>
                        )}
                        <span className="text-lg">{step.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* Usage Section */}
            <section id="usage" className="scroll-mt-16 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Code2 className="h-8 w-8 text-primary" />
                  Usage Guide
                </h2>
                <p className="text-muted-foreground text-lg">Learn how to save and reuse your code snippets.</p>
              </div>
              
              {/* Push Snippet */}
              <div className="bg-card rounded-xl p-8 shadow-lg border border-border/100">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-primary/10">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </span>
                    Save a Snippet
                  </h3>
                  <ol className="space-y-6">
                    {[
                      'Select any part of code that you want to save',
                      <>Press <kbd className="px-2 py-1 bg-accent rounded text-sm">CMD + Shift + P</kbd> and type <code className="px-2 py-1 bg-primary/10 rounded text-primary">snip:push</code></>,
                      'Select a Name for your Snippet and Press Enter',
                      'Your snippet is now saved and ready to use!',
                    ].map((step, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="text-lg">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Pull Snippet */}
              <div className="bg-card rounded-xl p-8 shadow-lg border border-border/100">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-primary/10">
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </span>
                    Use a Snippet
                  </h3>
                  <ol className="space-y-6">
                    {[
                      <>Press <kbd className="px-2 py-1 bg-accent rounded text-sm">CMD + Shift + P</kbd> and type <code className="px-2 py-1 bg-primary/10 rounded text-primary">snip:pull</code></>,
                      'Select a Snippet from your collection',
                      'The code is now inserted at your cursor position!',
                    ].map((step, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                        <span className="text-lg">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}