"use client"

import * as React from "react"
import Link from "next/link"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Sparkles, Zap } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-700/20 bg-black/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="">
          <Link href="/" className="font-bold text-xl flex items-center gap-2 text-white">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1.5 rounded-md">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Web3 College
            </span>
          </Link>
        </div>
        
        <NavigationMenu className="flex justify-center">
          <NavigationMenuList className="flex gap-4">
            <NavigationMenuItem>
              <Link 
                href="/market" 
                className="group flex h-10 w-max items-center justify-center space-x-2 rounded-md bg-black/30 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500/20 hover:text-purple-300 transition-colors border border-purple-500/20"
              >
                <Sparkles className="h-4 w-4 text-purple-400 group-hover:text-purple-300" />
                <span>购买课程</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                href="/courses" 
                className="group flex h-10 w-max items-center justify-center space-x-2 rounded-md bg-black/30 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500/20 hover:text-blue-300 transition-colors border border-blue-500/20"
              >
                <Zap className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                <span>课程中心</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex justify-end">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-[1px] rounded-lg overflow-hidden">
            <div className="bg-black/60 backdrop-blur-lg rounded-lg">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 