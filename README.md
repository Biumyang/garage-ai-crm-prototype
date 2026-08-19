# WrenchFlow — Garage AI CRM Prototype

一個為香港車房設計的互動式 CRM prototype，示範如何由客戶 WhatsApp 相片查詢，經 AI 初步分析、車房人工審批，到正式報價與預約。

## Prototype 包含

- 客戶與車輛 CRM 資料
- 車損相片 AI 初步分析介面
- 可勾選、修改、刪除與新增的維修項目
- HKD 報價即時計算
- 車房人工審批閘門與低信心警告
- WhatsApp 訊息預覽及模擬發送
- 正式 quotation 預覽、列印／儲存 PDF
- 可選日期與時段的預約流程
- 總覽、工場日曆及客戶列表
- Desktop / tablet / mobile responsive layout

## 本機啟動

```bash
npm install
npm run dev
```

Production build：

```bash
npm run build
```

## 產品邊界

這是一個前端 prototype。AI 分析、WhatsApp 發送、quotation 儲存與預約通知目前是模擬流程，未連接真實後端或第三方 API。

如要投入真實營運，下一階段至少需要：

1. 相片上載、客戶、車輛、案件與報價資料庫
2. AI vision service，並保存模型版本、信心分數及審批紀錄
3. WhatsApp Business Platform template 與 webhook
4. PDF quotation 產生與不可竄改的版本紀錄
5. 工位、技師、工時與撞期規則
6. 私隱同意、資料保留與刪除流程

## 安全原則

相片分析只能產生「初步建議」，不能取代技師檢查。任何價格及維修項目均須由車房人工批准；對內部損壞、煞車、輪胎、底盤或安全系統有疑問時，必須要求車輛到店檢查。
