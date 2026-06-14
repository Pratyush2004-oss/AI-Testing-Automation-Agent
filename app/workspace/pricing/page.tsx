'use client'

import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2, CreditCard, Sparkles } from 'lucide-react'

import { UserDetailContext } from '@/context/UserDetailContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { creditPackages } from '@/lib/credit-packages'

const page = () => {
  const searchParams = useSearchParams()
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const payment = searchParams.get('payment')

    if (payment === 'success') {
      setNotice('Payment completed. Your credits are being updated.')
      refreshUser()
    }

    if (payment === 'canceled') {
      setNotice('Payment was canceled. You can try again whenever you are ready.')
    }
  }, [searchParams])

  const refreshUser = async () => {
    try {
      const result = await axios.get('/api/users')
      setUserDetail(result.data.user)
    } catch (error) {
      // ignore refresh failures and keep the page usable
    }
  }

  const handleCheckout = async (packageId: string) => {
    try {
      setLoadingPackageId(packageId)
      const result = await axios.post('/api/checkout/stripe', { packageId })

      if (result.data?.url) {
        window.location.href = result.data.url
      }
    } catch (error) {
      setNotice('Unable to start checkout. Please try again.')
    } finally {
      setLoadingPackageId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Credit top-up for AI Testing Automation Agent
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Buy credits and keep your testing workflow moving.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Choose a package, complete Stripe checkout, and your credits will be added to the signed-in user automatically after payment succeeds.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Current credits</p>
            <p className="mt-1 text-3xl font-semibold text-cyan-300">{userDetail?.credits ?? 0}</p>
          </div>
        </div>

        {notice ? (
          <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-200">
            {notice}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          {creditPackages.map((plan) => (
            <Card
              key={plan.id}
              className={plan.badge ? 'border-cyan-400/40 bg-cyan-400/10 shadow-xl shadow-cyan-950/20' : 'border-white/10 bg-white/5'}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">{plan.description}</CardDescription>
                  </div>
                  {plan.badge ? <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">{plan.badge}</span> : null}
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-6 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight">₹{(plan.amountCents)}</span>
                  <span className="pb-1 text-sm text-muted-foreground">for {plan.credits.toLocaleString()} credits</span>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loadingPackageId === plan.id}
                  className="mt-6 w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                >
                  {loadingPackageId === plan.id ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Secure checkout with Stripe payment methods enabled
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

export default page