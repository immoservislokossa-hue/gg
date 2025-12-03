"use client"

import React from "react"
import Image from "next/image"

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="w-full bg-blue-700 text-white py-4 px-12 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Image
          src="/PENSIPAY.png"
          alt="Logo PensiPay"
          width={50}
          height={50}
      
        />
        <span className="text-2xl font-bold">{title || "PensiPay"}</span>
      </div>

      {/* Navigation */}
      <nav className="space-x-6">
        <a href="#connect" className="hover:text-yellow-400 transition">Se connecter</a>
        <a href="#balance" className="hover:text-yellow-400 transition">Consulter mon solde</a>
      </nav>
    </header>
  )
}

export default Header
