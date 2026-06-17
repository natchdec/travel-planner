import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, Bell, FileText, Zap } from 'lucide-react'

// Mock Data: US Stocks Top Picks
const topStocks = [
  { symbol: "S&P 500", name: "S&P 500 Index", price: "5,147.21", change: "+0.73%", isUp: true, target: "5,300", recommendation: "BUY" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "926.69", change: "+4.12%", isUp: true, target: "1,100", recommendation: "BUY" },
  { symbol: "AAPL", name: "Apple Inc.", price: "173.50", change: "-0.85%", isUp: false, target: "195", recommendation: "HOLD" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: "416.42", change: "+1.24%", isUp: true, target: "450", recommendation: "BUY" },
];

// Mock Data: Upcoming Bonds (Thai Corporate Bonds)
const upcomingBonds = [
  { issuer: "CPALL", coupon: "3.25%", maturity: "3 Years", rating: "A+", date: "Jun 20-22, 2026", month: "June" },
  { issuer: "GULF", coupon: "3.50%", maturity: "5 Years", rating: "A+", date: "Jun 25-27, 2026", month: "June" },
  { issuer: "SIRI (แสนสิริ)", coupon: "4.60%", maturity: "2.5 Years", rating: "BBB+", date: "Jul 05-07, 2026", month: "July" },
  { issuer: "PTT", coupon: "3.00%", maturity: "7 Years", rating: "AAA", date: "Jul 15-18, 2026", month: "July" },
  { issuer: "MINT", coupon: "4.25%", maturity: "4 Years", rating: "A", date: "Aug 02-04, 2026", month: "August" },
];

// Mock Data: Insights
const marketInsights = [
  {
    date: "TODAY",
    title: "AI Boom Continues: Why Tech Sector Still Has Upside",
    desc: "Analysts predict a further 15% growth in semiconductor revenues this quarter. NVDA remains the top pick.",
    tags: ["Tech", "AI", "Equities"]
  },
  {
    date: "YESTERDAY",
    title: "Fed Interest Rate Speculation: Time to Lock in Yields?",
    desc: "With rates expected to drop next year, securing 5%+ yields on high-grade corporate bonds now might be a strategic move.",
    tags: ["Bonds", "Fed", "Macro"]
  }
];

function App() {
  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <div className="logo-icon">
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <h1>ProVest <span style={{fontWeight: 300, color: 'var(--text-muted)'}}>Analytics</span></h1>
        </div>
        <div className="user-profile">
          <Bell size={20} />
          <span style={{fontSize: '0.9rem', fontWeight: 500}}>Dashboard</span>
        </div>
      </header>

      <div className="dashboard-grid">
        
        {/* Left Column */}
        <div className="main-column">
          
          <div className="section-title">
            <TrendingUp size={24} /> US Stock Top Picks
          </div>
          
          <div className="stock-grid">
            {topStocks.map((stock, i) => (
              <div key={i} className="stock-card">
                <div className="stock-header">
                  <div>
                    <div className="stock-symbol">{stock.symbol}</div>
                    <div className="stock-name">{stock.name}</div>
                  </div>
                  <div className={`badge badge-${stock.recommendation.toLowerCase()}`}>
                    {stock.recommendation}
                  </div>
                </div>
                
                <div className="stock-price">${stock.price}</div>
                <div className={`stock-change ${stock.isUp ? 'positive' : 'negative'}`}>
                  {stock.isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stock.change}
                </div>

                <div className="stock-metrics">
                  <div className="metric">
                    <span className="metric-label">Target Price</span>
                    <span className="metric-value">${stock.target}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Signal</span>
                    <span className="metric-value" style={{color: stock.recommendation === 'BUY' ? 'var(--accent-green)' : stock.recommendation === 'SELL' ? 'var(--accent-red)' : '#f59e0b'}}>{stock.recommendation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-title" style={{marginTop: '4rem'}}>
            <FileText size={24} /> ปฏิทินหุ้นกู้ไทยออกใหม่
          </div>
          
          <div className="bonds-container">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Issuer</th>
                  <th>Coupon</th>
                  <th>Maturity</th>
                  <th>Rating</th>
                  <th>Subscription Date</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBonds.map((bond, i) => (
                  <tr key={i}>
                    <td><span className="badge" style={{background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)'}}>{bond.month}</span></td>
                    <td style={{fontWeight: 600}}>{bond.issuer}</td>
                    <td style={{color: 'var(--accent-green)', fontWeight: 600}}>{bond.coupon}</td>
                    <td>{bond.maturity}</td>
                    <td>{bond.rating}</td>
                    <td>{bond.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Insights */}
        <div className="insights-column">
          <div className="section-title">
            <Zap size={24} /> Trading Insights
          </div>

          {marketInsights.map((insight, i) => (
            <div key={i} className="insight-card">
              <div className="insight-date">{insight.date}</div>
              <div className="insight-title">{insight.title}</div>
              <div className="insight-desc">{insight.desc}</div>
              <div className="tag-container">
                {insight.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}

          <div className="insight-card" style={{background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent)', borderColor: 'var(--accent-blue)'}}>
            <div className="insight-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <BarChart2 size={20} color="var(--accent-blue)" /> Portfolio Strategy
            </div>
            <div className="insight-desc">
              Current market conditions favor a 60/40 split between high-growth Tech equities and high-yield Corporate Bonds. Consider rebalancing before the next Fed meeting.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
