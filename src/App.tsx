import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bot,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Gauge,
  ImagePlus,
  LayoutDashboard,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

type View = 'dashboard' | 'cases' | 'bookings' | 'customers'
type Modal = 'whatsapp' | 'quote' | 'booking' | null

type RepairItem = {
  id: number
  title: string
  note: string
  price: number
  confidence: number
  enabled: boolean
}

const currency = new Intl.NumberFormat('zh-HK', {
  style: 'currency',
  currency: 'HKD',
  maximumFractionDigits: 0,
})

const initialItems: RepairItem[] = [
  {
    id: 1,
    title: '前泵把局部補油',
    note: '左前角多處表面刮痕，未見明顯爆裂',
    price: 1800,
    confidence: 96,
    enabled: true,
  },
  {
    id: 2,
    title: '左前沙板輕微拉正',
    note: '接縫位置疑似有 3–5 mm 輕微變形',
    price: 800,
    confidence: 81,
    enabled: true,
  },
  {
    id: 3,
    title: '拆裝及顏色配對',
    note: '包含遮紙、校色及完工檢查',
    price: 600,
    confidence: 92,
    enabled: true,
  },
]

const cases = [
  { id: 'WF-240821', name: '陳嘉明', car: 'Toyota Corolla · 灰', time: '8 分鐘前', status: '待審批', tone: 'amber' },
  { id: 'WF-240820', name: 'Grace Wong', car: 'Tesla Model 3 · 白', time: '26 分鐘前', status: '分析中', tone: 'blue' },
  { id: 'WF-240819', name: '林先生', car: 'Honda Freed · 黑', time: '1 小時前', status: '等候回覆', tone: 'purple' },
  { id: 'WF-240818', name: '何小姐', car: 'BMW 320i · 藍', time: '2 小時前', status: '已預約', tone: 'green' },
]

const appointments = [
  { time: '09:30', name: '何小姐', job: '泵把補油', car: 'BMW 320i', duration: '3 小時', color: 'lime' },
  { time: '11:00', name: '張先生', job: '更換前迫力皮', car: 'Mazda 3', duration: '1.5 小時', color: 'blue' },
  { time: '14:30', name: 'Ada Lee', job: '冷氣檢查', car: 'Toyota Sienta', duration: '1 小時', color: 'orange' },
]

const customers = [
  { initials: '陳', name: '陳嘉明', phone: '9123 4567', vehicle: 'Toyota Corolla', visits: 3, spend: '$8,600', last: '今日' },
  { initials: 'GW', name: 'Grace Wong', phone: '6338 2011', vehicle: 'Tesla Model 3', visits: 1, spend: '$0', last: '今日' },
  { initials: '林', name: '林先生', phone: '9812 0027', vehicle: 'Honda Freed', visits: 5, spend: '$14,200', last: '今日' },
  { initials: '何', name: '何小姐', phone: '5402 9918', vehicle: 'BMW 320i', visits: 2, spend: '$5,800', last: '昨日' },
]

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark"><Wrench size={20} strokeWidth={2.4} /></div>
      <div>
        <strong>WrenchFlow</strong>
        <span>GARAGE OS</span>
      </div>
    </div>
  )
}

function App() {
  const [view, setView] = useState<View>('cases')
  const [items, setItems] = useState<RepairItem[]>(initialItems)
  const [stage, setStage] = useState(2)
  const [modal, setModal] = useState<Modal>(null)
  const [toast, setToast] = useState('')
  const [bookingDate, setBookingDate] = useState('8月21日（星期五）')
  const [bookingTime, setBookingTime] = useState('10:30')

  const subtotal = useMemo(
    () => items.filter((item) => item.enabled).reduce((sum, item) => sum + item.price, 0),
    [items],
  )
  const total = subtotal

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const updateItem = (id: number, patch: Partial<RepairItem>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item))
  }

  const removeItem = (id: number) => setItems((current) => current.filter((item) => item.id !== id))

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        id: Date.now(),
        title: '新增維修項目',
        note: '由車房技師補充',
        price: 0,
        confidence: 100,
        enabled: true,
      },
    ])
  }

  const sendWhatsApp = () => {
    setStage(3)
    setModal(null)
    flash('WhatsApp 報價摘要已發送（Prototype）')
  }

  const acceptQuote = () => {
    setStage(4)
    flash('已模擬客戶確認，正式報價單可以生成')
  }

  const confirmBooking = () => {
    setStage(5)
    setModal(null)
    flash(`預約已確認：${bookingDate} ${bookingTime}`)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Logo />
        <nav className="side-nav" aria-label="主要導覽">
          <NavItem active={view === 'dashboard'} icon={<LayoutDashboard size={19} />} label="總覽" onClick={() => setView('dashboard')} />
          <NavItem active={view === 'cases'} icon={<Sparkles size={19} />} label="AI 詢價中心" badge="5" onClick={() => setView('cases')} />
          <NavItem active={view === 'bookings'} icon={<CalendarDays size={19} />} label="預約日曆" onClick={() => setView('bookings')} />
          <NavItem active={view === 'customers'} icon={<UsersRound size={19} />} label="客戶資料" onClick={() => setView('customers')} />
        </nav>

        <div className="sidebar-spacer" />
        <div className="ai-usage">
          <div className="usage-top"><span><Zap size={15} /> AI 用量</span><b>72%</b></div>
          <div className="usage-bar"><i /></div>
          <small>本月尚餘 284 次分析</small>
        </div>
        <button className="sidebar-setting"><Settings size={18} /> 車房設定</button>
        <div className="profile-mini">
          <div className="avatar">TW</div>
          <div><strong>德和汽車服務</strong><span>管理員</span></div>
          <ChevronRight size={16} />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-brand" onClick={() => setView('dashboard')}><Wrench size={18} /> WF</button>
          <div className="top-search"><Search size={17} /><input aria-label="搜尋" placeholder="搜尋客戶、車牌或案件編號…" /><kbd>⌘ K</kbd></div>
          <div className="top-actions">
            <div className="system-live"><i /> 系統正常</div>
            <button className="icon-btn" aria-label="通知"><Bell size={19} /><i /></button>
            <button className="primary compact" onClick={() => { setView('cases'); flash('已建立新查詢草稿') }}><Plus size={17} /> 新增查詢</button>
          </div>
        </header>

        {view === 'dashboard' && <Dashboard setView={setView} />}
        {view === 'cases' && (
          <CasesView
            items={items}
            stage={stage}
            subtotal={subtotal}
            total={total}
            updateItem={updateItem}
            removeItem={removeItem}
            addItem={addItem}
            setModal={setModal}
            flash={flash}
            acceptQuote={acceptQuote}
          />
        )}
        {view === 'bookings' && <BookingsView onNew={() => setModal('booking')} />}
        {view === 'customers' && <CustomersView />}
      </main>

      {modal === 'whatsapp' && (
        <WhatsAppModal
          total={total}
          items={items.filter((item) => item.enabled)}
          onClose={() => setModal(null)}
          onSend={sendWhatsApp}
        />
      )}
      {modal === 'quote' && (
        <QuoteModal total={total} items={items.filter((item) => item.enabled)} onClose={() => setModal(null)} onBook={() => setModal('booking')} />
      )}
      {modal === 'booking' && (
        <BookingModal
          bookingDate={bookingDate}
          bookingTime={bookingTime}
          setBookingDate={setBookingDate}
          setBookingTime={setBookingTime}
          onClose={() => setModal(null)}
          onConfirm={confirmBooking}
        />
      )}
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  )
}

function NavItem({ active, icon, label, badge, onClick }: { active: boolean; icon: React.ReactNode; label: string; badge?: string; onClick: () => void }) {
  return (
    <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}<span>{label}</span>{badge && <b>{badge}</b>}
    </button>
  )
}

function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return (
    <div className="page-heading">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  )
}

function Dashboard({ setView }: { setView: (view: View) => void }) {
  return (
    <div className="page-content">
      <PageHeading eyebrow="19 AUG · 星期三" title="早晨，德和團隊" description="有 5 個 AI 分析等候審批，今日 3 個預約。" actions={<button className="primary" onClick={() => setView('cases')}><Sparkles size={17} /> 處理 AI 建議</button>} />
      <section className="metric-grid">
        <Metric icon={<Bot size={20} />} label="新查詢" value="8" delta="+3 今日" tone="dark" />
        <Metric icon={<Clock3 size={20} />} label="待審批" value="5" delta="最快 2 分鐘" tone="amber" />
        <Metric icon={<CalendarDays size={20} />} label="今日預約" value="3" delta="尚餘 2 個時段" tone="blue" />
        <Metric icon={<CircleDollarSign size={20} />} label="本月報價" value="$86.4k" delta="↑ 12.8%" tone="green" />
      </section>

      <section className="dashboard-grid">
        <div className="panel cases-panel">
          <div className="panel-header"><div><span className="eyebrow">INBOX</span><h2>最新查詢</h2></div><button className="text-button" onClick={() => setView('cases')}>全部查看 <ArrowRight size={15} /></button></div>
          <div className="case-table">
            {cases.map((item, index) => (
              <button className="case-row" key={item.id} onClick={() => setView('cases')}>
                <div className="case-avatar">{item.name.slice(0, 1)}</div>
                <div className="case-main"><strong>{item.name}</strong><span>{item.car}</span></div>
                <div className="case-id">{item.id}</div>
                <div><span className={`status ${item.tone}`}>{item.status}</span></div>
                <time>{item.time}</time>
                <ChevronRight size={17} className={index === 0 ? 'accent-chevron' : ''} />
              </button>
            ))}
          </div>
        </div>

        <div className="panel revenue-panel">
          <div className="panel-header"><div><span className="eyebrow">CONVERSION</span><h2>報價轉換</h2></div><button className="filter-btn">過去 30 日 <ChevronDown size={14} /></button></div>
          <div className="conversion-number"><b>68<span>%</span></b><small>↑ 8.4% 對比上月</small></div>
          <div className="mini-chart" aria-label="報價轉換趨勢圖">
            {[38, 52, 44, 66, 57, 74, 70, 83, 78, 92, 88, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
          <div className="chart-labels"><span>7月21</span><span>8月19</span></div>
        </div>
      </section>

      <section className="panel schedule-strip">
        <div className="panel-header"><div><span className="eyebrow">TODAY</span><h2>今日工場排程</h2></div><button className="text-button" onClick={() => setView('bookings')}>打開日曆 <ArrowRight size={15} /></button></div>
        <div className="schedule-list">
          {appointments.map((item) => (
            <div className="schedule-item" key={item.time}>
              <time>{item.time}</time><i className={item.color} />
              <div><strong>{item.name} · {item.job}</strong><span>{item.car} · 預計 {item.duration}</span></div>
              <span className="bay">升降台 {item.time === '09:30' ? 'A' : item.time === '11:00' ? 'B' : 'A'}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Metric({ icon, label, value, delta, tone }: { icon: React.ReactNode; label: string; value: string; delta: string; tone: string }) {
  return <div className={`metric-card ${tone}`}><div className="metric-top"><span>{icon}</span><small>{label}</small></div><b>{value}</b><p>{delta}</p></div>
}

type CasesViewProps = {
  items: RepairItem[]
  stage: number
  subtotal: number
  total: number
  updateItem: (id: number, patch: Partial<RepairItem>) => void
  removeItem: (id: number) => void
  addItem: () => void
  setModal: (modal: Modal) => void
  flash: (message: string) => void
  acceptQuote: () => void
}

function CasesView({ items, stage, subtotal, total, updateItem, removeItem, addItem, setModal, flash, acceptQuote }: CasesViewProps) {
  return (
    <div className="page-content case-page">
      <div className="case-topline">
        <button className="back-btn"><ArrowLeft size={18} /></button>
        <div><span className="eyebrow">AI 詢價中心 / WF-240821</span><h1>陳嘉明 · Toyota Corolla</h1></div>
        <div className="case-actions"><span className="status amber"><i /> 待車房審批</span><button className="icon-btn"><MoreHorizontal size={19} /></button></div>
      </div>

      <StageTracker stage={stage} />

      <div className="workbench-grid">
        <div className="workbench-left">
          <section className="panel customer-card">
            <div className="customer-line">
              <div className="avatar large">陳</div>
              <div><strong>陳嘉明</strong><span><MessageCircle size={14} /> WhatsApp · 9123 4567</span></div>
              <button className="outline small"><UserRound size={15} /> 客戶資料</button>
            </div>
            <div className="vehicle-meta">
              <div><span>車輛</span><strong>Toyota Corolla 2019</strong></div>
              <div><span>車牌</span><strong>WA 8231</strong></div>
              <div><span>里數</span><strong>68,420 km</strong></div>
            </div>
            <blockquote>「今日泊車唔小心撞到石壆，左邊泵把花咗同好似凹咗少少。想問整返大概幾錢，同埋最快幾時有位？」</blockquote>
          </section>

          <section className="panel photo-panel">
            <div className="panel-header"><div><span className="eyebrow">CUSTOMER UPLOAD</span><h2>車損相片</h2></div><button className="outline small"><ImagePlus size={15} /> 加相片</button></div>
            <div className="damage-photo">
              <img src="/demo-bumper-damage.png" alt="灰色汽車左前泵把刮花的示範相片" />
              <span className="photo-count"><Camera size={14} /> 1 / 1</span>
              <span className="damage-pin"><i />1</span>
              <div className="scan-line" />
            </div>
            <div className="photo-caption"><ShieldCheck size={17} /><div><strong>AI 已完成視覺檢查</strong><span>相片清晰度良好 · 未發現車牌或人臉私隱風險</span></div><b>94% 清晰</b></div>
          </section>

          <section className="risk-note">
            <AlertTriangle size={19} />
            <div><strong>只靠相片無法排除內部損壞</strong><p>建議報價列明「到店後需檢查泵把支架、雷達及沙板內襯」。AI 結果只作初步建議，並非機械診斷。</p></div>
          </section>
        </div>

        <div className="workbench-right">
          <section className="panel ai-card">
            <div className="ai-header">
              <div className="ai-icon"><Sparkles size={21} /></div>
              <div><span className="eyebrow">AI DRAFT · 18 秒完成</span><h2>初步維修建議</h2></div>
              <div className="confidence-ring"><span>89%</span><small>信心</small></div>
            </div>

            <div className="finding"><span>AI 觀察</span><p>左前泵把有 3 組表面刮痕；近輪拱位置有輕微凹陷，未見頭燈破損或液體滲漏。建議先以局部補油方案報價。</p></div>

            <div className="line-items-head"><span>維修項目</span><span>AI 信心</span><span>金額</span><span /></div>
            <div className="line-items">
              {items.map((item) => (
                <div className={`repair-item ${!item.enabled ? 'disabled' : ''}`} key={item.id}>
                  <label className="checkbox"><input type="checkbox" checked={item.enabled} onChange={(event) => updateItem(item.id, { enabled: event.target.checked })} /><span><Check size={13} /></span></label>
                  <div className="repair-copy">
                    <input value={item.title} aria-label="維修項目" onChange={(event) => updateItem(item.id, { title: event.target.value })} />
                    <textarea value={item.note} aria-label="項目說明" rows={1} onChange={(event) => updateItem(item.id, { note: event.target.value })} />
                  </div>
                  <span className={`confidence ${item.confidence < 85 ? 'medium' : ''}`}>{item.confidence}%</span>
                  <div className="price-input"><span>$</span><input type="number" value={item.price} aria-label={`${item.title} 金額`} onChange={(event) => updateItem(item.id, { price: Number(event.target.value) || 0 })} /></div>
                  <button className="delete-btn" aria-label={`刪除 ${item.title}`} onClick={() => removeItem(item.id)}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <button className="add-line" onClick={addItem}><Plus size={15} /> 新增維修項目</button>

            <div className="quote-totals">
              <div><span>小計</span><b>{currency.format(subtotal)}</b></div>
              <div><span>預留調整</span><b>—</b></div>
              <div className="grand-total"><span>客戶報價</span><b>{currency.format(total)}</b></div>
              <p><AlertTriangle size={14} /> 最終價格以車輛到店檢查後為準</p>
            </div>

            {stage <= 2 && (
              <div className="approval-actions">
                <button className="outline" onClick={() => flash('草稿已儲存')}><FileText size={17} /> 儲存草稿</button>
                <button className="primary grow" onClick={() => setModal('whatsapp')}><CheckCircle2 size={17} /> 批准並預覽 WhatsApp</button>
              </div>
            )}
            {stage === 3 && (
              <div className="waiting-card"><div><CheckCircle2 size={19} /><span><strong>報價摘要已發送</strong><small>等待客戶回覆 · 剛剛</small></span></div><button className="primary" onClick={acceptQuote}>模擬客戶同意</button></div>
            )}
            {stage >= 4 && (
              <div className="confirmed-card"><div><CheckCircle2 size={20} /><span><strong>{stage === 5 ? '報價及預約已確認' : '客戶已同意初步報價'}</strong><small>{stage === 5 ? '8月21日 10:30 到店' : '可以生成正式報價及安排時間'}</small></span></div><div><button className="outline small" onClick={() => setModal('quote')}><FileCheck2 size={15} /> 查看報價單</button>{stage === 4 && <button className="primary small" onClick={() => setModal('booking')}><CalendarDays size={15} /> 安排預約</button>}</div></div>
            )}
          </section>

          <div className="activity-line"><span className="activity-icon"><Bot size={16} /></span><div><strong>WrenchFlow AI</strong> 分析了 1 張相片並建立 3 個建議項目 <time>今日 09:42</time></div></div>
        </div>
      </div>
    </div>
  )
}

function StageTracker({ stage }: { stage: number }) {
  const steps = ['收到查詢', 'AI 分析', '車房審批', '已發給客戶', '確認報價', '完成預約']
  return (
    <div className="stage-tracker">
      {steps.map((label, index) => (
        <div className={`stage ${index <= stage ? 'done' : ''} ${index === stage ? 'current' : ''}`} key={label}>
          <span>{index < stage ? <Check size={13} /> : index + 1}</span><small>{label}</small>{index < steps.length - 1 && <i />}
        </div>
      ))}
    </div>
  )
}

function BookingsView({ onNew }: { onNew: () => void }) {
  const days = [
    { day: '星期一', date: '17', count: 3 }, { day: '星期二', date: '18', count: 4 }, { day: '星期三', date: '19', count: 3, active: true },
    { day: '星期四', date: '20', count: 5 }, { day: '星期五', date: '21', count: 2 }, { day: '星期六', date: '22', count: 4 },
  ]
  return (
    <div className="page-content">
      <PageHeading eyebrow="WORKSHOP CALENDAR" title="預約日曆" description="管理工位、技師時間及客戶到店安排。" actions={<button className="primary" onClick={onNew}><Plus size={17} /> 新增預約</button>} />
      <section className="calendar-toolbar panel"><button className="icon-btn"><ArrowLeft size={18} /></button><div><b>2026 年 8 月</b><span>本週 21 個預約 · 使用率 78%</span></div><button className="icon-btn"><ArrowRight size={18} /></button><button className="outline small">今日</button></section>
      <div className="week-grid">
        {days.map((day) => <div className={`day-card ${day.active ? 'active' : ''}`} key={day.date}><span>{day.day}</span><b>{day.date}</b><small>{day.count} 個預約</small></div>)}
      </div>
      <section className="panel timeline-panel">
        <div className="timeline-head"><span>時間</span><span>升降台 A</span><span>升降台 B</span><span>一般工位</span></div>
        {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time, index) => (
          <div className="timeline-row" key={time}>
            <time>{time}</time>
            <div>{index === 1 && <div className="booking-block lime"><b>何小姐 · BMW 320i</b><span>泵把補油 · 至 12:30</span></div>}{index === 6 && <div className="booking-block orange"><b>Ada Lee · Sienta</b><span>冷氣檢查 · 1 小時</span></div>}</div>
            <div>{index === 2 && <div className="booking-block blue"><b>張先生 · Mazda 3</b><span>前迫力皮 · 至 12:30</span></div>}</div>
            <div>{index === 4 && <div className="booking-block purple"><b>林先生 · Honda Freed</b><span>到店檢查 · 45 分鐘</span></div>}</div>
          </div>
        ))}
      </section>
    </div>
  )
}

function CustomersView() {
  return (
    <div className="page-content">
      <PageHeading eyebrow="CUSTOMER CRM" title="客戶資料" description="每個對話、車輛、報價與維修紀錄集中管理。" actions={<button className="primary"><Plus size={17} /> 新增客戶</button>} />
      <section className="panel customer-list-panel">
        <div className="list-toolbar"><div className="inline-search"><Search size={16} /><input placeholder="搜尋姓名、電話或車牌…" /></div><button className="outline small">所有客戶 <ChevronDown size={14} /></button></div>
        <div className="customer-table-head"><span>客戶</span><span>聯絡</span><span>主要車輛</span><span>到訪</span><span>累計消費</span><span>最近活動</span><span /></div>
        {customers.map((customer) => (
          <button className="customer-table-row" key={customer.phone}>
            <div className="customer-name"><span className="avatar">{customer.initials}</span><strong>{customer.name}</strong></div>
            <span>{customer.phone}</span><span>{customer.vehicle}</span><span>{customer.visits} 次</span><b>{customer.spend}</b><span>{customer.last}</span><ChevronRight size={16} />
          </button>
        ))}
      </section>
    </div>
  )
}

function ModalShell({ children, onClose, wide = false }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose() }}><div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true">{children}<button className="modal-close" onClick={onClose} aria-label="關閉"><X size={19} /></button></div></div>
}

function WhatsAppModal({ total, items, onClose, onSend }: { total: number; items: RepairItem[]; onClose: () => void; onSend: () => void }) {
  const [message, setMessage] = useState(`陳先生你好 👋\n\n我哋已睇過你傳來嘅相片，初步建議如下：\n${items.map((item) => `• ${item.title}：${currency.format(item.price)}`).join('\n')}\n\n初步合計：${currency.format(total)}\n\n⚠️ 最終價格需到店檢查後確認，特別係泵把內部支架同感應器。你覺得初步報價可以嗎？`)
  return (
    <ModalShell onClose={onClose}>
      <div className="modal-kicker whatsapp"><MessageCircle size={18} /> WHATSAPP PREVIEW</div>
      <h2>先睇清楚，然後先發送</h2><p className="modal-subtitle">訊息只包含已勾選項目。你可以在下方直接修改字句。</p>
      <div className="phone-preview">
        <div className="phone-head"><ArrowLeft size={16} /><span className="avatar small">陳</span><div><strong>陳嘉明</strong><small>online</small></div></div>
        <textarea value={message} aria-label="WhatsApp 訊息" onChange={(event) => setMessage(event.target.value)} />
        <span className="message-time">09:48 <Check size={12} /></span>
      </div>
      <div className="modal-note"><ShieldCheck size={17} /><span><strong>人工把關已開啟</strong> 此操作在 prototype 只更新流程狀態，不會真的傳送訊息。</span></div>
      <div className="modal-actions"><button className="outline" onClick={onClose}>返回修改</button><button className="whatsapp-button" onClick={onSend}><Send size={17} /> 模擬 WhatsApp 發送</button></div>
    </ModalShell>
  )
}

function QuoteModal({ total, items, onClose, onBook }: { total: number; items: RepairItem[]; onClose: () => void; onBook: () => void }) {
  return (
    <ModalShell onClose={onClose} wide>
      <div className="modal-kicker"><FileCheck2 size={18} /> QUOTATION GENERATED</div>
      <div className="quote-paper">
        <div className="quote-brand"><Logo /><div><span>報價單</span><strong>#QT-240821</strong></div></div>
        <div className="quote-meta"><div><span>客戶</span><strong>陳嘉明</strong><small>9123 4567</small></div><div><span>車輛</span><strong>Toyota Corolla 2019</strong><small>WA 8231</small></div><div><span>發出日期</span><strong>2026 年 8 月 19 日</strong><small>有效期 7 日</small></div></div>
        <div className="quote-lines"><div className="quote-line header"><span>項目</span><span>金額</span></div>{items.map((item) => <div className="quote-line" key={item.id}><span><strong>{item.title}</strong><small>{item.note}</small></span><b>{currency.format(item.price)}</b></div>)}</div>
        <div className="quote-final"><span>報價總額 <small>HKD</small></span><b>{currency.format(total)}</b></div>
        <p className="quote-terms">此為相片初步報價。車輛到店後會先檢查泵把支架、泊車感應器及沙板內襯；如發現隱藏損壞，任何額外工程均會先獲客戶確認。</p>
      </div>
      <div className="modal-actions"><button className="outline" onClick={() => window.print()}><Download size={17} /> 列印 / 儲存 PDF</button><button className="primary" onClick={onBook}><CalendarDays size={17} /> 安排到店時間</button></div>
    </ModalShell>
  )
}

function BookingModal({ bookingDate, bookingTime, setBookingDate, setBookingTime, onClose, onConfirm }: { bookingDate: string; bookingTime: string; setBookingDate: (date: string) => void; setBookingTime: (time: string) => void; onClose: () => void; onConfirm: () => void }) {
  const dates = ['8月20日（星期四）', '8月21日（星期五）', '8月22日（星期六）']
  const times = ['09:00', '10:30', '12:00', '14:30', '16:00']
  return (
    <ModalShell onClose={onClose}>
      <div className="modal-kicker"><CalendarDays size={18} /> BOOKING</div>
      <h2>安排車輛到店</h2><p className="modal-subtitle">預計工時 3 小時，系統已篩選有升降台 A 嘅時段。</p>
      <label className="field-label">選擇日期</label><div className="date-options">{dates.map((date) => <button className={date === bookingDate ? 'selected' : ''} key={date} onClick={() => setBookingDate(date)}>{date}</button>)}</div>
      <label className="field-label">選擇到店時間</label><div className="time-options">{times.map((time) => <button className={time === bookingTime ? 'selected' : ''} key={time} onClick={() => setBookingTime(time)}>{time}<small>{time === '10:30' ? '最合適' : '有位'}</small></button>)}</div>
      <div className="booking-summary"><div><Gauge size={18} /><span><strong>升降台 A</strong><small>預留 3 小時 · 1 位技師</small></span></div><b>{bookingDate}<br />{bookingTime}</b></div>
      <div className="modal-actions"><button className="outline" onClick={onClose}>取消</button><button className="primary" onClick={onConfirm}><CheckCircle2 size={17} /> 確認並通知客戶</button></div>
    </ModalShell>
  )
}

export default App
