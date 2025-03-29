"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Menu, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "首页", path: "/" },
    { name: "购买课程", path: "/market" },
    { name: "课程中心", path: "/courses" },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md shadow-md border-b border-white/[0.05]" 
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">一灯大学</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={cn(
                "px-4 py-2 rounded-full transition-all duration-200 font-medium text-sm",
                isActive(link.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Connect Wallet */}
        <div className="hidden md:flex items-center gap-4">
          <ConnectButton 
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-white/[0.05]">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={cn(
                    "px-4 py-3 rounded-md transition-all duration-200 font-medium",
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 border-t border-white/[0.05]">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted
                  const connected = ready && account && chain

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                      className="w-full"
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <Button 
                              onClick={openConnectModal} 
                              className="w-full"
                            >
                              连接钱包
                            </Button>
                          )
                        }

                        return (
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={openChainModal}
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {chain.name}
                              <span>⚪</span>
                            </Button>
                            <Button
                              onClick={openAccountModal}
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {account.displayName}
                              <span>👤</span>
                            </Button>
                          </div>
                        )
                      })()}
                    </div>
                  )
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 