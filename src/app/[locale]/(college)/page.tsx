
import { Web3Hero } from "@/components/web3-hero"
import { TokenExchange } from "@/components/token-exchange"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { ETH_TO_YIDENG_RATIO } from "@/lib/contract-config"
import { getTranslations } from "next-intl/server"

export default async function HomePage() {
  const t = await getTranslations('Home')
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Hero Section */}
      <Web3Hero
        badge={t('badge')}
        title1={t('title1')}
        title2={t('title2')}
        description={t('description')}
      />

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            {t('welcome')}
          </h2>
          <p className="text-foreground/40 max-w-2xl mx-auto">
            {t('guide')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-background/50 to-background/20 p-6 rounded-xl border border-white/[0.05] shadow-sm">
            <div className="w-12 h-12 bg-indigo-500/10 flex items-center justify-center rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('feat1')}</h3>
            <p className="text-foreground/40 mb-4">{t('feat1Desc')}</p>
            <Button variant="link" className="px-0 text-indigo-400 hover:text-indigo-300">
              {t('feat1Btn')} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gradient-to-br from-background/50 to-background/20 p-6 rounded-xl border border-white/[0.05] shadow-sm">
            <div className="w-12 h-12 bg-cyan-500/10 flex items-center justify-center rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('feat2')}</h3>
            <p className="text-foreground/40 mb-4">{t('feat2Desc')}</p>
            <Button variant="link" className="px-0 text-cyan-400 hover:text-cyan-300">
              {t('feat2Btn')} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-gradient-to-br from-background/50 to-background/20 p-6 rounded-xl border border-white/[0.05] shadow-sm">
            <div className="w-12 h-12 bg-purple-500/10 flex items-center justify-center rounded-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('feat3')}</h3>
            <p className="text-foreground/40 mb-4">{t('feat3Desc')}</p>
            <Button variant="link" className="px-0 text-purple-400 hover:text-purple-300">
              {t('feat3Btn')} <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Token Exchange Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              {t('exchange')}
            </h2>
            <p className="text-foreground/40 max-w-2xl mx-auto">
              {t('exchangeDesc')}
            </p>
          </div>

          <TokenExchange className="mx-auto" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 md:py-12 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t('badge')}</h3>
            <p className="text-foreground/40 text-sm">
              {t("title1")}{t("title2")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("product")}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("products")}</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("certification")}</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("token")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("resource")}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("documentation")}</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("blog")}</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("community")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("contact")}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("about")}</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("contactUs")}</a></li>
              <li><a href="#" className="text-foreground/40 hover:text-foreground text-sm">{t("support")}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-foreground/40">
          &copy; {new Date().getFullYear()} {t("statement")}
        </div>
      </footer>
    </div>
  )
}