// components/SettingsDialog.tsx
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
  } from "@/components/ui/select"
  import { Checkbox } from "@/components/ui/checkbox"
  import { CogIcon } from "@heroicons/react/24/outline"
  import { Button } from "@/components/ui/button"
  
  type SettingsProps = {
    symbol: string
    minutes: number
    showChart: boolean
    showNews: boolean
    setSymbol: (s: string) => void
    setMinutes: (m: number) => void
    setShowChart: (val: boolean) => void
    setShowNews: (val: boolean) => void
  }
  
  export default function SettingsDialog({
    symbol,
    minutes,
    showChart,
    showNews,
    setSymbol,
    setMinutes,
    setShowChart,
    setShowNews,
  }: SettingsProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <CogIcon className="w-6 h-6 text-gray-400" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Settings</DialogTitle>
          </DialogHeader>
  
          {/* Symbol Selector */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Symbol</label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select Symbol" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                {["BTC", "ETH", "DOGE", "SHIB", "SOL"].map((coin) => (
                  <SelectItem key={coin} value={coin}>
                    {coin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          {/* Time Selector */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Time Range (Minutes)</label>
            <Select value={minutes.toString()} onValueChange={(val) => setMinutes(+val)}>
              <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select Minutes" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                {[5, 15, 30, 60, 120].map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {m} min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
  
          {/* Feature Toggles */}
          <div className="space-y-2 pt-2">
            <label className="text-sm text-gray-400">Features</label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={showChart}
                  onCheckedChange={(val) => setShowChart(!!val)}
                />
                <span className="text-sm text-white">Show Chart</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={showNews}
                  onCheckedChange={(val) => setShowNews(!!val)}
                />
                <span className="text-sm text-white">Show News</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  