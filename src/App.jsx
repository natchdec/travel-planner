import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, Bell, FileText, Zap, X, Filter, Bot, Send } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Mock Data: Expanded US Stocks Top Picks with Chart Data
const topStocks = [
  { 
    symbol: "S&P 500", name: "S&P 500 Index", price: "5,147.21", change: "+0.73%", isUp: true, target: "5,300", recommendation: "BUY",
    history: [{name: 'Mon', val: 5100}, {name: 'Tue', val: 5120}, {name: 'Wed', val: 5110}, {name: 'Thu', val: 5135}, {name: 'Fri', val: 5147}]
  },
  { 
    symbol: "NVDA", name: "NVIDIA Corp.", price: "926.69", change: "+4.12%", isUp: true, target: "1,100", recommendation: "BUY",
    history: [{name: 'Mon', val: 890}, {name: 'Tue', val: 895}, {name: 'Wed', val: 910}, {name: 'Thu', val: 915}, {name: 'Fri', val: 926}]
  },
  { 
    symbol: "AAPL", name: "Apple Inc.", price: "173.50", change: "-0.85%", isUp: false, target: "195", recommendation: "HOLD",
    history: [{name: 'Mon', val: 178}, {name: 'Tue', val: 176}, {name: 'Wed', val: 175}, {name: 'Thu', val: 174}, {name: 'Fri', val: 173}]
  },
  { 
    symbol: "MSFT", name: "Microsoft Corp.", price: "416.42", change: "+1.24%", isUp: true, target: "450", recommendation: "BUY",
    history: [{name: 'Mon', val: 405}, {name: 'Tue', val: 410}, {name: 'Wed', val: 408}, {name: 'Thu', val: 412}, {name: 'Fri', val: 416}]
  },
  { 
    symbol: "META", name: "Meta Platforms", price: "505.22", change: "+2.50%", isUp: true, target: "550", recommendation: "BUY",
    history: [{name: 'Mon', val: 480}, {name: 'Tue', val: 490}, {name: 'Wed', val: 495}, {name: 'Thu', val: 500}, {name: 'Fri', val: 505}]
  },
  { 
    symbol: "GOOGL", name: "Alphabet Inc.", price: "142.65", change: "+1.15%", isUp: true, target: "160", recommendation: "BUY",
    history: [{name: 'Mon', val: 138}, {name: 'Tue', val: 140}, {name: 'Wed', val: 141}, {name: 'Thu', val: 140}, {name: 'Fri', val: 142}]
  },
  { 
    symbol: "TSLA", name: "Tesla Inc.", price: "175.22", change: "-2.30%", isUp: false, target: "160", recommendation: "SELL",
    history: [{name: 'Mon', val: 185}, {name: 'Tue', val: 180}, {name: 'Wed', val: 178}, {name: 'Thu', val: 177}, {name: 'Fri', val: 175}]
  },
  { 
    symbol: "AMZN", name: "Amazon.com Inc.", price: "178.15", change: "+3.20%", isUp: true, target: "210", recommendation: "BUY",
    history: [{name: 'Mon', val: 170}, {name: 'Tue', val: 172}, {name: 'Wed', val: 175}, {name: 'Thu', val: 176}, {name: 'Fri', val: 178}]
  },
];

// Mock Data: Upcoming Bonds (Thai Corporate Bonds)
const upcomingBonds = [
  { issuer: "CPALL", coupon: "3.25%", maturity: "3 Years", rating: "A+", date: "Jun 20-22, 2026", month: "June" },
  { issuer: "GULF", coupon: "3.50%", maturity: "5 Years", rating: "A+", date: "Jun 25-27, 2026", month: "June" },
  { issuer: "SIRI (แสนสิริ)", coupon: "4.60%", maturity: "2.5 Years", rating: "BBB+", date: "Jul 05-07, 2026", month: "July" },
  { issuer: "PTT", coupon: "3.00%", maturity: "7 Years", rating: "AAA", date: "Jul 15-18, 2026", month: "July" },
  { issuer: "MINT", coupon: "4.25%", maturity: "4 Years", rating: "A", date: "Aug 02-04, 2026", month: "August" },
];

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
  // State for Filter
  const [minUpside, setMinUpside] = useState('')
  
  // State for Modal
  const [selectedStock, setSelectedStock] = useState(null)

  // State for AI Planner
  const [apiKey, setApiKey] = useState('')
  const [aiGoal, setAiGoal] = useState('เกษียณอายุ (Retirement)')
  const [aiCapital, setAiCapital] = useState('1,000,000')
  const [aiRisk, setAiRisk] = useState('ปานกลาง (Moderate)')
  const [aiResult, setAiResult] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Filter Logic
  const filteredStocks = topStocks.filter(stock => {
    if (!minUpside) return true;
    const changeVal = parseFloat(stock.change.replace('+', '').replace('%', ''));
    const targetVal = parseFloat(minUpside);
    if (isNaN(targetVal)) return true;
    return changeVal >= targetVal;
  });

  // AI Generation Logic
  const handleGenerateAI = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      alert("Please enter your Gemini API Key first.");
      return;
    }
    
    setIsAiLoading(true);
    setAiResult('');
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `ฉันกำลังใช้เครื่องมือจัดพอร์ต (Portfolio Planner) ช่วยจัดพอร์ตการลงทุนให้ฉันหน่อย โดยมีข้อมูลดังนี้:
      - เป้าหมาย: ${aiGoal}
      - เงินทุนเริ่มต้น: ${aiCapital} บาท
      - ความเสี่ยงที่รับได้: ${aiRisk}
      
      ขอคำแนะนำการจัดสัดส่วน Asset Allocation (เช่น สัดส่วนหุ้นต่างประเทศ, หุ้นไทย, หุ้นกู้, เงินสด) พร้อมเหตุผลสั้นๆ แบบมืออาชีพ และแนะนำหุ้นอเมริกาที่น่าสนใจ 2-3 ตัวเพื่อตอบโจทย์พอร์ตนี้`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResult(response.text());
    } catch (error) {
      console.error(error);
      setAiResult(`❌ เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini API: ${error.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

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

          {/* Smart Filter Bar */}
          <div className="filter-bar">
            <Filter size={20} color="var(--accent-blue)" />
            <span style={{fontWeight: 600}}>Smart Filter:</span>
            <span>แสดงเฉพาะหุ้นที่บวกเกิน</span>
            <input 
              type="number" 
              className="filter-input" 
              placeholder="เช่น 2" 
              value={minUpside}
              onChange={(e) => setMinUpside(e.target.value)}
            />
            <span>% ขึ้นไป</span>
          </div>
          
          <div className="stock-grid">
            {filteredStocks.map((stock, i) => (
              <div 
                key={i} 
                className="stock-card" 
                style={{cursor: 'pointer'}}
                onClick={() => setSelectedStock(stock)}
              >
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
            
            {filteredStocks.length === 0 && (
              <div style={{color: 'var(--text-muted)', padding: '2rem'}}>ไม่พบหุ้นที่ตรงตามเงื่อนไข</div>
            )}
          </div>

          {/* AI Portfolio Planner Section */}
          <div className="ai-planner-container">
            <div className="section-title" style={{marginBottom: '0.5rem', color: 'var(--accent-blue)'}}>
              <Bot size={28} /> Gemini AI Portfolio Architect
            </div>
            <p style={{color: 'var(--text-muted)', marginBottom: '2rem'}}>ให้ AI ช่วยวิเคราะห์และจัดสัดส่วนพอร์ตการลงทุนแบบเจาะลึก</p>

            <form onSubmit={handleGenerateAI}>
              <div className="form-grid">
                <div>
                  <label style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)'}}>Gemini API Key (Required)</label>
                  <input type="password" required className="ai-input" placeholder="AIzaSy..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
                </div>
                <div>
                  <label style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)'}}>เป้าหมายการลงทุน (Goal)</label>
                  <input type="text" className="ai-input" value={aiGoal} onChange={e => setAiGoal(e.target.value)} />
                </div>
                <div>
                  <label style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)'}}>เงินทุนตั้งต้น (THB)</label>
                  <input type="text" className="ai-input" value={aiCapital} onChange={e => setAiCapital(e.target.value)} />
                </div>
                <div>
                  <label style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)'}}>ความเสี่ยงที่รับได้ (Risk)</label>
                  <select className="ai-input" value={aiRisk} onChange={e => setAiRisk(e.target.value)}>
                    <option value="ต่ำ (Low)">ต่ำ (Low)</option>
                    <option value="ปานกลาง (Moderate)">ปานกลาง (Moderate)</option>
                    <option value="สูง (High)">สูง (High)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-ai" disabled={isAiLoading}>
                {isAiLoading ? "กำลังให้ Gemini วิเคราะห์..." : <><Send size={18} /> วิเคราะห์พอร์ตเลย</>}
              </button>
            </form>

            {aiResult && (
              <div className="ai-result">
                {aiResult}
              </div>
            )}
          </div>

          <div className="section-title">
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

      {/* Stock Detail Modal */}
      {selectedStock && (
        <div className="modal-overlay" onClick={() => setSelectedStock(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{selectedStock.symbol} <span style={{fontWeight: 300, color: 'var(--text-muted)'}}>({selectedStock.name})</span></h2>
                <div style={{fontSize: '1.2rem', color: selectedStock.isUp ? 'var(--accent-green)' : 'var(--accent-red)'}}>
                  ${selectedStock.price} {selectedStock.change}
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedStock(null)}><X size={32} /></button>
            </div>
            
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedStock.history}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" />
                  <Tooltip 
                    contentStyle={{background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px'}}
                    itemStyle={{color: 'var(--accent-blue)', fontWeight: 600}}
                  />
                  <Line type="monotone" dataKey="val" stroke="var(--accent-blue)" strokeWidth={3} dot={{r: 4, fill: 'var(--bg-card)'}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="stock-metrics" style={{marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
              <div className="metric">
                <span className="metric-label">Analyst Target</span>
                <span className="metric-value" style={{fontSize: '1.2rem'}}>${selectedStock.target}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Consensus</span>
                <span className={`badge badge-${selectedStock.recommendation.toLowerCase()}`} style={{width: 'fit-content', marginTop: '0.5rem'}}>{selectedStock.recommendation}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Market Cap</span>
                <span className="metric-value" style={{fontSize: '1.2rem'}}>{selectedStock.symbol === 'S&P 500' ? '-' : 'Trillions'}</span>
              </div>
              <div className="metric">
                <span className="metric-label">P/E Ratio</span>
                <span className="metric-value" style={{fontSize: '1.2rem'}}>{selectedStock.symbol === 'S&P 500' ? '25.4' : '32.1'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
