'use client'

import { useMemo, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { ArrowRight, Clock3, LifeBuoy, Mail, MessageSquareText, Send, Sparkles, TriangleAlert } from 'lucide-react'

const supportChannels = [
  {
    title: 'Fast response',
    description: 'Get a reply within 24 hours for standard questions and account help.',
    icon: Clock3,
  },
  {
    title: 'Direct support',
    description: 'Ask about workspaces, repo setup, pricing, or BrowserBase test runs.',
    icon: LifeBuoy,
  },
  {
    title: 'Email follow-up',
    description: 'Keep everything documented and easy to track with a clear email thread.',
    icon: Mail,
  },
]

const supportFaq = [
  {
    question: 'How do I connect my GitHub account?',
    answer: 'Use the workspace header or the add repo flow in the workspace. After OAuth is complete, you can select repositories from the portal.',
  },
  {
    question: 'Where do I see my credits?',
    answer: 'Your remaining credits are shown in the workspace header and workspace body, and they update after successful Stripe payments.',
  },
  {
    question: 'How do I report a failed test run?',
    answer: 'Open a support request with the repository, test case title, and any logs or session details. That gives the fastest resolution path.',
  },
]

const quickTopics = [
  'GitHub connection issue',
  'Credits not updated after payment',
  'BrowserBase session problem',
  'Need help with pricing',
]

const categories = ['Billing', 'GitHub Integration', 'Test Generation', 'Test Execution', 'BrowserBase Logs']
const priorities = ['Low', 'Medium', 'High']

const page = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [selectedPriority, setSelectedPriority] = useState(priorities[1])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const messageLength = useMemo(() => formData.message.trim().length, [formData.message])

  const handleQuickTopic = (topic: string) => {
    setFormData((current) => ({
      ...current,
      subject: topic,
      message: current.message || `Hi team, I need help with: ${topic}.`,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please complete all required fields before submitting.')
      return
    }

    toast.success('Your support request is ready to send. We will respond shortly.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setSelectedCategory(categories[0])
    setSelectedPriority(priorities[1])
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_34%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Support Center
              </Badge>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Raise a query and get help without leaving the workspace.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Use this support page to report billing issues, GitHub connection problems, test-generation questions, or BrowserBase execution errors.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {supportChannels.map((channel) => {
                  const Icon = channel.icon

                  return (
                    <Card key={channel.title} className="border-white/10 bg-background/60 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-background/80">
                      <CardHeader className="pb-3">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{channel.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-6 text-muted-foreground">{channel.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <Card className="border-white/10 bg-background/70 shadow-xl shadow-cyan-950/20">
              <CardHeader>
                <CardTitle className="text-2xl">Support request preview</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  Choose the right topic and priority before you submit the query.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Category</Label>
                    <span className="text-xs text-cyan-300">Selected: {selectedCategory}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        type="button"
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Priority</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {priorities.map((priority) => (
                      <Button
                        key={priority}
                        type="button"
                        variant={selectedPriority === priority ? 'default' : 'outline'}
                        onClick={() => setSelectedPriority(priority)}
                        className={selectedPriority === priority ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                      >
                        {priority}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">What to include</p>
                  <p className="mt-2 leading-6">Share the repo name, test case title, error logs, screenshots, or BrowserBase session details so the team can help faster.</p>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <span className="text-muted-foreground">Support response target</span>
                  <span className="font-medium text-cyan-300">Within 24 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-white/10 bg-white/5 shadow-xl shadow-cyan-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Quick topics</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Tap a topic to fill the support form faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleQuickTopic(topic)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-left text-sm text-foreground transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                >
                  <span className="flex items-center gap-3">
                    <MessageSquareText className="h-4 w-4 text-cyan-300" />
                    {topic}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 shadow-xl shadow-cyan-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Raise a query</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Fill in the details and submit your support request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Enter your name"
                      className="border-white/10 bg-background/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                      placeholder="name@company.com"
                      className="border-white/10 bg-background/60"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
                    placeholder="What do you need help with?"
                    className="border-white/10 bg-background/60"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="message">Query details</Label>
                    <span className="text-xs text-muted-foreground">{messageLength} characters</span>
                  </div>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                    placeholder="Explain the issue, include repo names, error messages, and any session details."
                    className="min-h-45 border-white/10 bg-background/60"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TriangleAlert className="h-4 w-4 text-cyan-300" />
                    {selectedCategory} · {selectedPriority} priority
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock3 className="h-4 w-4 text-cyan-300" />
                    Review queue is active
                  </div>
                </div>

                <Button type="submit" className="w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 sm:w-auto">
                  Submit support request
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Card className="border-white/10 bg-white/5 shadow-xl shadow-cyan-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Support FAQ</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Common questions answered before you send a ticket.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {supportFaq.map((item, index) => (
                  <AccordionItem key={item.question} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 shadow-xl shadow-cyan-950/20">
            <CardHeader>
              <CardTitle className="text-2xl">Need a faster route?</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Use the shortcuts below to reach the right section of the product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-between border-white/10 bg-background/60 hover:bg-white/10">
                <a href="/workspace">
                  Back to workspace
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between border-white/10 bg-background/60 hover:bg-white/10">
                <a href="/workspace/pricing">
                  Review pricing and credits
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                <p className="font-semibold">Pro tip</p>
                <p className="mt-1 text-cyan-200/90">
                  Include your repo name and BrowserBase session URL if you are reporting a failing run. That gives the support team the fastest path to reproduce.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

export default page