import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

// Lazy imports for all pages - using direct imports for now
import PortalPage from '@/pages/Portal'
import { GroupCockpit } from '@/pages/cockpit/GroupCockpit'
import { EnterpriseCockpit } from '@/pages/cockpit/EnterpriseCockpit'
import { BiddingRisk } from '@/pages/risk/BiddingRisk'
import { BusinessRisk } from '@/pages/risk/BusinessRisk'
import { FinanceRisk } from '@/pages/risk/FinanceRisk'
import { BusinessDealingsRisk } from '@/pages/risk/BusinessDealingsRisk'
import { ModelPlaza } from '@/pages/model/ModelPlaza'
import { ModelOrchestration } from '@/pages/model/ModelOrchestration'
import { RiskInspection } from '@/pages/model/RiskInspection'
import { DisposalWorkbench } from '@/pages/dispatch/DisposalWorkbench'
import { RiskClues } from '@/pages/dispatch/RiskClues'
import { AutoAssign } from '@/pages/dispatch/AutoAssign'
import { Rectification } from '@/pages/dispatch/Rectification'
import { BiddingClues } from '@/pages/penetration/BiddingClues'
import { BusinessClues } from '@/pages/penetration/BusinessClues'
import { FinanceClues } from '@/pages/penetration/FinanceClues'
import { BusinessDealingsClues } from '@/pages/penetration/BusinessDealingsClues'
import { SupplierCockpit } from '@/pages/supplier/SupplierCockpit'
import { IntelligencePlatform } from '@/pages/supplier/IntelligencePlatform'
import { MonitoringModel } from '@/pages/supplier/MonitoringModel'
import { PublicOpinion } from '@/pages/supplier/PublicOpinion'
import { RelationsGraph } from '@/pages/graph/RelationsGraph'
import { ProcurementGraph } from '@/pages/graph/ProcurementGraph'
import { FundsGraph } from '@/pages/graph/FundsGraph'
import { ThreeDimensionalGraph } from '@/pages/graph/ThreeDimensionalGraph'
import { ProjectScorecard } from '@/pages/scorecard/ProjectScorecard'
import { PersonScorecard } from '@/pages/scorecard/PersonScorecard'
import { IndicatorConfig } from '@/pages/scorecard/IndicatorConfig'
import { PolicyQA } from '@/pages/ai-center/PolicyQA'
import { SmartAnalysis } from '@/pages/ai-center/SmartAnalysis'
import { RiskReport } from '@/pages/ai-center/RiskReport'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/portal" replace />} />
          <Route path="/portal" element={<PortalPage />} />

          {/* 驾驶舱 */}
          <Route path="/cockpit/group" element={<GroupCockpit />} />
          <Route path="/cockpit/enterprise" element={<EnterpriseCockpit />} />

          {/* 风险监督 */}
          <Route path="/risk/bidding" element={<BiddingRisk />} />
          <Route path="/risk/business" element={<BusinessRisk />} />
          <Route path="/risk/finance" element={<FinanceRisk />} />
          <Route path="/risk/business-dealings" element={<BusinessDealingsRisk />} />

          {/* 监管模型 */}
          <Route path="/model/plaza" element={<ModelPlaza />} />
          <Route path="/model/orchestration" element={<ModelOrchestration />} />
          <Route path="/model/inspection" element={<RiskInspection />} />

          {/* 风险处置 */}
          <Route path="/dispatch/workbench" element={<DisposalWorkbench />} />
          <Route path="/dispatch/clues" element={<RiskClues />} />
          <Route path="/dispatch/auto-assign" element={<AutoAssign />} />
          <Route path="/dispatch/rectification" element={<Rectification />} />

          {/* 风险线索 */}
          <Route path="/penetration/bidding" element={<BiddingClues />} />
          <Route path="/penetration/business" element={<BusinessClues />} />
          <Route path="/penetration/finance" element={<FinanceClues />} />
          <Route path="/penetration/business-dealings" element={<BusinessDealingsClues />} />

          {/* 供应商情报 */}
          <Route path="/supplier/cockpit" element={<SupplierCockpit />} />
          <Route path="/supplier/intelligence" element={<IntelligencePlatform />} />
          <Route path="/supplier/monitoring-model" element={<MonitoringModel />} />
          <Route path="/supplier/public-opinion" element={<PublicOpinion />} />

          {/* 图谱穿透 */}
          <Route path="/graph/relations" element={<RelationsGraph />} />
          <Route path="/graph/procurement" element={<ProcurementGraph />} />
          <Route path="/graph/funds" element={<FundsGraph />} />
          <Route path="/graph/three-dimensional" element={<ThreeDimensionalGraph />} />

          {/* 记分卡 */}
          <Route path="/scorecard/project" element={<ProjectScorecard />} />
          <Route path="/scorecard/person" element={<PersonScorecard />} />
          <Route path="/scorecard/config" element={<IndicatorConfig />} />

          {/* AI中心 */}
          <Route path="/ai-center/policy-qa" element={<PolicyQA />} />
          <Route path="/ai-center/analysis" element={<SmartAnalysis />} />
          <Route path="/ai-center/risk-report" element={<RiskReport />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
