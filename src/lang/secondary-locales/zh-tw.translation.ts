import { type ISecondaryLocalePack, mapTranslationOverlay } from '../secondary-locales.types';
import { zhCn } from './zh-cn.translation';

const HANS = '与专业个为么义习于云产仓仪优会关内写冲决净减凑击则别务动势区协单历压双发变叠号后响围图场块壳处备复头学实审对导将尝层属师带干并库应开异张弹强归当径忆态悬戏户执扩护拟拥择换据掷数断无旧时显术机杂权条来构标树样档检横残没测浏渐滚灵点烟热状独环现电画监盖盘码确离种积稳筛简类紧红约级纸纹线组细终经结络统继绪续维缓编缩网联胜脉脑舱节范营虑装见观规视览觉触计讨让记论设访证识试话该详语误请读调谱败账质资赢趋践轨转轮软轴较输边达过运这进迟适选遥邮针钥钮链错键镜长门闭问闲间阶随隐静页项顺须顾预频题颜饰馈驱验骤';
const HANT = '與專業個為麼義習於雲產倉儀優會關內寫衝決淨減湊擊則別務動勢區協單歷壓雙發變疊號後響圍圖場塊殼處備復頭學實審對導將嘗層屬師帶乾並庫應開異張彈強歸當徑憶態懸戲戶執擴護擬擁擇換據擲數斷無舊時顯術機雜權條來構標樹樣檔檢橫殘沒測瀏漸滾靈點煙熱狀獨環現電畫監蓋盤碼確離種積穩篩簡類緊紅約級紙紋線組細終經結絡統繼緒續維緩編縮網聯勝脈腦艙節範營慮裝見觀規視覽覺觸計討讓記論設訪證識試話該詳語誤請讀調譜敗賬質資贏趨踐軌轉輪軟軸較輸邊達過運這進遲適選遙郵針鑰鈕鏈錯鍵鏡長門閉問閒間階隨隱靜頁項順須顧預頻題顏飾饋驅驗驟';
const TRADITIONAL_CHARACTER = new Map([...HANS].map((value, index) => [value, HANT[index]] as const));
const TAIWAN_TERMS = [
	['作品集', '作品集'], ['数据', '資料'], ['源码', '原始碼'], ['代码', '程式碼'], ['组件', '元件'], ['项目', '專案'], ['服务器', '伺服器'], ['插件', '外掛程式'], ['软件包', '套件'], ['文档', '文件'], ['链接', '連結'], ['工作流', '工作流程'], ['用户', '使用者'], ['控件', '控制項'], ['交互', '互動'], ['响应式', '回應式'], ['响应', '回應'], ['全屏', '全螢幕'], ['屏幕', '螢幕'], ['设备', '裝置'], ['实时', '即時'], ['质量', '品質'], ['反馈', '回饋'], ['视图', '檢視'], ['性能', '效能'], ['邮箱', '電子郵件'], ['布局', '版面配置'], ['文件', '檔案'], ['构建', '建置'], ['打印', '列印'], ['消息', '訊息'], ['应用', '應用程式'], ['网络', '網路'], ['可访问性', '無障礙'], ['类型化', '型別化'], ['类型', '型別'], ['信号', '訊號'], ['仪表盘', '儀表板'], ['重置', '重設'], ['图表', '圖表'], ['图像', '影像'], ['对象', '物件'], ['场景', '場景'], ['字段', '欄位'], ['滚动', '捲動'], ['运行', '執行'], ['部署', '部署'], ['点击', '點選'], ['搜索', '搜尋'], ['表单', '表單'], ['归档', '封存'], ['管道', '管線'], ['令牌', '權杖'], ['信息', '資訊'], ['仓库', '儲存庫'], ['数据面', '資料面'],
] as const;

function traditionalChinese(value: string): string {
	const regional = TAIWAN_TERMS.reduce(
		(current, [simplified, traditional]) => current.replaceAll(simplified, traditional),
		value,
	);
	return [...regional].map((character) => TRADITIONAL_CHARACTER.get(character) ?? character).join('');
}

/** Traditional Chinese (Taiwan) overlay derived with explicit regional terminology. */
export const zhTw: ISecondaryLocalePack = {
	translation: mapTranslationOverlay(zhCn.translation, traditionalChinese),
	earth: {
		categories: { earth: '地球', planets: '行星', exoplanets: '系外行星', balls: '球類', figures: '圖形', playful: '品牌與人像' },
		presets: {
			clouds: '真實雲層', natural: '無雲日間', night: '城市燈光', terrain: '地形圖', bathymetry: '海底地形', infrared: '熱成像', sun: '太陽', moon: '月球', mercury: '水星', venus: '金星', mars: '火星', jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星', pluto: '冥王星', 'kepler-186f': 'Kepler-186f · 藝術構想', 'proxima-b': 'Proxima b · 藝術構想', 'trappist-1e': 'TRAPPIST-1e · 藝術構想', soccer: '足球', basketball: '籃球', tennis: '網球', golf: '高爾夫球', rugby: '橄欖球', volleyball: '排球', 'beach-ball': '海灘球', disco: '迪斯可球', 'cartago-mark': 'Cartago 標誌', 'cartago-banner': 'Cartago 橫幅', portrait: 'Cartago 肖像',
		},
		origins: { observed: '觀測或由資料衍生的地圖', artist: '藝術構想——並非觀測結果', canonical: '原始標準圖樣', owned: 'Cartago 原創內容' },
		closeSphere: '關閉圖形',
	},
} satisfies ISecondaryLocalePack;
